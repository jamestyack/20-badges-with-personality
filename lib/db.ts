import pkg from 'pg';
const { Pool } = pkg;
import type { Badge, Award, Person, Project } from './types';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/badges_dev'
});

export async function getBadgeBySlug(slug: string): Promise<Badge | null> {
  const { rows } = await pool.query(
    'SELECT * FROM badges WHERE slug = $1 LIMIT 1',
    [slug]
  );
  return rows[0] || null;
}

export async function getAwardByPermalink(permalink: string): Promise<Award | null> {
  const { rows } = await pool.query(
    'SELECT * FROM awards WHERE public_permalink = $1 LIMIT 1',
    [permalink]
  );
  return rows[0] || null;
}

export async function getAwardWithDetails(permalink: string) {
  const { rows } = await pool.query(`
    SELECT 
      a.*,
      b.name as badge_name,
      b.image_blob_url,
      b.thumb_blob_url,
      b.style_key,
      p.name as person_name,
      p.handle as person_handle,
      p.title as person_title,
      p.avatar_url as person_avatar,
      pr.name as project_name,
      pr.short_desc as project_desc
    FROM awards a
    JOIN badges b ON a.badge_id = b.id
    JOIN people p ON a.person_id = p.id
    JOIN projects pr ON a.project_id = pr.id
    WHERE a.public_permalink = $1
    LIMIT 1
  `, [permalink]);
  return rows[0] || null;
}

export async function getAllAwards() {
  const { rows } = await pool.query(`
    SELECT 
      a.*,
      b.name as badge_name,
      b.thumb_blob_url,
      b.style_key,
      p.name as person_name,
      p.handle as person_handle,
      pr.name as project_name
    FROM awards a
    JOIN badges b ON a.badge_id = b.id
    JOIN people p ON a.person_id = p.id
    JOIN projects pr ON a.project_id = pr.id
    ORDER BY a.created_at DESC
  `);
  return rows;
}

export async function createBadge(badge: Omit<Badge, 'id' | 'created_at'>): Promise<Badge> {
  const { rows } = await pool.query(`
    INSERT INTO badges (
      slug, name, style_key, prompt, actual_prompt, style_template,
      reference_style, quality_setting, model_used, seed, 
      image_blob_url, thumb_blob_url, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )
    RETURNING *
  `, [
    badge.slug, badge.name, badge.style_key, 
    badge.prompt, badge.actual_prompt, badge.style_template,
    badge.reference_style, badge.quality_setting, badge.model_used, badge.seed, 
    badge.image_blob_url, badge.thumb_blob_url, badge.created_by
  ]);
  return rows[0];
}

export async function createPerson(person: Omit<Person, 'id' | 'created_at'>): Promise<Person> {
  const { rows } = await pool.query(`
    INSERT INTO people (name, handle, title, avatar_url) 
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [person.name, person.handle, person.title, person.avatar_url]);
  return rows[0];
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  const { rows } = await pool.query(`
    INSERT INTO projects (name, short_desc) 
    VALUES ($1, $2)
    RETURNING *
  `, [project.name, project.short_desc]);
  return rows[0];
}

export async function createAward(award: Omit<Award, 'id' | 'created_at'>): Promise<Award> {
  const { rows } = await pool.query(`
    INSERT INTO awards (badge_id, person_id, project_id, citation, public_permalink)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [award.badge_id, award.person_id, award.project_id, award.citation, award.public_permalink]);
  return rows[0];
}

export async function getAllBadges(): Promise<Badge[]> {
  const { rows } = await pool.query('SELECT * FROM badges ORDER BY created_at DESC');
  return rows;
}

export async function getAllPeople(): Promise<Person[]> {
  const { rows } = await pool.query('SELECT * FROM people ORDER BY name');
  return rows;
}

export async function getAllProjects(): Promise<Project[]> {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY name');
  return rows;
}

export async function deleteAward(awardId: string): Promise<boolean> {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM awards WHERE id = $1',
      [awardId]
    );
    return rowCount ? rowCount > 0 : false;
  } catch (error) {
    console.error('Error deleting award:', error);
    return false;
  }
}