import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import {
  registrations,
  users,
  insertRegistrationSchema,
  insertUserSchema,
  loginSchema,
  blogPosts,
  insertBlogPostSchema,
  newsletterSubscriptions,
  insertNewsletterSchema,
  ticketmaticsServers,
  ticketmaticsTickets,
  ticketmaticsMessages,
  visucordServers,
  visucordStats,
  visucordChannelStats
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import bcrypt from "bcryptjs";
import compression from "compression";
import rateLimit from "express-rate-limit";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(server: Server, app: Express): Promise<void> {
  // Compression middleware for better performance
  app.use(compression());

  // Rate limiting for API endpoints
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many authentication attempts, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to API routes
  app.use("/api/", apiLimiter);

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "darave-studios-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
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
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const [user] = await db
        .insert(users)
        .values({
          ...data,
          password: hashedPassword,
        })
        .returning();

      // Set session
      req.session.userId = user.id;

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Auth - Login
  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);

      const user = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Auth - Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Auth - Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.session.userId),
      });

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
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Blog - Get all posts
  app.get("/api/blog", async (req: Request, res: Response) => {
    try {
      const posts = await db.query.blogPosts.findMany({
        orderBy: [desc(blogPosts.createdAt)],
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Blog - Get single post by slug
  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, slug),
      });

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Blog - Create post (protected route - requires authentication)
  app.post("/api/blog", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const data = insertBlogPostSchema.parse(req.body);
      
      // Check if slug already exists
      const existingPost = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, data.slug),
      });

      if (existingPost) {
        return res.status(400).json({ message: "A post with this slug already exists" });
      }

      const [post] = await db.insert(blogPosts).values(data).returning();
      res.status(201).json(post);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Newsletter - Subscribe
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const data = insertNewsletterSchema.parse(req.body);
      
      // Check if email already subscribed
      const existingSubscription = await db.query.newsletterSubscriptions.findFirst({
        where: eq(newsletterSubscriptions.email, data.email),
      });

      if (existingSubscription) {
        return res.status(400).json({ message: "This email is already subscribed" });
      }

      await db.insert(newsletterSubscriptions).values(data);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Ticketmatics Dashboard - Get server stats
  app.get("/api/ticketmatics/stats/:serverId", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const serverId = req.params.serverId;
      
      const tickets = await db.query.ticketmaticsTickets.findMany({
        where: eq(ticketmaticsTickets.serverId, serverId),
        orderBy: [desc(ticketmaticsTickets.createdAt)],
      });

      const totalTickets = tickets.length;
      const openTickets = tickets.filter(t => t.status === 'open').length;
      const closedTickets = tickets.filter(t => t.status === 'closed').length;
      const pendingTickets = tickets.filter(t => t.status === 'pending').length;

      res.status(200).json({
        totalTickets,
        openTickets,
        closedTickets,
        pendingTickets,
        recentTickets: tickets.slice(0, 10),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Ticketmatics Dashboard - Get all tickets for a server
  app.get("/api/ticketmatics/tickets/:serverId", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const serverId = req.params.serverId;
      const tickets = await db.query.ticketmaticsTickets.findMany({
        where: eq(ticketmaticsTickets.serverId, serverId),
        orderBy: [desc(ticketmaticsTickets.createdAt)],
      });

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Ticketmatics Dashboard - Get ticket messages
  app.get("/api/ticketmatics/messages/:ticketId", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const ticketId = req.params.ticketId;
      const messages = await db.query.ticketmaticsMessages.findMany({
        where: eq(ticketmaticsMessages.ticketId, ticketId),
        orderBy: [desc(ticketmaticsMessages.createdAt)],
      });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Visucord Dashboard - Get server stats
  app.get("/api/visucord/stats/:serverId", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const serverId = req.params.serverId;
      
      const stats = await db.query.visucordStats.findMany({
        where: eq(visucordStats.serverId, serverId),
        orderBy: [desc(visucordStats.date)],
        limit: 30, // Last 30 days
      });

      const channelStats = await db.query.visucordChannelStats.findMany({
        where: eq(visucordChannelStats.serverId, serverId),
        orderBy: [desc(visucordChannelStats.date)],
        limit: 10,
      });

      const latestStats = stats[0] || {
        memberCount: 0,
        messageCount: 0,
        voiceMinutes: 0,
        activeUsers: 0,
      };

      res.status(200).json({
        currentStats: latestStats,
        historicalStats: stats,
        topChannels: channelStats,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Visucord Dashboard - Get channel analytics
  app.get("/api/visucord/channels/:serverId", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const serverId = req.params.serverId;
      const channelStats = await db.query.visucordChannelStats.findMany({
        where: eq(visucordChannelStats.serverId, serverId),
        orderBy: [desc(visucordChannelStats.messageCount)],
        limit: 20,
      });

      res.status(200).json(channelStats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
}
