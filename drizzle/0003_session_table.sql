-- Session table for connect-pg-simple (PostgreSQL session store)
-- This table is required for persistent sessions in production

-- Create session table
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

-- Add primary key constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey'
  ) THEN
    ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
  END IF;
END $$;

-- Create index for session expiration (used for cleanup)
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
