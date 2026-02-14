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

// Custom DNS lookup that forces IPv4
const ipv4Lookup = async (hostname: string, _options: any, callback: (err: Error | null, address: string, family: number) => void) => {
  try {
    // Force IPv4 resolution
    const result = await lookupAsync(hostname, { family: 4 });
    callback(null, result.address, 4);
  } catch (err: any) {
    callback(err, '', 4);
  }
};

// Pool configuration optimized for serverless/production
export const pool = new pg.Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
  // @ts-ignore - pg types don't include 'lookup' but it's supported
  lookup: ipv4Lookup,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
});

export const db = drizzle(pool, { schema });
