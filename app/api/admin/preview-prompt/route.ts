import { NextRequest, NextResponse } from 'next/server';
import { generateBadgeBrief } from '@/lib/ai';
import { z } from 'zod';
import type { BadgeStyle } from '@/lib/types';

const RequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  style: z.enum(['round-medal-minimal', 'shield-crest-modern', 'ribbon-plaque']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, style } = RequestSchema.parse(body);
    
    const brief = await generateBadgeBrief(name, description, style as BadgeStyle);
    
    return NextResponse.json(brief);
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