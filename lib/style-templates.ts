export interface StyleTemplate {
  id: string;
  name: string;
  description: string;
  visualStyle: string;
  colorGuidance: string;
  iconStyle: string;
  typography: string;
  layoutRules: string;
  examples?: string[];
}

export const styleTemplates: Record<string, StyleTemplate> = {
  'flat-modern': {
    id: 'flat-modern',
    name: 'Flat Modern',
    description: 'Clean, minimalist design with solid colors',
    visualStyle: 'Flat design aesthetic, no gradients or shadows, solid fill colors, geometric shapes',
    colorGuidance: 'Use maximum 3 colors, high contrast between elements, vibrant but not neon',
    iconStyle: 'Simple geometric icon, single color, centered, takes up 40% of badge area',
    typography: 'Bold sans-serif font, all caps for title, clean and readable',
    layoutRules: 'Centered composition, generous whitespace, icon above text, symmetrical',
    examples: ['Material Design badges', 'iOS app achievement badges']
  },
  'vintage-stamp': {
    id: 'vintage-stamp',
    name: 'Vintage Stamp',
    description: 'Classic postal stamp or certificate style',
    visualStyle: 'Vintage certificate aesthetic, ornamental borders, aged paper texture feel',
    colorGuidance: 'Muted colors, sepia tones or deep rich colors like burgundy and navy',
    iconStyle: 'Detailed line art or engraving style icon, classical illustration',
    typography: 'Serif or decorative font, mix of sizes, formal certificate style',
    layoutRules: 'Ornate border, central emblem, text ribbons or banners',
    examples: ['Postal stamps', 'University certificates', 'Classical medals']
  },
  'gaming-achievement': {
    id: 'gaming-achievement',
    name: 'Gaming Achievement',
    description: 'Video game style achievement badge',
    visualStyle: 'Video game UI aesthetic, crisp edges, slight metallic sheen, star or gem accents',
    colorGuidance: 'Gold, silver, bronze metallic colors with bright accent colors',
    iconStyle: 'Detailed game-style icon, can have subtle highlights, action-oriented',
    typography: 'Bold gaming font, slightly stylized, easy to read at small sizes',
    layoutRules: 'Circular or shield shape, stars or points indicators, level/tier suggestion',
    examples: ['Xbox achievements', 'PlayStation trophies', 'Steam badges']
  },
  'corporate-professional': {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Business and professional certification style',
    visualStyle: 'Professional, trustworthy, clean lines, subtle sophistication',
    colorGuidance: 'Corporate blues, grays, single accent color, conservative palette',
    iconStyle: 'Simplified professional icon, abstract or symbolic, minimal detail',
    typography: 'Professional sans-serif, clean and modern, excellent readability',
    layoutRules: 'Structured grid, clear hierarchy, plenty of negative space',
    examples: ['LinkedIn certifications', 'Professional badges', 'Corporate awards']
  },
  'playful-cartoon': {
    id: 'playful-cartoon',
    name: 'Playful Cartoon',
    description: 'Fun, animated style for casual achievements',
    visualStyle: 'Cartoon illustration style, rounded edges, friendly and approachable',
    colorGuidance: 'Bright, cheerful colors, pastels or vibrant primaries, fun combinations',
    iconStyle: 'Cute character or mascot style, expressive, slightly exaggerated',
    typography: 'Rounded, friendly font, playful but readable, can be slightly bouncy',
    layoutRules: 'Dynamic composition, can be asymmetrical, fun background elements',
    examples: ['Duolingo achievements', 'Kids app rewards', 'Social media badges']
  },
  'technical-blueprint': {
    id: 'technical-blueprint',
    name: 'Technical Blueprint',
    description: 'Engineering and technical achievement style',
    visualStyle: 'Technical drawing aesthetic, blueprint style, precise lines, grid background',
    colorGuidance: 'Monochromatic blue and white, or dark mode with neon accents',
    iconStyle: 'Technical diagram style, wireframe, schematic representation',
    typography: 'Monospace or technical font, precise, includes version numbers or codes',
    layoutRules: 'Grid-based layout, technical annotations, measurement marks',
    examples: ['GitHub badges', 'Technical certifications', 'Engineering awards']
  }
};

export function getTemplatePrompt(templateId: string): string {
  const template = styleTemplates[templateId];
  if (!template) return '';
  
  return `Visual Style: ${template.visualStyle}
Color Guidance: ${template.colorGuidance}
Icon Style: ${template.iconStyle}
Typography: ${template.typography}
Layout: ${template.layoutRules}`;
}

export function combineTemplateWithBrief(templateId: string, customDescription?: string): string {
  const template = styleTemplates[templateId];
  if (!template) return customDescription || '';
  
  let combined = getTemplatePrompt(templateId);
  
  if (customDescription) {
    combined += `\nAdditional style notes: ${customDescription}`;
  }
  
  if (template.examples && template.examples.length > 0) {
    combined += `\nReference examples: ${template.examples.join(', ')}`;
  }
  
  return combined;
}