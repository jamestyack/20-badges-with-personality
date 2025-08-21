import sharp from 'sharp';
import { put } from '@vercel/blob';

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
  
  const [fullBlob, thumbBlob] = await Promise.all([
    put(`badges/${badgeSlug}/full.png`, fullImage, {
      access: 'public',
      contentType: 'image/png',
    }),
    put(`badges/${badgeSlug}/thumb.webp`, thumbnail, {
      access: 'public',
      contentType: 'image/webp',
    }),
  ]);
  
  return {
    imageUrl: fullBlob.url,
    thumbUrl: thumbBlob.url,
  };
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

export function generatePermalink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}