export interface BadgeSuggestion {
  name: string;
  description: string;
  category: string;
  suggestedStyle: 'round-medal-minimal' | 'shield-crest-modern' | 'ribbon-plaque';
  suggestedTemplate?: string;
}

export const hackathonBadgeSuggestions: BadgeSuggestion[] = [
  // Gamification Achievements
  {
    name: "Level Up Legend",
    description: "Created an innovative gamification system that transforms user engagement through points, levels, and progression mechanics",
    category: "Gamification",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "gaming-achievement"
  },
  {
    name: "Quest Master",
    description: "Designed and implemented a compelling quest-based user journey with meaningful rewards and challenges",
    category: "Gamification",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "gaming-achievement"
  },
  {
    name: "Leaderboard Luminary",
    description: "Built dynamic competitive features that drive healthy competition and community engagement",
    category: "Gamification",
    suggestedStyle: "ribbon-plaque",
    suggestedTemplate: "gaming-achievement"
  },
  {
    name: "Achievement Architect",
    description: "Crafted a sophisticated achievement system that motivates users through meaningful milestones and badges",
    category: "Gamification",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "gaming-achievement"
  },

  // Personalization Achievements
  {
    name: "Personalization Pioneer",
    description: "Developed intelligent personalization that adapts user experience based on behavior and preferences",
    category: "Personalization",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "corporate-professional"
  },
  {
    name: "Recommendation Wizard",
    description: "Created smart recommendation engines that deliver perfectly tailored content and suggestions",
    category: "Personalization",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "flat-modern"
  },
  {
    name: "Adaptive Interface Innovator",
    description: "Built dynamic UI that morphs and customizes itself to individual user patterns and needs",
    category: "Personalization",
    suggestedStyle: "ribbon-plaque",
    suggestedTemplate: "flat-modern"
  },
  {
    name: "User Journey Craftsperson",
    description: "Designed personalized user flows that create unique experiences for each individual",
    category: "Personalization",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "corporate-professional"
  },

  // Data Visualization Achievements
  {
    name: "Data Storyteller Supreme",
    description: "Transformed complex datasets into compelling visual narratives that reveal hidden insights",
    category: "Data Visualization",
    suggestedStyle: "ribbon-plaque",
    suggestedTemplate: "corporate-professional"
  },
  {
    name: "Chart Champion",
    description: "Created stunning interactive visualizations that make data accessible and engaging",
    category: "Data Visualization",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "flat-modern"
  },
  {
    name: "Dashboard Dynamo",
    description: "Built comprehensive dashboards that turn raw data into actionable business intelligence",
    category: "Data Visualization",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "corporate-professional"
  },
  {
    name: "Insight Illuminator",
    description: "Uncovered breakthrough insights through innovative data visualization and analysis techniques",
    category: "Data Visualization",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "technical-blueprint"
  },

  // AI Integration Achievements
  {
    name: "AI Whisperer",
    description: "Seamlessly integrated AI models into applications with exceptional user experience and performance",
    category: "AI Integration",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "technical-blueprint"
  },
  {
    name: "Prompt Engineering Pro",
    description: "Mastered the art of AI prompt design to create sophisticated and reliable AI-powered features",
    category: "AI Integration",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "technical-blueprint"
  },
  {
    name: "Code Collaboration Catalyst",
    description: "Used AI tools to accelerate development and enhance code quality through intelligent automation",
    category: "AI Integration",
    suggestedStyle: "ribbon-plaque",
    suggestedTemplate: "corporate-professional"
  },
  {
    name: "ML Model Maestro",
    description: "Successfully trained, deployed, and integrated custom machine learning models into production apps",
    category: "AI Integration",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "technical-blueprint"
  },

  // Technical Excellence Achievements
  {
    name: "Full-Stack Fusion",
    description: "Delivered end-to-end solutions combining frontend, backend, and AI components flawlessly",
    category: "Technical Excellence",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "corporate-professional"
  },
  {
    name: "API Artisan",
    description: "Created elegant and efficient APIs that seamlessly connect AI services with user applications",
    category: "Technical Excellence",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "technical-blueprint"
  },
  {
    name: "Performance Optimizer",
    description: "Achieved exceptional app performance while integrating complex AI and data processing features",
    category: "Technical Excellence",
    suggestedStyle: "ribbon-plaque",
    suggestedTemplate: "technical-blueprint"
  },
  {
    name: "Innovation Integrator",
    description: "Combined multiple cutting-edge technologies to create something truly unique and impactful",
    category: "Technical Excellence",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "flat-modern"
  },

  // Hackathon Special Achievements
  {
    name: "48-Hour Hero",
    description: "Delivered a fully functional, polished application within the hackathon timeframe",
    category: "Hackathon Special",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "gaming-achievement"
  },
  {
    name: "Demo Day Dazzler",
    description: "Presented a compelling demonstration that captivated judges and audience with clear impact",
    category: "Hackathon Special",
    suggestedStyle: "ribbon-plaque",
    suggestedTemplate: "vintage-stamp"
  },
  {
    name: "Team Synergy Star",
    description: "Facilitated exceptional collaboration and coordination within a diverse hackathon team",
    category: "Hackathon Special",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "corporate-professional"
  },
  {
    name: "Problem Solver Extraordinaire",
    description: "Tackled real-world challenges with creative technology solutions that address genuine user needs",
    category: "Hackathon Special",
    suggestedStyle: "round-medal-minimal",
    suggestedTemplate: "flat-modern"
  },
  {
    name: "Best Failure",
    description: "Most fearless attempt that didn't work - celebrated for taking bold risks, learning from failure, and pushing boundaries",
    category: "Hackathon Special",
    suggestedStyle: "shield-crest-modern",
    suggestedTemplate: "vintage-stamp"
  }
];

export function getBadgesByCategory(category?: string): BadgeSuggestion[] {
  if (!category) return hackathonBadgeSuggestions;
  return hackathonBadgeSuggestions.filter(badge => badge.category === category);
}

export const badgeCategories = [
  "Gamification",
  "Personalization", 
  "Data Visualization",
  "AI Integration",
  "Technical Excellence",
  "Hackathon Special"
];