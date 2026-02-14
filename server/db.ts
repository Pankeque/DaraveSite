import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import dns from "dns";
import { promisify } from "util";

const { Pool } = pg;
const lookupAsync = promisify(dns.lookup);

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

// Determine if SSL is needed
const needsSsl = process.env.DATABASE_URL.includes('supabase') || 
                  process.env.DATABASE_URL.includes('neon') ||
                  process.env.DATABASE_URL.includes('render.com');

// Synchronously resolve hostname to IPv4 at startup
let resolvedHost: string;
try {
  console.log(`[DB] Resolving ${dbConfig.host} to IPv4...`);
  const result = dns.lookupSync(dbConfig.host, { family: 4 });
  resolvedHost = result.address;
  console.log(`[DB] Resolved ${dbConfig.host} -> ${resolvedHost}`);
} catch (err) {
  console.error(`[DB] Failed to resolve ${dbConfig.host}:`, err);
  // Fall back to original hostname
  resolvedHost = dbConfig.host;
}

// Pool configuration optimized for serverless/production
export const pool = new pg.Pool({
  host: resolvedHost, // Use resolved IPv4 address
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
