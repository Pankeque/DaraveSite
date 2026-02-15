import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema.js";

// Lazy initialization of database connection
// This prevents errors during build when environment variables are not available
let _db: ReturnType<typeof drizzle> | null = null;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  console.log("[DB] Initializing database connection...");
  console.log("[DB] DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("[DB] POSTGRES_URL exists:", !!process.env.POSTGRES_URL);
  
  if (!databaseUrl) {
    console.error("[DB] ERROR: No database URL found!");
    throw new Error("DATABASE_URL or POSTGRES_URL must be set");
  }
  
  return databaseUrl;
}

// Export drizzle instance with lazy initialization
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    if (!_db) {
      const databaseUrl = getDatabaseUrl();
      const sql = neon(databaseUrl);
      _db = drizzle(sql, { schema });
      console.log("[DB] Database connection initialized successfully");
    }
    return Reflect.get(_db, prop);
  }
});
