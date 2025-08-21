import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function addColumns() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/badges_dev'
  });

  try {
    console.log('Adding new columns to badges table...');
    await client.connect();

    // Add the missing columns
    await client.query(`
      ALTER TABLE badges 
      ADD COLUMN IF NOT EXISTS actual_prompt TEXT,
      ADD COLUMN IF NOT EXISTS style_template TEXT,
      ADD COLUMN IF NOT EXISTS reference_style TEXT,
      ADD COLUMN IF NOT EXISTS quality_setting TEXT DEFAULT 'standard';
    `);
    
    console.log('✅ Added new columns to badges table');

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

addColumns();