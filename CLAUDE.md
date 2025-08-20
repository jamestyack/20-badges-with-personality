# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Badges with Personality" is a Next.js 15 application that generates AI-powered achievement badges for project milestones. It uses OpenAI's DALL-E for image generation and optionally Anthropic's Claude for text generation. The app includes admin functionality for creating badges and a public interface for viewing awards.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed sample data
```

## Database Schema

The application uses Vercel Postgres with four main tables:
- `badges` - Store badge designs and metadata
- `people` - Award recipients
- `projects` - Projects being recognized
- `awards` - Links badges to people and projects with citations

Run `npm run db:migrate` to create tables. Database functions are in `lib/db.ts`.

## Architecture

### Core Structure
- **Frontend**: Next.js App Router with React 19, Tailwind CSS
- **Backend**: Next.js Route Handlers in `app/api/`
- **Database**: Vercel Postgres via `@vercel/postgres`
- **File Storage**: Vercel Blob for badge images
- **AI Integration**: OpenAI SDK, optional Anthropic SDK

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `lib/` - Core utilities (database, AI, auth, image processing)
- `scripts/` - Database migration and seeding scripts

### Authentication
Admin routes (`/admin/*` and `/api/admin/*`) are protected by middleware that checks for `ADMIN_KEY` cookie. Authentication logic is in `lib/auth.ts`.

### Badge Generation Flow
1. Admin creates badge via `/admin/create`
2. AI generates badge brief (`/api/admin/preview-prompt`)
3. DALL-E creates badge image (`/api/admin/generate-image`)
4. Badge is published as award (`/api/admin/publish-award`)

### Badge Styles
Three supported styles defined in `lib/types.ts`:
- `round-medal-minimal` - Circular medal with scalloped edges
- `shield-crest-modern` - Modern heraldic shield design  
- `ribbon-plaque` - Rectangular certificate with ribbon

## Environment Variables

Required for development:
- `ADMIN_KEY` - Admin authentication key
- `OPENAI_API_KEY` - For DALL-E image generation
- `ANTHROPIC_API_KEY` - Optional, for Claude text generation
- `NEXT_PUBLIC_BASE_URL` - Base URL for OG images and sharing

## Key Files

- `lib/types.ts` - TypeScript interfaces for all data models
- `lib/db.ts` - Database query functions
- `lib/ai.ts` - AI integration (OpenAI/Anthropic)
- `lib/image.ts` - Image processing utilities
- `middleware.ts` - Authentication middleware for admin routes