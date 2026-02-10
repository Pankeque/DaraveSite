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

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "content" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "read_time" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS "newsletter_subscriptions" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_registrations_email" ON "registrations" ("email");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_slug" ON "blog_posts" ("slug");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_created_at" ON "blog_posts" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_category" ON "blog_posts" ("category");
CREATE INDEX IF NOT EXISTS "idx_newsletter_email" ON "newsletter_subscriptions" ("email");
