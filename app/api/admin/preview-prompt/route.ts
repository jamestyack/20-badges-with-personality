import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeBrief } from '@/lib/ai';
import { combineTemplateWithBrief } from '@/lib/style-templates';
import { z } from 'zod';
import type { BadgeStyle } from '@/lib/types';

const RequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  style: z.enum(['round-medal-minimal', 'shield-crest-modern', 'ribbon-plaque']),
  styleTemplate: z.string().optional(),
  referenceStyle: z.string().optional(),
  quality: z.enum(['standard', 'hd']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, style, styleTemplate, referenceStyle, quality } = RequestSchema.parse(body);
    
    // Generate enhanced description with template if provided
    let enhancedDescription = description;
    if (styleTemplate || referenceStyle) {
      const styleGuide = combineTemplateWithBrief(styleTemplate || '', referenceStyle);
      enhancedDescription = `${description}\n\nStyle Guide: ${styleGuide}`;
    }
    
    const brief = await generateBadgeBrief(name, enhancedDescription, style as BadgeStyle);
    
    // Include metadata in response
    return NextResponse.json({
      ...brief,
      _metadata: {
        styleTemplate,
        referenceStyle,
        quality: quality || 'standard'
      }
    });
  } catch (error) {
    console.error('Preview prompt error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate badge brief' },
      { status: 500 }
    );
  }
}