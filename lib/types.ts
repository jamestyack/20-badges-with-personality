export interface Badge {
  id: string;
  slug: string;
  name: string;
  style_key: BadgeStyle;
  prompt: string;
  model_used: string;
  seed: number | null;
  image_blob_url: string;
  thumb_blob_url: string;
  created_by: string;
  created_at: Date;
}

export interface Person {
  id: string;
  name: string;
  handle: string | null;
  title: string | null;
  avatar_url: string | null;
  created_at: Date;
}

export interface Project {
  id: string;
  name: string;
  short_desc: string;
  created_at: Date;
}

export interface Award {
  id: string;
  badge_id: string;
  person_id: string;
  project_id: string;
  citation: string;
  public_permalink: string;
  created_at: Date;
}

export type BadgeStyle = 'round-medal-minimal' | 'shield-crest-modern' | 'ribbon-plaque';

export interface BadgeBrief {
  short_title: string;
  icon_concept: string;
  colors: {
    primary: string;
    accent: string;
    bg: string;
  };
  image_prompt: string;
}

export interface BadgeFormData {
  name: string;
  description: string;
  style: BadgeStyle;
}

export interface AwardFormData {
  badge_id: string;
  person_name: string;
  person_handle?: string;
  person_title?: string;
  person_avatar?: string;
  project_name: string;
  project_desc: string;
  citation: string;
}