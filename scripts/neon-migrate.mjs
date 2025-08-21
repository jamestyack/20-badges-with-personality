#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('🗄️ Creating database schema on Neon...');

    // Create badges table
    await sql`
      CREATE TABLE IF NOT EXISTS badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        style_key VARCHAR(50) NOT NULL,
        prompt TEXT NOT NULL,
        actual_prompt TEXT,
        style_template VARCHAR(100),
        reference_style TEXT,
        quality_setting VARCHAR(20) DEFAULT 'standard',
        model_used VARCHAR(50) NOT NULL,
        seed INTEGER,
        image_blob_url TEXT NOT NULL,
        thumb_blob_url TEXT NOT NULL,
        created_by VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create people table
    await sql`
      CREATE TABLE IF NOT EXISTS people (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        handle VARCHAR(100),
        title VARCHAR(200),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        short_desc TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create awards table
    await sql`
      CREATE TABLE IF NOT EXISTS awards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
        person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        citation TEXT NOT NULL,
        public_permalink VARCHAR(20) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_badges_slug ON badges(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_awards_permalink ON awards(public_permalink);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_awards_created_at ON awards(created_at DESC);`;

    console.log('✅ Database schema created successfully on Neon!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();