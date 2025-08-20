# Badges with Personality

AI-generated achievement badges for celebrating project milestones.

## Features

- 🎨 AI-powered badge generation using OpenAI DALL-E
- 🏆 Hall of Fame to showcase all achievements
- 🔗 Shareable achievement pages with OG images
- 🎯 Three badge styles: Round Medal, Shield Crest, Ribbon Plaque
- 🔒 Admin authentication for badge creation
- 📊 Database-driven with Postgres
- 🖼️ Local image storage for development

## Local Development

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for local Postgres)

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone [repository-url]
   cd 20-badges-with-personality
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your keys:
   ```env
   # Admin authentication
   ADMIN_KEY=your-secret-admin-key
   
   # AI Services (required)
   OPENAI_API_KEY=sk-...
   
   # AI Services (optional)
   ANTHROPIC_API_KEY=sk-ant-...
   
   # Database (local development)
   POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/badges_dev
   
   # Public URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Start local database and run migrations:**
   ```bash
   npm run db:setup
   ```
   
   This command will:
   - Start a Postgres container via Docker
   - Wait for database to be ready
   - Run database migrations

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

### Database Commands

```bash
npm run db:up          # Start Postgres container
npm run db:down        # Stop and remove container
npm run db:migrate:local # Run migrations on local DB
npm run db:seed        # Seed sample data (optional)
npm run db:setup       # Full setup (start + migrate)
```

## Deployment to Vercel

1. **Push to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework preset: Next.js

3. **Configure Storage:**
   - In Vercel Dashboard → Storage
   - Create a Postgres database
   - Create a Blob store
   - Both will auto-connect to your project

4. **Set Environment Variables:**
   In Vercel Dashboard → Settings → Environment Variables:
   - `ADMIN_KEY` - Your admin passphrase
   - `OPENAI_API_KEY` - OpenAI API key
   - `ANTHROPIC_API_KEY` - Anthropic key (optional)
   - `NEXT_PUBLIC_BASE_URL` - Your production URL (e.g., https://yourdomain.vercel.app)

5. **Run Migrations:**
   After first deploy, run migrations:
   ```bash
   vercel env pull .env.production.local
   NODE_ENV=production npm run db:migrate
   ```

## Usage

### Creating Badges (Admin)

1. Navigate to `/admin/create`
2. Enter admin key
3. Fill in badge details
4. Preview the AI-generated brief
5. Generate the badge image
6. Award to a recipient

### Viewing Awards

- **Hall of Fame:** `/hof` - Browse all awards
- **Individual Award:** `/a/[permalink]` - Share specific achievements

## Badge Styles

- **Round Medal Minimal:** Circular medal with scalloped edges
- **Shield Crest Modern:** Modern heraldic shield design
- **Ribbon Plaque:** Rectangular certificate with ribbon

## API Endpoints

- `POST /api/admin/preview-prompt` - Generate badge brief
- `POST /api/admin/generate-image` - Create badge with AI
- `POST /api/admin/publish-award` - Publish an award
- `GET /api/og?permalink=...` - Dynamic OG images

## Project Structure

```
20-badges-with-personality/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages (protected)
│   ├── api/               # API route handlers
│   ├── a/[slug]/          # Award detail pages
│   └── hof/               # Hall of Fame
├── lib/                    # Core utilities
│   ├── db.ts              # Database queries
│   ├── ai.ts              # AI integration
│   ├── auth.ts            # Authentication
│   └── image.ts           # Image processing
├── public/                 # Static assets
│   └── badges/            # Generated badge images (local)
├── scripts/                # Database scripts
└── docker-compose.yml      # Local Postgres setup
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Database:** Postgres (local Docker / Vercel Postgres)
- **File Storage:** Local filesystem (dev) / Vercel Blob (prod)
- **AI:** OpenAI (DALL-E), Anthropic Claude (optional)
- **Image Processing:** Sharp
- **Authentication:** Cookie-based admin auth

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## Security

- Environment variables for sensitive data
- Admin authentication required for badge creation
- SQL injection protection via parameterized queries
- Image processing validation
- See `.gitignore` for excluded files

## License

MIT