import { NextRequest, NextResponse } from 'next/server';
import { createPerson, createProject, createAward } from '@/lib/db';
import { generatePermalink } from '@/lib/image';
import { z } from 'zod';

const RequestSchema = z.object({
  badge_id: z.string().uuid(),
  person: z.object({
    name: z.string().min(1),
    handle: z.string().optional(),
    title: z.string().optional(),
    avatar_url: z.string().url().optional(),
  }),
  project: z.object({
    name: z.string().min(1),
    short_desc: z.string().min(1),
  }),
  citation: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { badge_id, person, project, citation } = RequestSchema.parse(body);
    
    const [createdPerson, createdProject] = await Promise.all([
      createPerson({
        name: person.name,
        handle: person.handle || null,
        title: person.title || null,
        avatar_url: person.avatar_url || null,
      }),
      createProject({
        name: project.name,
        short_desc: project.short_desc,
      }),
    ]);
    
    const permalink = generatePermalink();
    
    const award = await createAward({
      badge_id,
      person_id: createdPerson.id,
      project_id: createdProject.id,
      citation,
      public_permalink: permalink,
    });
    
    return NextResponse.json({
      success: true,
      award,
      permalink,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/a/${permalink}`,
    });
  } catch (error) {
    console.error('Publish award error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to publish award' },
      { status: 500 }
    );
  }
}