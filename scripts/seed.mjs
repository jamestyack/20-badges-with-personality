import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    const { rows: existingBadges } = await sql`SELECT COUNT(*) FROM badges`;
    if (existingBadges[0].count > 0) {
      console.log('Database already has data. Skipping seed.');
      process.exit(0);
    }
    
    const { rows: [badge] } = await sql`
      INSERT INTO badges (
        slug, name, style_key, prompt, model_used, seed, 
        image_blob_url, thumb_blob_url, created_by
      ) VALUES (
        'code-champion',
        'Code Champion',
        'round-medal-minimal',
        'A flat, minimal round medal badge with code symbols',
        'seed-data',
        12345,
        'https://placehold.co/1024x1024/1E3A8A/F59E0B.png?text=Code+Champion',
        'https://placehold.co/512x512/1E3A8A/F59E0B.png?text=Code+Champion',
        'system'
      )
      RETURNING *
    `;
    console.log('✅ Created sample badge');
    
    const { rows: [person] } = await sql`
      INSERT INTO people (name, handle, title, avatar_url)
      VALUES (
        'Alex Developer',
        'alexdev',
        'Senior Engineer',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
      )
      RETURNING *
    `;
    console.log('✅ Created sample person');
    
    const { rows: [project] } = await sql`
      INSERT INTO projects (name, short_desc)
      VALUES (
        'Badge System',
        'AI-powered achievement badge generation platform'
      )
      RETURNING *
    `;
    console.log('✅ Created sample project');
    
    await sql`
      INSERT INTO awards (
        badge_id, person_id, project_id, citation, public_permalink
      ) VALUES (
        ${badge.id},
        ${person.id},
        ${project.id},
        'For exceptional contribution to building the badge generation system',
        'demo12345'
      )
    `;
    console.log('✅ Created sample award');
    
    console.log('✨ Seeding completed successfully!');
    console.log('');
    console.log('Sample award URL: /a/demo12345');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();