import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export async function processAndStoreBadge(imageUrl: string, badgeSlug: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }
  
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  
  const fullImage = await sharp(imageBuffer)
    .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  
  const thumbnail = await sharp(imageBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .webp({ quality: 90 })
    .toBuffer();
  
  // Create directory if it doesn't exist
  const badgeDir = path.join(process.cwd(), 'public', 'badges', badgeSlug);
  await fs.mkdir(badgeDir, { recursive: true });
  
  // Save images locally
  const fullPath = path.join(badgeDir, 'full.png');
  const thumbPath = path.join(badgeDir, 'thumb.webp');
  
  await Promise.all([
    fs.writeFile(fullPath, fullImage),
    fs.writeFile(thumbPath, thumbnail),
  ]);
  
  // Return local URLs
  return {
    imageUrl: `/badges/${badgeSlug}/full.png`,
    thumbUrl: `/badges/${badgeSlug}/thumb.webp`,
  };
}

export function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40); // Leave room for timestamp suffix
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36); // Convert to base36 for shorter string
  return `${baseSlug}-${timestamp}`;
}

export function generatePermalink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}