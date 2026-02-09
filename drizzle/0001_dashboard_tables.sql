-- Ticketmatics Tables
CREATE TABLE IF NOT EXISTS "ticketmatics_servers" (
  "id" SERIAL PRIMARY KEY,
  "server_id" TEXT NOT NULL UNIQUE,
  "server_name" TEXT NOT NULL,
  "user_id" INTEGER REFERENCES "users"("id"),
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ticketmatics_tickets" (
  "id" SERIAL PRIMARY KEY,
  "server_id" TEXT NOT NULL,
  "ticket_id" TEXT NOT NULL UNIQUE,
  "user_id" TEXT NOT NULL,
  "user_name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "assigned_to" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "closed_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ticketmatics_messages" (
  "id" SERIAL PRIMARY KEY,
  "ticket_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "user_name" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Visucord Tables
CREATE TABLE IF NOT EXISTS "visucord_servers" (
  "id" SERIAL PRIMARY KEY,
  "server_id" TEXT NOT NULL UNIQUE,
  "server_name" TEXT NOT NULL,
  "user_id" INTEGER REFERENCES "users"("id"),
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "visucord_stats" (
  "id" SERIAL PRIMARY KEY,
  "server_id" TEXT NOT NULL,
  "member_count" INTEGER NOT NULL,
  "message_count" INTEGER NOT NULL,
  "voice_minutes" INTEGER NOT NULL,
  "active_users" INTEGER NOT NULL,
  "date" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "visucord_channel_stats" (
  "id" SERIAL PRIMARY KEY,
  "server_id" TEXT NOT NULL,
  "channel_id" TEXT NOT NULL,
  "channel_name" TEXT NOT NULL,
  "message_count" INTEGER NOT NULL,
  "date" TIMESTAMP DEFAULT NOW()
);

-- Insert sample data for Ticketmatics
INSERT INTO "ticketmatics_tickets" ("server_id", "ticket_id", "user_id", "user_name", "category", "status", "priority", "assigned_to", "created_at") VALUES
('demo-server-1', 'ticket-001', '123456789', 'User1', 'Support', 'open', 'high', 'Admin', NOW() - INTERVAL '2 hours'),
('demo-server-1', 'ticket-002', '987654321', 'User2', 'Bug Report', 'pending', 'medium', 'Moderator', NOW() - INTERVAL '5 hours'),
('demo-server-1', 'ticket-003', '456789123', 'User3', 'Feature Request', 'closed', 'low', 'Admin', NOW() - INTERVAL '1 day'),
('demo-server-1', 'ticket-004', '789123456', 'User4', 'Support', 'open', 'urgent', NULL, NOW() - INTERVAL '30 minutes');

-- Insert sample data for Visucord
INSERT INTO "visucord_stats" ("server_id", "member_count", "message_count", "voice_minutes", "active_users", "date") VALUES
('demo-server-1', 1234, 5678, 12345, 567, NOW()),
('demo-server-1', 1230, 5500, 12000, 550, NOW() - INTERVAL '1 day'),
('demo-server-1', 1225, 5400, 11800, 540, NOW() - INTERVAL '2 days'),
('demo-server-1', 1220, 5300, 11600, 530, NOW() - INTERVAL '3 days'),
('demo-server-1', 1215, 5200, 11400, 520, NOW() - INTERVAL '4 days');

INSERT INTO "visucord_channel_stats" ("server_id", "channel_id", "channel_name", "message_count", "date") VALUES
('demo-server-1', 'channel-001', 'general', 2500, NOW()),
('demo-server-1', 'channel-002', 'announcements', 1200, NOW()),
('demo-server-1', 'channel-003', 'support', 800, NOW()),
('demo-server-1', 'channel-004', 'off-topic', 600, NOW()),
('demo-server-1', 'channel-005', 'gaming', 578, NOW());
