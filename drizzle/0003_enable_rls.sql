-- Migration 0003: Row Level Security (RLS) and user_id columns
-- Enables comprehensive security policies for production
-- Depends on: 0000_initial_schema, 0001_session_table, 0002_form_submissions

-- =====================================================
-- STEP 1: Add user_id columns to submissions tables
-- =====================================================

-- Add user_id to game_submissions (nullable for existing data, references users)
ALTER TABLE game_submissions 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Add user_id to asset_submissions (nullable for existing data, references users)
ALTER TABLE asset_submissions 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Add supabase_user_id to users table for Supabase Auth integration
ALTER TABLE users
ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;

-- Create indexes for performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_game_submissions_user_id ON game_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_submissions_user_id ON asset_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);

-- =====================================================
-- STEP 2: Enable Row Level Security on all tables
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: Create helper function for admin check
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role in auth metadata
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

-- =====================================================
-- STEP 4: USERS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_insert_authenticated" ON users;
DROP POLICY IF EXISTS "users_delete_service_only" ON users;
DROP POLICY IF EXISTS "users_admin_all" ON users;
DROP POLICY IF EXISTS "users_admin_select" ON users;
DROP POLICY IF EXISTS "users_admin_update" ON users;
DROP POLICY IF EXISTS "users_admin_delete" ON users;
DROP POLICY IF EXISTS "users_insert_registration" ON users;

-- Users can read their own data (via Supabase Auth UUID)
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (supabase_user_id = auth.uid());

-- Admins can read all users
CREATE POLICY "users_admin_select" ON users
  FOR SELECT
  USING (is_admin());

-- Users can update their own data
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (supabase_user_id = auth.uid())
  WITH CHECK (supabase_user_id = auth.uid());

-- Admins can update any user
CREATE POLICY "users_admin_update" ON users
  FOR UPDATE
  USING (is_admin());

-- Allow insert during registration
CREATE POLICY "users_insert_registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- Only admins can delete users
CREATE POLICY "users_admin_delete" ON users
  FOR DELETE
  USING (is_admin());

-- =====================================================
-- STEP 5: REGISTRATIONS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "registrations_insert_public" ON registrations;
DROP POLICY IF EXISTS "registrations_select_own" ON registrations;
DROP POLICY IF EXISTS "registrations_admin_all" ON registrations;

-- Anyone can insert registrations (public landing page form)
CREATE POLICY "registrations_insert_public" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own registrations (by email match)
CREATE POLICY "registrations_select_own" ON registrations
  FOR SELECT
  USING (email = (SELECT email FROM users WHERE supabase_user_id = auth.uid()));

-- Admins have full access to registrations
CREATE POLICY "registrations_admin_all" ON registrations
  FOR ALL
  USING (is_admin());

-- =====================================================
-- STEP 6: GAME_SUBMISSIONS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "game_submissions_insert_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_select_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_update_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_delete_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_admin_all" ON game_submissions;

-- Authenticated users can insert their own submissions
CREATE POLICY "game_submissions_insert_own" ON game_submissions
  FOR INSERT
  WITH CHECK (user_id = current_user_id() OR user_id IS NULL);

-- Users can view their own submissions
CREATE POLICY "game_submissions_select_own" ON game_submissions
  FOR SELECT
  USING (user_id = current_user_id());

-- Admins have full access
CREATE POLICY "game_submissions_admin_all" ON game_submissions
  FOR ALL
  USING (is_admin());

-- Users can update their own submissions
CREATE POLICY "game_submissions_update_own" ON game_submissions
  FOR UPDATE
  USING (user_id = current_user_id())
  WITH CHECK (user_id = current_user_id());

-- Users can delete their own submissions
CREATE POLICY "game_submissions_delete_own" ON game_submissions
  FOR DELETE
  USING (user_id = current_user_id());

-- =====================================================
-- STEP 7: ASSET_SUBMISSIONS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "asset_submissions_insert_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_select_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_update_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_delete_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_admin_all" ON asset_submissions;

-- Authenticated users can insert their own submissions
CREATE POLICY "asset_submissions_insert_own" ON asset_submissions
  FOR INSERT
  WITH CHECK (user_id = current_user_id() OR user_id IS NULL);

-- Users can view their own submissions
CREATE POLICY "asset_submissions_select_own" ON asset_submissions
  FOR SELECT
  USING (user_id = current_user_id());

-- Admins have full access
CREATE POLICY "asset_submissions_admin_all" ON asset_submissions
  FOR ALL
  USING (is_admin());

-- Users can update their own submissions
CREATE POLICY "asset_submissions_update_own" ON asset_submissions
  FOR UPDATE
  USING (user_id = current_user_id())
  WITH CHECK (user_id = current_user_id());

-- Users can delete their own submissions
CREATE POLICY "asset_submissions_delete_own" ON asset_submissions
  FOR DELETE
  USING (user_id = current_user_id());

-- =====================================================
-- STEP 8: SESSION TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "session_all" ON session;

-- Session table for connect-pg-simple needs permissive access
-- Security is handled by the session ID itself
CREATE POLICY "session_all" ON session
  FOR ALL
  USING (true);

-- =====================================================
-- STEP 9: Performance optimizations
-- =====================================================

-- Analyze tables for query planner optimization
ANALYZE users;
ANALYZE registrations;
ANALYZE game_submissions;
ANALYZE asset_submissions;
ANALYZE session;

-- =====================================================
-- STEP 10: Grant necessary permissions
-- =====================================================

-- Grant usage on sequences for inserts
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;
