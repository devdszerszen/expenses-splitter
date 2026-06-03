# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Vite dev server
npm run build        # tsc -b && vite build
npm run preview      # preview production build
npm test             # run all tests (vitest run)
npm run test:watch   # vitest in watch mode
```

Run a single test file: `npx vitest run src/lib/settlement.test.ts`

## Environment

Requires `.env.local` with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

**Stack:** Vite + React 18 + TypeScript + Supabase + Tailwind CSS, deployed as a PWA on Vercel.

**Routing:** Two routes — `/` (Home, create/join rooms) and `/room/:roomId` (Room view). Room.tsx is the main page component; it composes all hooks and sub-components.

**Data layer:** All Supabase access goes through two hooks:
- `useRoom(roomId)` — fetches room metadata once on mount
- `useExpenses(roomId)` — fetches expenses and subscribes to Postgres realtime changes (INSERT/DELETE events on the `expenses` table)

The Supabase client singleton is in `src/lib/supabase.ts`. The database schema is in `supabase/migrations/001_initial.sql` — two tables (`rooms`, `expenses`) with permissive RLS (UUID acts as the access token).

**Settlement logic:** `src/lib/settlement.ts` — pure function `calculateSettlement(totalA, totalB)` returns who owes whom and how much (each team pays half the difference).

**PIN security:** Optional PIN is hashed with SHA-256 client-side (`src/lib/hash.ts`) before being stored. `PinGate` component gates room access by comparing the hash.

**i18n:** `src/i18n.ts` — static EN/PL strings selected at module load time by `navigator.language`. All UI text comes from the exported `t` object; no i18n library.

**Tailwind theme:** Uses custom color tokens `text-team-a` / `text-team-b` / `bg-team-a` etc. defined in `tailwind.config.js` — use these for team-colored UI elements.

**iOS PWA quirk:** Room ID is stored in a cookie (not localStorage) so it's shared between Safari and the installed PWA on iOS (`Room.tsx:50`).

## Testing

Tests use Vitest + Testing Library + jsdom. Setup in `src/test-setup.ts`. Test files sit next to their source (`*.test.ts` / `*.test.tsx`). Pure logic tests cover `settlement.ts` and `hash.ts`; component tests cover `AddExpenseModal`, `ExpenseList`, and `Scoreboard`.
