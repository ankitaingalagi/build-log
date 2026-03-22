# Build Log

A public wall where people post what they shipped. No login required.

## Stack

- **Framework**: Next.js 16.2.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + inline CSS variables (dark theme)
- **Database**: Supabase (PostgreSQL)
- **Font**: Geist

## Supabase

- **Project URL**: https://qxeqgtdbkuzvkdcbovin.supabase.co
- **Table**: `BUILD_LOGS`
- **Anon key**: stored in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Schema

```sql
CREATE TABLE "BUILD_LOGS" (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text        NOT NULL,
  project_link text,
  created_at   timestamptz DEFAULT now(),
  fire_count   integer     DEFAULT 0,
  clap_count   integer     DEFAULT 0,
  rocket_count integer     DEFAULT 0
);
```

### Postgres function (atomic reaction increments)

```sql
CREATE OR REPLACE FUNCTION increment_reaction(log_id uuid, reaction text)
RETURNS void AS $$
BEGIN
  IF reaction = 'fire' THEN
    UPDATE "BUILD_LOGS" SET fire_count = fire_count + 1 WHERE id = log_id;
  ELSIF reaction = 'clap' THEN
    UPDATE "BUILD_LOGS" SET clap_count = clap_count + 1 WHERE id = log_id;
  ELSIF reaction = 'rocket' THEN
    UPDATE "BUILD_LOGS" SET rocket_count = rocket_count + 1 WHERE id = log_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

## Project Structure

```
app/
  actions.ts               # Server Actions (createBuildLog, incrementReaction)
  page.tsx                 # Server component — fetches BUILD_LOGS, renders feed
  layout.tsx               # Root layout with Geist font and dark background
  globals.css              # CSS custom properties (dark theme tokens)
  components/
    BuildLogForm.tsx        # Client component — form with useActionState, clears on success
    BuildLogCard.tsx        # Client component — card with avatar, relative time, reactions
lib/
  supabase.ts              # Supabase client + BuildLog type
```

## Features

- **Submit form**: name, description, optional project link — inserts into Supabase, revalidates page
- **Feed**: newest first, server-rendered on each request
- **Cards**: color-coded avatar (initials, color derived from name hash), relative time (e.g. "3 hours ago"), clickable "View Project ↗" link
- **Reactions**: 🔥 👏 🚀 buttons with optimistic UI — count increments instantly, persists via `increment_reaction` RPC
- **Dark theme**: CSS variables on `:root`, no system preference dependency

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://qxeqgtdbkuzvkdcbovin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## Dev

```bash
npm run dev      # http://localhost:3000
npm run build    # production build check
```

## Git

- **Repo**: https://github.com/ankitaingalagi/build-log
- **Remote**: SSH (git@github.com:ankitaingalagi/build-log.git)
- **Default branch**: main
