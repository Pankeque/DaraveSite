import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set");
}

// Create connection pool for Neon
const pool = new Pool({ connectionString: databaseUrl });

// Export drizzle instance
export const db = drizzle(pool, { schema });

// Export pool for direct queries if needed
export { pool };
