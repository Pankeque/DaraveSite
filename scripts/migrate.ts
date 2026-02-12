import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    // Migration 0000 - Initial schema
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
      
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        read_time TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Create indexes for initial tables
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts (created_at);
      CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions (email);
    `);
    console.log('0000_initial_schema completed.');

    // Migration 0001 - Dashboard tables
    console.log('Running 0001_dashboard_tables...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ticketmatics_servers (
        id SERIAL PRIMARY KEY,
        server_id TEXT NOT NULL UNIQUE,
        server_name TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS ticketmatics_tickets (
        id SERIAL PRIMARY KEY,
        server_id TEXT NOT NULL,
        ticket_id TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        assigned_to TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        closed_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS ticketmatics_messages (
        id SERIAL PRIMARY KEY,
        ticket_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS visucord_servers (
        id SERIAL PRIMARY KEY,
        server_id TEXT NOT NULL UNIQUE,
        server_name TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS visucord_stats (
        id SERIAL PRIMARY KEY,
        server_id TEXT NOT NULL,
        member_count INTEGER NOT NULL,
        message_count INTEGER NOT NULL,
        voice_minutes INTEGER NOT NULL,
        active_users INTEGER NOT NULL,
        date TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS visucord_channel_stats (
        id SERIAL PRIMARY KEY,
        server_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        channel_name TEXT NOT NULL,
        message_count INTEGER NOT NULL,
        date TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('0001_dashboard_tables completed.');

    // Migration 0002 - Blog system
    console.log('Running 0002_blog_system...');
    await db.execute(sql`
      -- Update blog_posts table with new columns
      ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES users(id);
      ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
      ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
      
      -- Create blog_comments table
      CREATE TABLE IF NOT EXISTS blog_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        guest_name TEXT,
        guest_email TEXT,
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE,
        approved BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Create blog_tags table
      CREATE TABLE IF NOT EXISTS blog_tags (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE
      );
      
      -- Create blog_post_tags junction table
      CREATE TABLE IF NOT EXISTS blog_post_tags (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
        UNIQUE(post_id, tag_id)
      );
      
      -- Create blog_images table
      CREATE TABLE IF NOT EXISTS blog_images (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE SET NULL,
        url TEXT NOT NULL,
        alt TEXT,
        caption TEXT,
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
      CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
      CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
      CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
      CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);
      CREATE INDEX IF NOT EXISTS idx_blog_images_post_id ON blog_images(post_id);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
    `);
    console.log('0002_blog_system completed.');

    // Migration 0003 - Session table for authentication
    console.log('Running 0003_session_table...');
    await db.execute(sql`
      -- Create session table for connect-pg-simple
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      
      -- Add primary key constraint if not exists
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey'
        ) THEN
          ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
        END IF;
      END $$;
      
      -- Create index for session expiration
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
    `);
    console.log('0003_session_table completed.');

    // Migration 0004 - Form submissions tables
    console.log('Running 0004_form_submissions...');
    await db.execute(sql`
      -- Create game_submissions table
      CREATE TABLE IF NOT EXISTS game_submissions (
        id SERIAL PRIMARY KEY,
        game_name TEXT NOT NULL,
        game_link TEXT NOT NULL,
        daily_active_users TEXT,
        total_visits TEXT,
        revenue TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create asset_submissions table
      CREATE TABLE IF NOT EXISTS asset_submissions (
        id SERIAL PRIMARY KEY,
        assets_count TEXT,
        asset_links TEXT,
        additional_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('0004_form_submissions completed.');

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
