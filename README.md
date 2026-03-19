# Darave Studios - Fullstack Application

A modern fullstack application for Darave Studios, built with React, Vite, and Vercel Postgres.

## Architecture

This application runs entirely on Vercel with a unified architecture:

- **Frontend**: React + Vite + TanStack Query
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres (Neon-powered)
- **Session**: iron-session (encrypted cookies)

## Key Benefits

- ✅ **No CORS issues** - Everything on the same domain
- ✅ **First-party cookies** - No browser blocking
- ✅ **No cold starts** - Vercel functions stay warm
- ✅ **Simpler architecture** - Single platform

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── auth/              # Authentication endpoints
│   │   ├── register.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   └── me.ts
│   ├── submissions/       # Form submission endpoints
│   │   ├── game.ts
│   │   └── asset.ts
│   ├── registrations/     # Registration endpoint
│   │   └── index.ts
│   └── health.ts          # Health check endpoint
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   └── pages/        # Page components
│   ├── public/
│   │   ├── sitemap.xml   # SEO sitemap
│   │   └── robots.txt    # Search engine rules
│   └── index.html
├── lib/                   # Shared server utilities
│   ├── db.ts             # Vercel Postgres connection
│   └── session.ts        # iron-session configuration
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Drizzle schema definitions
│   └── routes.ts         # API route definitions
├── drizzle/              # Database migrations
├── drizzle.config.ts     # Drizzle configuration
└── vercel.json           # Vercel deployment configuration
```

## SEO Configuration

This project includes comprehensive SEO optimization for Google Search Console and other search engines.

### Key SEO Files

| File | Purpose |
|------|---------|
| `client/public/sitemap.xml` | XML sitemap for search engines |
| `client/public/robots.txt` | Crawler directives |
| `vercel.json` | Server headers & rewrites |
| `client/index.html` | Meta tags, Open Graph, Twitter Cards |
| `client/src/components/SEO.tsx` | Dynamic SEO component |

### SEO Features Implemented

#### 1. Sitemap (`sitemap.xml`)
- Lists all public pages (home, form, privacy, terms)
- Includes image sitemaps for portfolio items
- Updated `lastmod` dates for fresh content
- Proper priority and changefreq values

#### 2. Robots.txt (`robots.txt`)
- Allows all crawlers
- Disallows `/api/` and `/auth/` paths
- Points to sitemap location

#### 3. Vercel Configuration (`vercel.json`)
- Explicit rewrites for `sitemap.xml` and `robots.txt` (not blocked by SPA catch-all)
- Proper Cache-Control headers:
  - HTML: `max-age=0, s-maxage=3600, stale-while-revalidate`
  - Static assets: `max-age=31536000, immutable`
  - Sitemap: `max-age=3600, s-maxage=86400, stale-while-revalidate`
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

#### 4. Meta Tags (`index.html`)
- **Primary Meta Tags**: title, description, author, robots
- **Canonical URL**: Prevents duplicate content issues
- **Open Graph**: Facebook/social media preview
- **Twitter Cards**: Twitter preview
- **Structured Data (JSON-LD)**:
  - Organization schema
  - Website schema

#### 5. Dynamic SEO Component (`SEO.tsx`)
- React Helmet Async for SPA routing
- Per-page meta tags
- Structured data generators:
  - Organization schema
  - WebPage schema
  - BreadcrumbList schema
- Proper handling of arrays in structured data

### Google Search Console Tips

1. **Verify ownership** at [Google Search Console](https://search.google.com/search-console)
2. **Submit sitemap**: `https://daravestudios.vercel.app/sitemap.xml`
3. **Request indexing** after major updates
4. **Check Coverage** for indexing errors

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see `.env.example`)

3. Run development server:
   ```bash
   npm run dev
   ```

### Database

Push schema changes to database:
```bash
npm run db:push
```

Generate migrations:
```bash
npm run db:generate
```

## Deployment

### Vercel Postgres Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project → Storage
3. Create a new Postgres database
4. Link it to your project
5. Environment variables are auto-injected

### Deploy

Push to your main branch and Vercel will automatically deploy.

### Environment Variables

Required environment variables (auto-set by Vercel Postgres):

| Variable | Description |
|----------|-------------|
| `POSTGRES_URL` | Vercel Postgres connection URL |
| `SESSION_SECRET` | Secret for iron-session (32+ chars) |
| `NODE_ENV` | Environment (production/development) |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions/game` | Submit game metrics |
| POST | `/api/submissions/asset` | Submit asset information |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/registrations` | Register email for interest list |
| GET | `/api/health` | Health check endpoint |

## Tech Stack

- **Frontend**: React 18, Vite, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Vercel Serverless Functions, Drizzle ORM
- **Database**: Vercel Postgres (Neon)
- **Authentication**: bcryptjs + iron-session
- **Validation**: Zod

## Migration from Render

This project was migrated from a Render-hosted Express.js backend to Vercel Serverless Functions. See [`plans/vercel-migration-plan.md`](plans/vercel-migration-plan.md) for details.

## License

MIT
