# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 marketing website for Siinc - a backup and data protection service for Autodesk Construction Cloud. Built with the Streamline template using shadcn/ui components and Tailwind CSS v4.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production (static export)
pnpm build

# Run production server
pnpm start

# Run linting with auto-fix
pnpm lint
```

## Architecture

### Tech Stack
- **Next.js 15** with App Router and static export (`output: 'export'`)
- **Tailwind CSS v4** with PostCSS
- **shadcn/ui** components (New York style)
- **TypeScript** with strict mode
- **MDX** for content pages (privacy, terms)

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/ui/` - shadcn/ui components
- `/src/components/sections/` - Page section components (hero, features, pricing, etc.)
- `/src/components/layout/` - Layout components (navbar, footer)
- `/src/lib/` - Utility functions and helpers
- `/public/images/` - Static images organized by page/section

### Key Configuration
- **Path alias**: `@/` maps to `./src/`
- **Static Export**: Site builds as static HTML (no server-side rendering)
- **Images**: Unoptimized for static export compatibility
- **MDX**: Enabled for .mdx files in page extensions

### Component Patterns
- Components use `'use client'` directive when needed for interactivity
- UI components from shadcn/ui follow consistent patterns
- Icons use lucide-react library
- Forms use react-hook-form with zod validation
- Styling uses Tailwind utility classes with cn() helper for conditional classes

### Important Files
- `SIINC.md` - Product information and company details for Siinc
- `components.json` - shadcn/ui configuration
- Theme system with light/dark mode support via next-themes