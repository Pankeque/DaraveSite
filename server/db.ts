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

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

// Determine if SSL is needed (Render requires SSL)
const needsSsl = process.env.DATABASE_URL.includes('render.com') ||
                  process.env.DATABASE_URL.includes('neon') ||
                  process.env.DATABASE_URL.includes('supabase');

// Log database connection info
console.log(`[DB] Connecting to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
console.log(`[DB] SSL enabled: ${needsSsl}`);

// Pool configuration optimized for Render database with IPv4 support
export const pool = new pg.Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
});

export const db = drizzle(pool, { schema });
