import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function migrate() {
  try {
    console.log('Starting database migration...');

    await sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS people (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        handle TEXT,
        title TEXT,
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ Created people table');

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        short_desc TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ Created projects table');

    await sql`
      CREATE TABLE IF NOT EXISTS badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        style_key TEXT NOT NULL,
        prompt TEXT NOT NULL,
        model_used TEXT NOT NULL,
        seed INT,
        image_blob_url TEXT NOT NULL,
        thumb_blob_url TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ Created badges table');

    await sql`
      CREATE TABLE IF NOT EXISTS awards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        badge_id UUID REFERENCES badges(id),
        person_id UUID REFERENCES people(id),
        project_id UUID REFERENCES projects(id),
        citation TEXT NOT NULL,
        public_permalink TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ Created awards table');

    await sql`CREATE INDEX IF NOT EXISTS idx_badges_slug ON badges(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_awards_permalink ON awards(public_permalink);`;
    console.log('✅ Created indexes');

    console.log('✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();