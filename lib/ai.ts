import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { BadgeBrief, BadgeStyle } from './types';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const BadgeBriefSchema = z.object({
  short_title: z.string().max(15),
  icon_concept: z.string(),
  colors: z.object({
    primary: z.string(),
    accent: z.string(),
    bg: z.string(),
  }),
  image_prompt: z.string(),
});

function getStyleDescription(style: BadgeStyle): string {
  switch (style) {
    case 'round-medal-minimal':
      return 'circular medal with scalloped edges, minimalist design';
    case 'shield-crest-modern':
      return 'shield or crest shape, modern heraldic style';
    case 'ribbon-plaque':
      return 'rectangular plaque with ribbon banner, achievement certificate style';
    default:
      return 'clean modern badge';
  }
}

export async function generateBadgeBrief(
  name: string,
  description: string,
  style: BadgeStyle
): Promise<BadgeBrief> {
  const systemPrompt = `You are a badge art director. Produce a SINGLE, concise visual brief for an AI image model to generate a clean, app-style achievement badge.

Constraints:
- Style: ${style} (${getStyleDescription(style)})
- Text: ≤3 words (short title)
- Icon: 1 strong symbol matching the project description
- Palette: modern, high-contrast, accessible
- Layout: centered icon, clear title, whitespace

Output JSON only:
{
  "short_title": "...",
  "icon_concept": "...",
  "colors": { "primary": "...", "accent": "...", "bg": "..." },
  "image_prompt": "..."
}`;

  const userPrompt = `Create a badge brief for:
Name: ${name}
Description: ${description}`;

  let response: string;

  if (anthropic) {
    const completion = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ],
    });
    response = completion.content[0].type === 'text' ? completion.content[0].text : '';
  } else if (openai) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    });
    response = completion.choices[0].message.content || '';
  } else {
    throw new Error('No AI API key configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY');
  }

  const parsed = JSON.parse(response);
  return BadgeBriefSchema.parse(parsed);
}

export async function generateBadgeImage(brief: BadgeBrief, style: BadgeStyle): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Generate a flat, minimal ${style} achievement badge:
- Central icon: ${brief.icon_concept}
- Title: "${brief.short_title}" in bold sans-serif
- Palette: primary ${brief.colors.primary}, accent ${brief.colors.accent}, background ${brief.colors.bg}
- Aesthetic: app-badge, clean, vector-like, high contrast
- Style: ${getStyleDescription(style)}
- Avoid: photorealism, tiny text, clutter, busy backgrounds, gradients, shadows`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'natural',
  });

  if (!response.data?.[0]?.url) {
    throw new Error('Failed to generate image');
  }
  return response.data[0].url;
}