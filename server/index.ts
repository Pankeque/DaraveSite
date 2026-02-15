import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
const httpServer = createServer(app);

// Run migrations before starting server
async function runMigrations() {
  console.log("[MIGRATION] Running database migrations...");
  
  try {
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        supabase_user_id TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);
    console.log("[MIGRATION] Users table ready");

    // Create registrations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        interest TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
    `);
    console.log("[MIGRATION] Registrations table ready");

    // Create session table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey'
        ) THEN
          ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
        END IF;
      END $$;
      
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
    `);
    console.log("[MIGRATION] Session table ready");

    // Create game_submissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS game_submissions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        game_name TEXT NOT NULL,
        game_link TEXT NOT NULL,
        daily_active_users TEXT,
        total_visits TEXT,
        revenue TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_game_submissions_user_id ON game_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_game_submissions_email ON game_submissions(email);
    `);
    console.log("[MIGRATION] Game submissions table ready");

    // Create asset_submissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS asset_submissions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        assets_count TEXT,
        asset_links TEXT,
        additional_notes TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_asset_submissions_user_id ON asset_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_asset_submissions_email ON asset_submissions(email);
    `);
    console.log("[MIGRATION] Asset submissions table ready");

    // Add email column to existing tables if it doesn't exist
    try {
      await db.execute(sql`
        ALTER TABLE game_submissions ADD COLUMN IF NOT EXISTS email TEXT;
      `);
      await db.execute(sql`
        ALTER TABLE asset_submissions ADD COLUMN IF NOT EXISTS email TEXT;
      `);
      console.log("[MIGRATION] Email columns added to submissions tables");
    } catch (error) {
      console.log("[MIGRATION] Email columns might already exist, continuing...");
    }

    console.log("[MIGRATION] All migrations completed successfully!");
  } catch (error) {
    console.error("[MIGRATION] Migration failed:", error);
    throw error;
  }
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run migrations before starting the server
  await runMigrations();
  
  await registerRoutes(httpServer, app);

  // Catch-all for unmatched API routes - return JSON 404 instead of HTML
  app.use("/api", (_req: Request, res: Response) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the full error for debugging (server-side only)
    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    // In production, don't expose internal error details
    const isDev = process.env.NODE_ENV !== "production";
    
    // Always return JSON for API routes
    if (_req.path.startsWith("/api")) {
      return res.status(status).json({ 
        message: status === 500 && !isDev ? "Internal Server Error" : message,
      });
    }
    
    return res.status(status).json({ 
      message: status === 500 && !isDev ? "Internal Server Error" : message,
      // Only include stack trace in development
      ...(isDev && err.stack ? { stack: err.stack } : {})
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
