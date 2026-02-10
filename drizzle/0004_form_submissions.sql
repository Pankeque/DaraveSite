-- Create game_submissions table
CREATE TABLE IF NOT EXISTS game_submissions (
  id SERIAL PRIMARY KEY,
  game_name TEXT NOT NULL,
  game_link TEXT NOT NULL,
  daily_active_users INTEGER,
  total_visits INTEGER,
  revenue INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create asset_submissions table
CREATE TABLE IF NOT EXISTS asset_submissions (
  id SERIAL PRIMARY KEY,
  asset_name TEXT NOT NULL,
  asset_links TEXT NOT NULL,
  asset_count INTEGER,
  asset_type TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
