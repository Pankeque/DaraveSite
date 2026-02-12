import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db, pool } from "./db";
import {
  registrations,
  users,
  insertRegistrationSchema,
  insertUserSchema,
  loginSchema,
  gameSubmissions,
  assetSubmissions,
  insertGameSubmissionSchema,
  insertAssetSubmissionSchema,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cors from "cors";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(server: Server, app: Express): Promise<void> {
  // Compression middleware for better performance
  app.use(compression());

  // CORS configuration for cross-origin cookie support
  app.use(cors({
    origin: process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL || "https://your-production-domain.com"]
      : ["http://localhost:5000", "http://localhost:3000", "http://127.0.0.1:5000"],
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  // Rate limiting for API endpoints
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Stricter rate limiting for auth endpoints (increased from 5 to 10)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many authentication attempts, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to API routes
  app.use("/api/", apiLimiter);

  // PostgreSQL session store for persistent sessions
  const PgSessionStore = connectPgSimple(session);
  const sessionStore = new PgSessionStore({
    pool,
    tableName: "session", // Will create this table automatically
    createTableIfMissing: true,
  });

  // DEBUG: Log session configuration
  console.log("[INFO] Session Configuration:");
  console.log("  - NODE_ENV:", process.env.NODE_ENV);
  console.log("  - SESSION_SECRET set:", !!process.env.SESSION_SECRET);
  console.log("  - DATABASE_URL set:", !!process.env.DATABASE_URL);
  console.log("  - Cookie secure:", process.env.NODE_ENV === "production");
  console.log("  - Session store: PostgreSQL");

  // Session middleware with PostgreSQL store
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "darave-studios-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Required for cross-origin in production
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Registration endpoint
  app.post("/api/registrations", async (req: Request, res: Response) => {
    try {
      const data = insertRegistrationSchema.parse(req.body);
      const [registration] = await db.insert(registrations).values(data).returning();
      res.status(201).json(registration);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Auth - Register
  app.post("/api/auth/register", authLimiter, async (req: Request, res: Response) => {
    console.log("[DEBUG] Register attempt:", { email: req.body?.email, name: req.body?.name });
    try {
      const data = insertUserSchema.parse(req.body);
      console.log("[DEBUG] Parsed data successfully");
      
      // Check if user already exists
      const existingUsers = await db.select().from(users).where(eq(users.email, data.email));
      const existingUser = existingUsers[0];
      console.log("[DEBUG] Existing user check:", existingUser ? "found" : "not found");

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      console.log("[DEBUG] Password hashed");

      // Create user
      const [user] = await db
        .insert(users)
        .values({
          ...data,
          password: hashedPassword,
        })
        .returning();
      console.log("[DEBUG] User created:", { id: user.id, email: user.email });

      // Set session and ensure it's saved before responding
      req.session.userId = user.id;
      console.log("[DEBUG] Session set:", { userId: req.session.userId, sessionID: req.sessionID });
      
      // Save session explicitly before sending response
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("[DEBUG] Session save error:", err);
            reject(err);
          } else {
            console.log("[DEBUG] Session saved successfully");
            resolve();
          }
        });
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      console.error("[DEBUG] Register error:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Auth - Login
  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    console.log("[DEBUG] Login attempt:", { email: req.body?.email });
    try {
      const data = loginSchema.parse(req.body);
      console.log("[DEBUG] Login data parsed successfully");

      const userResults = await db.select().from(users).where(eq(users.email, data.email));
      const user = userResults[0];
      console.log("[DEBUG] User lookup:", user ? "found" : "not found");

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);
      console.log("[DEBUG] Password validation:", validPassword ? "valid" : "invalid");

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session and ensure it's saved before responding
      req.session.userId = user.id;
      console.log("[DEBUG] Session userId set:", req.session.userId, "sessionID:", req.sessionID);
      
      // Save session explicitly before sending response
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("[DEBUG] Session save error:", err);
            reject(err);
          } else {
            console.log("[DEBUG] Session saved successfully");
            resolve();
          }
        });
      });

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      console.error("[DEBUG] Login error:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Auth - Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    console.log("[DEBUG] Logout attempt");
    req.session.destroy((err: Error | null) => {
      if (err) {
        console.error("[DEBUG] Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Auth - Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    console.log("[DEBUG] Auth check - Session userId:", req.session.userId);
    console.log("[DEBUG] Auth check - Session ID:", req.sessionID);
    console.log("[DEBUG] Auth check - Cookies:", req.headers.cookie);
    
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const userResults = await db.select().from(users).where(eq(users.id, req.session.userId));
      const user = userResults[0];

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("[DEBUG] Auth me error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Game Submission endpoint
  app.post("/api/submissions/game", async (req: Request, res: Response) => {
    console.log("[DEBUG] Game submission request body:", req.body);
    try {
      const data = insertGameSubmissionSchema.parse(req.body);
      console.log("[DEBUG] Parsed game data:", data);
      const [submission] = await db.insert(gameSubmissions).values(data).returning();
      console.log("[DEBUG] Game submission saved:", submission);
      res.status(201).json({ 
        message: "Game submission saved successfully", 
        submission 
      });
    } catch (error: any) {
      console.error("[ERROR] Game submission error:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Asset Submission endpoint
  app.post("/api/submissions/asset", async (req: Request, res: Response) => {
    console.log("[DEBUG] Asset submission request body:", req.body);
    try {
      const data = insertAssetSubmissionSchema.parse(req.body);
      console.log("[DEBUG] Parsed asset data:", data);
      const [submission] = await db.insert(assetSubmissions).values(data).returning();
      console.log("[DEBUG] Asset submission saved:", submission);
      res.status(201).json({ 
        message: "Asset submission saved successfully", 
        submission 
      });
    } catch (error: any) {
      console.error("[ERROR] Asset submission error:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
}
