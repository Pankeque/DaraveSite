-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS "registrations" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "interest" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_registrations_email" ON "registrations" ("email");
