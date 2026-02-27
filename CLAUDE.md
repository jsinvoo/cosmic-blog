# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start Next.js dev server
npm run build         # Production build
npm run lint          # ESLint
npm run seed          # Seed database with sample content (tsx src/seed/index.ts)
npm run generate:types # Regenerate Payload TypeScript types (src/payload-types.ts)
npm run payload       # Run Payload CLI commands (cross-env NODE_OPTIONS=--no-deprecation payload)
```

Dev server defaults to port 3000. PostgreSQL must be running (see `docker-compose.yml` for local setup with postgres:16-alpine).

## Architecture

Next.js 15 App Router with Payload CMS v3.77 as the headless content backend. PostgreSQL database.

### Route Groups

- **`src/app/(frontend)/`** — Public blog pages (homepage, `/blog`, `/blog/[slug]`). Shared layout with Navbar + Footer. Uses `force-dynamic` for real-time content.
- **`src/app/(payload)/`** — Payload admin panel at `/admin` and REST API at `/api/[...slug]`. Auto-generated layout — avoid modifying except for CSS imports.

### Collections (`src/collections/`)

Five Payload collections: **Posts** (with versions/drafts, Lexical rich text content), **Categories** (with color field), **Authors** (with avatar upload), **Media** (image-only uploads with thumbnail/card/hero sizes), **Users** (auth-enabled, admin users).

### Key Files

- `src/payload.config.ts` — Payload config (collections, db adapter, admin theme). Changes require dev server restart.
- `src/payload-types.ts` — Auto-generated types. Run `npm run generate:types` after collection schema changes.
- `src/lib/payload.ts` — `getPayloadClient()` for server-side data fetching.
- `src/app/globals.css` — Tailwind v4 config + CSS custom properties for light/dark themes.
- `src/styles/admin.css` — Custom Payload admin theme (imported after `@payloadcms/next/css` in admin layout for cascade order).

### Data Fetching Pattern

Server components fetch via Payload client with `depth: 2` for relationship population:
```typescript
const payload = await getPayloadClient();
const posts = await payload.find({ collection: "posts", where: {...}, depth: 2 });
```

### Component Organization

- `src/components/blog/` — PostCard, FilterSidebar, CategoryPills, NewsletterSection
- `src/components/layout/` — Navbar, Footer
- `src/components/ui/` — Radix-based primitives (shadcn/ui pattern)

Pages are server components; interactive components use `"use client"`.

### Rich Text Rendering

Blog post pages (`src/app/(frontend)/blog/[slug]/page.tsx`) include custom `RichTextContent`/`RichTextNode` components that render Lexical format nodes (bold=1, italic=2, strikethrough=8, code=16).

## Styling

Tailwind CSS v4 with `@tailwindcss/typography`. Dark-first design:
- Background: `#1a1a1a`, card surfaces: `#2a2a2a`
- Accent: `#00e5ff` (cyan), hover: `#33ebff`
- Borders: `border-white/10` (rgba 10% white)
- Border radius: `rounded-xl` (12px) for cards, `rounded-lg` (8px) for inputs
- Font: Inter via Next.js, with `antialiased`

Path alias: `@/*` maps to `src/*`.

## Environment Variables

```
DATABASE_URI=postgresql://cosmic:curiosity_dev_2024@localhost:5432/cosmic_curiosity
PAYLOAD_SECRET=<secret>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
