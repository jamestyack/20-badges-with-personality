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
  short_title: z.string().max(15), // Reduced to 15 for optimal text rendering
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
- Text: Maximum 15 characters for OPTIMAL rendering (1-3 words preferred)
- Icon: 1 strong, simple symbol matching the achievement
- Palette: modern, high-contrast colors for text legibility
- Layout: centered icon with clear, readable title

TEXT GUIDELINES (CRITICAL):
- Keep short_title UNDER 15 characters for best rendering
- Use simple, bold words (avoid thin letters like 'i', 'l')
- Prefer single words or common abbreviations
- ALL CAPS often renders better than mixed case
- Avoid special characters or punctuation

ICON GUIDELINES:
- Choose simple, recognizable symbols
- Avoid overly detailed concepts
- Match icon to achievement theme
- Single central icon only

IMAGE PROMPT GUIDELINES:
- Describe a simple, self-contained badge
- Focus on center icon and text only
- NO mentions of corner decorations or edge elements
- NO complex backgrounds or scenes
- Keep it minimal and clean
- Always specify "transparent or white background"

Output ONLY valid JSON with no other text, explanation, or markdown formatting:
{
  "short_title": "...",
  "icon_concept": "...",
  "colors": { "primary": "...", "accent": "...", "bg": "..." },
  "image_prompt": "Simple badge with [icon] and text on clean background"
}

IMPORTANT: Return ONLY the JSON object, nothing else.`;

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

  // Extract JSON from response (AI might include extra text)
  let parsed;
  try {
    // First try direct parsing
    parsed = JSON.parse(response);
  } catch (e) {
    // If that fails, try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.error('Failed to parse JSON from AI response:', response);
        // Provide a fallback brief
        parsed = {
          short_title: name.substring(0, 15).toUpperCase(),
          icon_concept: "star trophy",
          colors: {
            primary: "#3B82F6",
            accent: "#F59E0B", 
            bg: "#FFFFFF"
          },
          image_prompt: `Achievement badge for ${name}: ${description.substring(0, 100)}`
        };
      }
    } else {
      console.error('No JSON found in AI response:', response);
      // Provide a fallback brief
      parsed = {
        short_title: name.substring(0, 15).toUpperCase(),
        icon_concept: "star trophy",
        colors: {
          primary: "#3B82F6",
          accent: "#F59E0B",
          bg: "#FFFFFF"
        },
        image_prompt: `Achievement badge for ${name}: ${description.substring(0, 100)}`
      };
    }
  }
  
  // Trim short_title if it's too long as a fallback
  if (parsed.short_title && parsed.short_title.length > 15) {
    parsed.short_title = parsed.short_title.substring(0, 15).trim();
    // Remove incomplete words at the end
    if (parsed.short_title.endsWith(' ')) {
      parsed.short_title = parsed.short_title.trim();
    } else if (!parsed.short_title.endsWith('.') && parsed.short_title.includes(' ')) {
      const words = parsed.short_title.split(' ');
      words.pop(); // Remove the last potentially incomplete word
      parsed.short_title = words.join(' ');
    }
  }
  
  // Convert to uppercase if it's a short title for better rendering
  if (parsed.short_title && parsed.short_title.length <= 10 && !parsed.short_title.includes(' ')) {
    parsed.short_title = parsed.short_title.toUpperCase();
  }
  
  return BadgeBriefSchema.parse(parsed);
}

export async function generateBadgeImage(
  brief: BadgeBrief, 
  style: BadgeStyle,
  options?: { quality?: 'standard' | 'hd', referenceStyle?: string }
): Promise<{ imageUrl: string; actualPrompt: string }> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  // Build enhanced prompt with improved text rendering focus and negative prompts
  let prompt = `Professional high quality achievement badge illustration with transparent or clean white background.

CREATE EXACTLY ONE BADGE:
- Single ${getStyleDescription(style)} badge, perfectly centered
- Text "${brief.short_title}" clearly rendered in bold typography
- Icon: ${brief.icon_concept} as the central element
- Clean transparent or white background around badge
- Badge fills 75-85% of frame with clear margins

VISUAL SPECIFICATIONS:
- Shape: ${getStyleDescription(style)}
- Colors: Primary ${brief.colors.primary}, Accent ${brief.colors.accent}
- Text: "${brief.short_title}" in bold, readable font
- Icon: ${brief.icon_concept} prominently displayed
- Style: Flat, clean, modern digital badge
- Background: Transparent or solid white ONLY

TEXT REQUIREMENTS (CRITICAL):
- Text "${brief.short_title}" must be perfectly legible
- Bold, sans-serif font with high contrast
- Text integrated into badge design
- Professional typography standards

COMPOSITION RULES:
- ONE complete badge only
- Centered in square frame
- Simple, self-contained design
- No elements touching edges
- Clean negative space around badge

NEGATIVE PROMPT (DO NOT INCLUDE):
- No multiple badges or duplicates
- No fragmented or split designs
- No decorative elements at corners or edges
- No backgrounds with patterns or gradients
- No photo-realistic textures or materials
- No 3D effects or excessive shadows
- No artistic interpretations or abstract versions
- No collages, grids, or arrangements
- No elements bleeding off edges
- No complex backgrounds or scenes`;

  // Add reference style description if provided
  if (options?.referenceStyle) {
    prompt += `\n\nADDITIONAL STYLE GUIDANCE:\n${options.referenceStyle}`;
  }

  prompt += `\n\nFINAL EMPHASIS:
- ONE badge only with text "${brief.short_title}" clearly visible
- Simple, clean, self-contained design
- Transparent or white background ONLY
- No decorative elements at edges or corners
- Professional digital badge for app use
- Text and icon both clearly rendered
- No fragmentation, duplication, or artistic interpretations`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: options?.quality || 'standard',
    style: 'natural', // Use natural for more consistent results
  });

  if (!response.data?.[0]?.url) {
    throw new Error('Failed to generate image');
  }
  
  return {
    imageUrl: response.data[0].url,
    actualPrompt: prompt
  };
}