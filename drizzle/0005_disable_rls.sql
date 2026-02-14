-- Migration 0005: Completely disable RLS for Express server
-- The Express server handles authentication via sessions, not Supabase Auth
-- RLS policies with auth.uid() and auth.jwt() don't work with direct PostgreSQL connections
-- Depends on: 0004_fix_rls_for_express

-- =====================================================
-- STEP 1: Disable RLS on all tables
-- =====================================================
-- RLS is designed for Supabase client-side auth, not Express server sessions
-- The Express server validates authentication before database operations

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE asset_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE session DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 2: Drop all existing RLS policies
-- =====================================================
-- These policies reference auth.uid() and auth.jwt() which don't exist

DROP POLICY IF EXISTS "users_all_authenticated" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_admin_select" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_admin_update" ON users;
DROP POLICY IF EXISTS "users_insert_registration" ON users;
DROP POLICY IF EXISTS "users_admin_delete" ON users;

DROP POLICY IF EXISTS "registrations_all" ON registrations;
DROP POLICY IF EXISTS "registrations_insert_public" ON registrations;
DROP POLICY IF EXISTS "registrations_select_own" ON registrations;
DROP POLICY IF EXISTS "registrations_admin_all" ON registrations;

DROP POLICY IF EXISTS "game_submissions_all" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_insert_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_select_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_admin_all" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_update_own" ON game_submissions;
DROP POLICY IF EXISTS "game_submissions_delete_own" ON game_submissions;

DROP POLICY IF EXISTS "asset_submissions_all" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_insert_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_select_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_admin_all" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_update_own" ON asset_submissions;
DROP POLICY IF EXISTS "asset_submissions_delete_own" ON asset_submissions;

DROP POLICY IF EXISTS "session_all" ON session;

-- =====================================================
-- STEP 3: Drop Supabase-specific helper functions
-- =====================================================
-- These functions reference auth.uid() which doesn't exist without Supabase Auth

DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS current_user_id();

-- =====================================================
-- STEP 4: Grant permissions to postgres user only
-- =====================================================
-- The Express server connects as postgres user

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO postgres;

-- =====================================================
-- STEP 5: Analyze tables for performance
-- =====================================================
ANALYZE users;
ANALYZE registrations;
ANALYZE game_submissions;
ANALYZE asset_submissions;
ANALYZE session;
