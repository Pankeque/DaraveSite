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

    // Migration 0003 - Row Level Security (RLS)
    console.log('Running 0003_enable_rls...');
    await db.execute(sql`
      -- Add user_id columns to submissions tables
      ALTER TABLE game_submissions 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      
      ALTER TABLE asset_submissions 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      
      -- Add supabase_user_id to users table for Supabase Auth integration
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;
      
      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_game_submissions_user_id ON game_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_asset_submissions_user_id ON asset_submissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);
      
      -- Enable RLS on all tables
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
      ALTER TABLE game_submissions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE asset_submissions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE session ENABLE ROW LEVEL SECURITY;
      
      -- Create helper function for admin check
      CREATE OR REPLACE FUNCTION is_admin()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN COALESCE(
          auth.jwt() -> 'user_metadata' ->> 'role' = 'admin',
          false
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
      
      -- Create helper function to get current user's database id
      CREATE OR REPLACE FUNCTION current_user_id()
      RETURNS INTEGER AS $$
      BEGIN
        RETURN (
          SELECT id FROM users 
          WHERE supabase_user_id = auth.uid() 
          LIMIT 1
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
      
      -- Users policies
      DROP POLICY IF EXISTS "users_select_own" ON users;
      CREATE POLICY "users_select_own" ON users FOR SELECT USING (supabase_user_id = auth.uid());
      
      DROP POLICY IF EXISTS "users_admin_select" ON users;
      CREATE POLICY "users_admin_select" ON users FOR SELECT USING (is_admin());
      
      DROP POLICY IF EXISTS "users_update_own" ON users;
      CREATE POLICY "users_update_own" ON users FOR UPDATE USING (supabase_user_id = auth.uid()) WITH CHECK (supabase_user_id = auth.uid());
      
      DROP POLICY IF EXISTS "users_admin_update" ON users;
      CREATE POLICY "users_admin_update" ON users FOR UPDATE USING (is_admin());
      
      DROP POLICY IF EXISTS "users_insert_registration" ON users;
      CREATE POLICY "users_insert_registration" ON users FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "users_admin_delete" ON users;
      CREATE POLICY "users_admin_delete" ON users FOR DELETE USING (is_admin());
      
      -- Registrations policies
      DROP POLICY IF EXISTS "registrations_insert_public" ON registrations;
      CREATE POLICY "registrations_insert_public" ON registrations FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "registrations_select_own" ON registrations;
      CREATE POLICY "registrations_select_own" ON registrations FOR SELECT USING (email = (SELECT email FROM users WHERE supabase_user_id = auth.uid()));
      
      DROP POLICY IF EXISTS "registrations_admin_all" ON registrations;
      CREATE POLICY "registrations_admin_all" ON registrations FOR ALL USING (is_admin());
      
      -- Game submissions policies
      DROP POLICY IF EXISTS "game_submissions_insert_own" ON game_submissions;
      CREATE POLICY "game_submissions_insert_own" ON game_submissions FOR INSERT WITH CHECK (user_id = current_user_id() OR user_id IS NULL);
      
      DROP POLICY IF EXISTS "game_submissions_select_own" ON game_submissions;
      CREATE POLICY "game_submissions_select_own" ON game_submissions FOR SELECT USING (user_id = current_user_id());
      
      DROP POLICY IF EXISTS "game_submissions_admin_all" ON game_submissions;
      CREATE POLICY "game_submissions_admin_all" ON game_submissions FOR ALL USING (is_admin());
      
      DROP POLICY IF EXISTS "game_submissions_update_own" ON game_submissions;
      CREATE POLICY "game_submissions_update_own" ON game_submissions FOR UPDATE USING (user_id = current_user_id()) WITH CHECK (user_id = current_user_id());
      
      DROP POLICY IF EXISTS "game_submissions_delete_own" ON game_submissions;
      CREATE POLICY "game_submissions_delete_own" ON game_submissions FOR DELETE USING (user_id = current_user_id());
      
      -- Asset submissions policies
      DROP POLICY IF EXISTS "asset_submissions_insert_own" ON asset_submissions;
      CREATE POLICY "asset_submissions_insert_own" ON asset_submissions FOR INSERT WITH CHECK (user_id = current_user_id() OR user_id IS NULL);
      
      DROP POLICY IF EXISTS "asset_submissions_select_own" ON asset_submissions;
      CREATE POLICY "asset_submissions_select_own" ON asset_submissions FOR SELECT USING (user_id = current_user_id());
      
      DROP POLICY IF EXISTS "asset_submissions_admin_all" ON asset_submissions;
      CREATE POLICY "asset_submissions_admin_all" ON asset_submissions FOR ALL USING (is_admin());
      
      DROP POLICY IF EXISTS "asset_submissions_update_own" ON asset_submissions;
      CREATE POLICY "asset_submissions_update_own" ON asset_submissions FOR UPDATE USING (user_id = current_user_id()) WITH CHECK (user_id = current_user_id());
      
      DROP POLICY IF EXISTS "asset_submissions_delete_own" ON asset_submissions;
      CREATE POLICY "asset_submissions_delete_own" ON asset_submissions FOR DELETE USING (user_id = current_user_id());
      
      -- Session policies
      DROP POLICY IF EXISTS "session_all" ON session;
      CREATE POLICY "session_all" ON session FOR ALL USING (true);
      
      -- Analyze tables
      ANALYZE users;
      ANALYZE registrations;
      ANALYZE game_submissions;
      ANALYZE asset_submissions;
      ANALYZE session;
    `);
    console.log('0003_enable_rls completed.');

    // Migration 0004 - Fix RLS for Express session authentication
    console.log('Running 0004_fix_rls_for_express...');
    await db.execute(sql`
      -- Disable RLS on session table (required for connect-pg-simple)
      ALTER TABLE session DISABLE ROW LEVEL SECURITY;
      
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "users_select_own" ON users;
      DROP POLICY IF EXISTS "users_admin_select" ON users;
      DROP POLICY IF EXISTS "users_update_own" ON users;
      DROP POLICY IF EXISTS "users_admin_update" ON users;
      DROP POLICY IF EXISTS "users_insert_registration" ON users;
      DROP POLICY IF EXISTS "users_admin_delete" ON users;
      
      DROP POLICY IF EXISTS "registrations_insert_public" ON registrations;
      DROP POLICY IF EXISTS "registrations_select_own" ON registrations;
      DROP POLICY IF EXISTS "registrations_admin_all" ON registrations;
      
      DROP POLICY IF EXISTS "game_submissions_insert_own" ON game_submissions;
      DROP POLICY IF EXISTS "game_submissions_select_own" ON game_submissions;
      DROP POLICY IF EXISTS "game_submissions_admin_all" ON game_submissions;
      DROP POLICY IF EXISTS "game_submissions_update_own" ON game_submissions;
      DROP POLICY IF EXISTS "game_submissions_delete_own" ON game_submissions;
      
      DROP POLICY IF EXISTS "asset_submissions_insert_own" ON asset_submissions;
      DROP POLICY IF EXISTS "asset_submissions_select_own" ON asset_submissions;
      DROP POLICY IF EXISTS "asset_submissions_admin_all" ON asset_submissions;
      DROP POLICY IF EXISTS "asset_submissions_update_own" ON asset_submissions;
      DROP POLICY IF EXISTS "asset_submissions_delete_own" ON asset_submissions;
      
      -- Create permissive policies for server-side operations
      -- The Express server handles authentication via sessions
      CREATE POLICY "users_all_authenticated" ON users FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "registrations_all" ON registrations FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "game_submissions_all" ON game_submissions FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY "asset_submissions_all" ON asset_submissions FOR ALL USING (true) WITH CHECK (true);
      
      -- Grant permissions
      GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
      
      -- Analyze tables
      ANALYZE users;
      ANALYZE registrations;
      ANALYZE game_submissions;
      ANALYZE asset_submissions;
      ANALYZE session;
    `);
    console.log('0004_fix_rls_for_express completed.');

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
