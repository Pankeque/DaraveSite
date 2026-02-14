import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse DATABASE_URL and force IPv4 to avoid IPv6 connectivity issues on Render
const parseDatabaseUrl = (url: string) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || "5432"),
    database: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
    // Force IPv4 to avoid ENETUNREACH errors with IPv6 on Render
    family: 4 as const,
  };
};

// Pool configuration optimized for serverless/production
export const pool = new pg.Pool({
  ...parseDatabaseUrl(process.env.DATABASE_URL),
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
});

export const db = drizzle(pool, { schema });
