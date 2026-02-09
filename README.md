# Darave Studios Landing Page

## Overview

This is a landing page and registration system for **Darave Studios**, a creative studio focused on game development, asset purchasing, and portfolio applications. The app features a visually rich, dark-themed single-page marketing site with animated elements (ripple backgrounds, marquee text, scroll-based transforms) and a registration modal that collects user emails and interest areas, storing them in a PostgreSQL database.

The project follows a monorepo structure with three main directories: `client/` (React frontend), `server/` (Express backend), and `shared/` (shared schemas and route definitions).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Directory Structure
- **`client/`** — React SPA (Single Page Application) with Vite
- **`server/`** — Express API server
- **`shared/`** — Shared TypeScript types, Zod schemas, and route definitions used by both client and server

### Frontend (`client/src/`)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data fetching**: `@tanstack/react-query` for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Animations**: `framer-motion` for ripple effects, scroll reveals, marquee, and transitions
- **Forms**: `react-hook-form` with `@hookform/resolvers` and Zod validation
- **Icons**: `lucide-react`
- **Design Theme**: Dark theme with deep black (#0a0a0a) background and lime green (#a3ff00) accent. Uses Inter and Manrope fonts from Google Fonts. CSS variables defined in `client/src/index.css`.
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (`server/`)
- **Framework**: Express 5 running on Node.js with TypeScript (executed via `tsx`)
- **API Pattern**: REST endpoints defined in `server/routes.ts`, with route contracts (path, method, input/output schemas) defined in `shared/routes.ts`
- **Validation**: Zod schemas shared between client and server for input validation
- **Storage Layer**: `server/storage.ts` defines a `DatabaseStorage` class implementing `IStorage` interface, providing an abstraction over the database
- **Dev Server**: Vite dev server is integrated as middleware in development mode (`server/vite.ts`), with HMR support
- **Production**: Static files served from `dist/public` via Express

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for automatic Zod schema generation from table definitions
- **Schema Location**: `shared/schema.ts`
- **Current Tables**:
  - `registrations` — stores email signups with fields: `id` (serial PK), `email` (text, required), `interest` (text, optional), `createdAt` (timestamp, auto-set)
- **Migrations**: Managed via `drizzle-kit push` (`npm run db:push`), config in `drizzle.config.ts`, migrations output to `./migrations/`

### Shared Contract Pattern
The `shared/routes.ts` file defines API contracts that both client and server consume. Each route specifies its HTTP method, path, input Zod schema, and response schemas by status code. This ensures type safety across the full stack without code generation.

### Build System
- **Development**: `npm run dev` runs `tsx server/index.ts` which starts Express with Vite middleware for HMR
- **Production Build**: `npm run build` runs a custom build script (`script/build.ts`) that:
  1. Builds the React client with Vite (output to `dist/public`)
  2. Bundles the server with esbuild (output to `dist/index.cjs`), externalizing most deps but bundling common ones for faster cold starts
- **Production Start**: `npm start` runs `node dist/index.cjs`

## External Dependencies

### Required Services
- **PostgreSQL Database**: Must be provisioned and accessible via `DATABASE_URL` environment variable. Used for all data persistence.

### Key NPM Packages
- **Drizzle ORM + drizzle-zod**: Database ORM and schema-to-Zod generation
- **Express 5**: HTTP server framework
- **Vite + @vitejs/plugin-react**: Frontend build tool and dev server
- **@tanstack/react-query**: Async state management for API calls
- **framer-motion**: Animation library for UI effects
- **shadcn/ui + Radix UI**: Component library ecosystem
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Runtime schema validation (shared between client/server)
- **wouter**: Lightweight React router
- **connect-pg-simple**: PostgreSQL session store (available but not currently active in routes)