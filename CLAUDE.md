# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

春期講習（3/25–4/4）のシフト希望を5人の講師がスマホから入力・確認できるWebアプリ。React + TypeScript + Vite フロントエンドに Supabase バックエンドを接続。

## Commands

- `npm run dev` — Start dev server (Vite, default port 5173)
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build locally

## Tech Stack

- **React 19** with functional components and hooks
- **TypeScript ~5.9** with strict mode (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)
- **Vite 7** with @vitejs/plugin-react
- **Supabase** (`@supabase/supabase-js`) — DB + Realtime
- **ESLint 9** flat config with typescript-eslint, react-hooks, react-refresh

## Architecture

```
src/
  App.tsx                    — Auth gate: TeacherSelect or ShiftScheduler
  main.tsx                   — Entry point (StrictMode wrapper)
  types/index.ts             — All TypeScript types (TeacherId, StatusKey, FullSchedule, etc.)
  data/constants.ts          — TEACHERS, SLOTS, STATUSES, DATES, initSchedule()
  lib/supabase.ts            — Supabase client (reads VITE_SUPABASE_URL/ANON_KEY from env)
  hooks/
    useTeacherAuth.ts        — localStorage-based teacher selection (no password)
    useShiftPreferences.ts   — Supabase CRUD + Realtime subscription + optimistic updates
  components/
    TeacherSelect.tsx        — Landing page: pick your name
    ShiftScheduler.tsx       — Main shell (header, view toggle, bottom teacher nav, loading/error states)
    InputView.tsx            — Per-teacher date cards with status selectors
    SummaryView.tsx          — Cross table + export + per-teacher chips
    DateCard.tsx / StatusSelector.tsx / CrossTable.tsx / ProgressBar.tsx / Toast.tsx / ExportModal.tsx
```

**Data flow**: Teacher selects name → localStorage stores it → `useShiftPreferences` fetches all rows from Supabase → renders schedule → status changes trigger optimistic update + Supabase upsert → Realtime subscription syncs changes across tabs.

**Supabase table**: `shift_preferences` (teacher_id, date_key, slot_id, status) with UNIQUE constraint on (teacher_id, date_key, slot_id). No auth — anon key with open RLS policies.

## TypeScript Conventions

- `verbatimModuleSyntax` is enabled: use `import type { ... }` for type-only imports
- All component props use explicit interfaces
- Inline styles throughout (no CSS modules or Tailwind) — CSS file only for animations and CSS variables

## Environment Variables

`.env.local` (not committed):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
