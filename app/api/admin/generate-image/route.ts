import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeImage } from '@/lib/ai';
import { processAndStoreBadge, generateSlug } from '@/lib/image';
import { createBadge } from '@/lib/db';
import { z } from 'zod';
import type { BadgeStyle, BadgeBrief } from '@/lib/types';

const RequestSchema = z.object({
  name: z.string().min(1).max(100),
  style: z.enum(['round-medal-minimal', 'shield-crest-modern', 'ribbon-plaque']),
  brief: z.object({
    short_title: z.string(),
    icon_concept: z.string(),
    colors: z.object({
      primary: z.string(),
      accent: z.string(),
      bg: z.string(),
    }),
    image_prompt: z.string(),
  }),
  createdBy: z.string().default('admin'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, style, brief, createdBy } = RequestSchema.parse(body);
    
    const imageUrl = await generateBadgeImage(brief as BadgeBrief, style as BadgeStyle);
    
    const slug = generateSlug(name);
    const { imageUrl: storedImageUrl, thumbUrl } = await processAndStoreBadge(imageUrl, slug);
    
    const badge = await createBadge({
      slug,
      name,
      style_key: style as BadgeStyle,
      prompt: brief.image_prompt,
      model_used: process.env.ANTHROPIC_API_KEY ? 'claude-3-5-sonnet' : 'gpt-4o-mini',
      seed: Math.floor(Math.random() * 1000000),
      image_blob_url: storedImageUrl,
      thumb_blob_url: thumbUrl,
      created_by: createdBy,
    });
    
    return NextResponse.json({
      success: true,
      badge,
    });
  } catch (error) {
    console.error('Generate image error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate and store badge' },
      { status: 500 }
    );
  }
}