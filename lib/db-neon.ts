import { neon } from '@neondatabase/serverless';
import type { Badge, Award, Person, Project } from './types';

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL!);

export async function getBadgeBySlug(slug: string): Promise<Badge | null> {
  const rows = await sql`
    SELECT * FROM badges WHERE slug = ${slug} LIMIT 1
  `;
  return (rows[0] as Badge) || null;
}

export async function getAwardByPermalink(permalink: string): Promise<Award | null> {
  const rows = await sql`
    SELECT * FROM awards WHERE public_permalink = ${permalink} LIMIT 1
  `;
  return (rows[0] as Award) || null;
}

export async function getAwardWithDetails(permalink: string) {
  const rows = await sql`
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
    WHERE a.public_permalink = ${permalink}
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function getAllAwards() {
  const rows = await sql`
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
  `;
  return rows;
}

export async function createBadge(badge: Omit<Badge, 'id' | 'created_at'>): Promise<Badge> {
  const rows = await sql`
    INSERT INTO badges (
      slug, name, style_key, prompt, actual_prompt, style_template,
      reference_style, quality_setting, model_used, seed, 
      image_blob_url, thumb_blob_url, created_by
    ) VALUES (
      ${badge.slug}, ${badge.name}, ${badge.style_key}, 
      ${badge.prompt}, ${badge.actual_prompt}, ${badge.style_template},
      ${badge.reference_style}, ${badge.quality_setting}, ${badge.model_used}, ${badge.seed}, 
      ${badge.image_blob_url}, ${badge.thumb_blob_url}, ${badge.created_by}
    )
    RETURNING *
  `;
  return rows[0] as Badge;
}

export async function createPerson(person: Omit<Person, 'id' | 'created_at'>): Promise<Person> {
  const rows = await sql`
    INSERT INTO people (name, handle, title, avatar_url) 
    VALUES (${person.name}, ${person.handle}, ${person.title}, ${person.avatar_url})
    RETURNING *
  `;
  return rows[0] as Person;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  const rows = await sql`
    INSERT INTO projects (name, short_desc) 
    VALUES (${project.name}, ${project.short_desc})
    RETURNING *
  `;
  return rows[0] as Project;
}

export async function createAward(award: Omit<Award, 'id' | 'created_at'>): Promise<Award> {
  const rows = await sql`
    INSERT INTO awards (badge_id, person_id, project_id, citation, public_permalink)
    VALUES (${award.badge_id}, ${award.person_id}, ${award.project_id}, ${award.citation}, ${award.public_permalink})
    RETURNING *
  `;
  return rows[0] as Award;
}

export async function getAllBadges(): Promise<Badge[]> {
  const rows = await sql`SELECT * FROM badges ORDER BY created_at DESC`;
  return rows as Badge[];
}

export async function getAllPeople(): Promise<Person[]> {
  const rows = await sql`SELECT * FROM people ORDER BY name`;
  return rows as Person[];
}

export async function getAllProjects(): Promise<Project[]> {
  const rows = await sql`SELECT * FROM projects ORDER BY name`;
  return rows as Project[];
}

export async function deleteAward(awardId: string): Promise<boolean> {
  try {
    const rows = await sql`DELETE FROM awards WHERE id = ${awardId}`;
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting award:', error);
    return false;
  }
}