import { db } from '../server/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    // Migration 0000 - Initial schema (users and registrations)
    console.log('Running 0000_initial_schema...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        interest TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
      CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
    `);
    console.log('0000_initial_schema completed.');

    // Migration 0001 - Session table for authentication
    console.log('Running 0001_session_table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey'
        ) THEN
          ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
        END IF;
      END $$;
      
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
    `);
    console.log('0001_session_table completed.');

    // Migration 0002 - Form submissions tables
    console.log('Running 0002_form_submissions...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS game_submissions (
        id SERIAL PRIMARY KEY,
        game_name TEXT NOT NULL,
        game_link TEXT NOT NULL,
        daily_active_users TEXT,
        total_visits TEXT,
        revenue TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS asset_submissions (
        id SERIAL PRIMARY KEY,
        assets_count TEXT,
        asset_links TEXT,
        additional_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('0002_form_submissions completed.');

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
