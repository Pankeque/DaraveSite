import { defineConfig } from "drizzle-kit";

// Vercel Postgres uses POSTGRES_URL environment variable
// Fallback to DATABASE_URL for local development
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("POSTGRES_URL or DATABASE_URL must be set. Did you forget to provision a database?");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
