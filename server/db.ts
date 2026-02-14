import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse DATABASE URL and extract components
const parseDatabaseUrl = (url: string) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || "5432"),
    database: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
  };
};

// Pool configuration optimized for serverless/production
// Note: Using connection string directly with ssl option for Supabase/Neon
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // Force IPv4 to avoid ENETUNREACH errors with IPv6 on Render
  // @ts-ignore - pg types don't include 'family' but it's supported
  family: 4,
  ssl: process.env.DATABASE_URL.includes('supabase') || process.env.DATABASE_URL.includes('neon') 
    ? { rejectUnauthorized: false } 
    : false,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
});

export const db = drizzle(pool, { schema });
