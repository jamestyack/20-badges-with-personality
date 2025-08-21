import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeImage } from '@/lib/ai';
import { processAndStoreBadge, generateSlug } from '@/lib/image-vercel';
import { createBadge } from '@/lib/db';
import { combineTemplateWithBrief } from '@/lib/style-templates';
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
    _metadata: z.object({
      styleTemplate: z.string().optional(),
      referenceStyle: z.string().optional(),
      quality: z.enum(['standard', 'hd']).optional(),
    }).optional(),
  }),
  createdBy: z.string().default('admin'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, style, brief, createdBy } = RequestSchema.parse(body);
    
    // Extract metadata if present
    const metadata = brief._metadata || {};
    const quality = metadata.quality || 'standard';
    
    // Generate reference style string if template or custom style provided
    let referenceStyle: string | undefined;
    if (metadata.styleTemplate || metadata.referenceStyle) {
      referenceStyle = combineTemplateWithBrief(
        metadata.styleTemplate || '',
        metadata.referenceStyle
      );
    }
    
    // Generate image with enhanced options
    const { imageUrl, actualPrompt } = await generateBadgeImage(
      brief as BadgeBrief, 
      style as BadgeStyle,
      { quality, referenceStyle }
    );
    
    const slug = generateSlug(name);
    const { imageUrl: storedImageUrl, thumbUrl } = await processAndStoreBadge(imageUrl, slug);
    
    const badge = await createBadge({
      slug,
      name,
      style_key: style as BadgeStyle,
      prompt: brief.image_prompt,
      actual_prompt: actualPrompt,
      style_template: metadata.styleTemplate,
      reference_style: metadata.referenceStyle,
      quality_setting: quality,
      model_used: process.env.ANTHROPIC_API_KEY ? 'claude-3-5-sonnet' : 'gpt-4o-mini',
      seed: Math.floor(Math.random() * 1000000),
      image_blob_url: storedImageUrl,
      thumb_blob_url: thumbUrl,
      created_by: createdBy,
    });
    
    return NextResponse.json({
      success: true,
      badge,
      actualPrompt, // Return the actual prompt for display
    });
  } catch (error) {
    console.error('Generate image error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    // More detailed error response for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate and store badge',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}