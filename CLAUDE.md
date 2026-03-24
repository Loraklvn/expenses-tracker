# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

No test framework is configured.

## Environment Variables

Requires a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Supabase (PostgreSQL + Auth), TanStack Query, shadcn/ui, Tailwind CSS, next-intl, Serwist (PWA).

### Route Groups

- `(landing)/` — Public landing/home page
- `(private)/` — Auth-protected routes (dashboard, budget, expenses, income, analytics, etc.)
- `auth/` — Authentication pages (login, sign-up, password reset)

Middleware in `src/proxy.ts` → `src/lib/supabase/middleware.ts` enforces authentication on all routes except `/`, `/auth/*`, `/privacy`, `/terms`.

### Data Layer

All database access goes through Supabase client wrappers — no ORM.

- `src/lib/supabase/client.ts` — Browser singleton client
- `src/lib/supabase/server.ts` — Server client (reads cookies for session)
- `src/lib/supabase/request/server/` — Server-side query functions per resource (budgets, expenses, transactions, categories, income-sources, etc.)
- `src/lib/supabase/request/client/` — Client-side query functions (analytics + same resources)

Row-Level Security is enabled on all tables; queries are automatically scoped to `auth.uid()`.

### State Management

TanStack Query handles all server state. Custom hooks in `src/hooks/` (e.g., `useManageBudgets`, `useManageTransactions`) encapsulate query + mutation logic for each resource and are consumed by feature components.

### Component Organization

`src/components/` mirrors the route structure — each feature has its own subdirectory. `src/components/ui/` contains shadcn/ui primitives.

### Internationalization

next-intl with English (`messages/en.json`) and Spanish (`messages/es.json`). Default locale is Spanish. Locale is stored in cookies.

### Types

All shared TypeScript types live in `src/types/index.tsx`.
