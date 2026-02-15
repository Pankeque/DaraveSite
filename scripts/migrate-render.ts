import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function runMigrations() {
  console.log('Running migrations for Render PostgreSQL...');
  
  try {
    // Migration 0000 - Initial schema (users and registrations)
    console.log('Creating users table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        supabase_user_id TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);
    console.log('Users table created.');

    // Create registrations table
    console.log('Creating registrations table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        interest TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
    `);
    console.log('Registrations table created.');

    // Migration 0001 - Session table for authentication
    console.log('Creating session table...');
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
    console.log('Session table created.');

    // Migration 0002 - Form submissions tables
    console.log('Creating game_submissions table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS game_submissions (
        id SERIAL PRIMARY KEY,
        game_name TEXT NOT NULL,
        game_link TEXT NOT NULL,
        daily_active_users TEXT,
        total_visits TEXT,
        revenue TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_game_submissions_user_id ON game_submissions(user_id);
    `);
    console.log('Game submissions table created.');

    console.log('Creating asset_submissions table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS asset_submissions (
        id SERIAL PRIMARY KEY,
        assets_count TEXT,
        asset_links TEXT,
        additional_notes TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_asset_submissions_user_id ON asset_submissions(user_id);
    `);
    console.log('Asset submissions table created.');

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();