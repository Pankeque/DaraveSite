-- Migration 0002: Form submissions tables
-- Contains game and asset submission forms for the platform
-- Depends on: 0000_initial_schema

-- Create game_submissions table
CREATE TABLE IF NOT EXISTS "game_submissions" (
  "id" serial PRIMARY KEY,
  "game_name" text NOT NULL,
  "game_link" text NOT NULL,
  "daily_active_users" text,
  "total_visits" text,
  "revenue" text,
  "created_at" timestamp DEFAULT now()
);

-- Create asset_submissions table
CREATE TABLE IF NOT EXISTS "asset_submissions" (
  "id" serial PRIMARY KEY,
  "assets_count" text,
  "asset_links" text,
  "additional_notes" text,
  "created_at" timestamp DEFAULT now()
);
