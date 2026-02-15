import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

console.log("[DB] Initializing database connection...");
console.log("[DB] DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("[DB] POSTGRES_URL exists:", !!process.env.POSTGRES_URL);

if (!databaseUrl) {
  console.error("[DB] ERROR: No database URL found!");
  throw new Error("DATABASE_URL or POSTGRES_URL must be set");
}

// Create Neon HTTP client for serverless
const sql = neon(databaseUrl);

// Export drizzle instance
export const db = drizzle(sql, { schema });

console.log("[DB] Database connection initialized successfully");
