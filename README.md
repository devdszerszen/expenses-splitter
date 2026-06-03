# Trip Splitter

Real-time expense splitter for groups of friends. Each room has two teams that track shared costs — a settlement verdict updates live as expenses are added.

Built with Vite + React + TypeScript + Supabase + Tailwind CSS. Installable as a PWA.

## Local Development

```bash
git clone <repo>
cd trip-splitter
npm install
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial.sql`
3. Go to **Database → Replication** and enable Realtime for the `expenses` table (INSERT, UPDATE, DELETE)
4. Copy your **Project URL** and **anon key** from Settings → API into `.env.local`

## Vercel Deploy

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Deploy — auto-deploys on every push to `main`

## Creating a Custom Skin

Just create a new room with your own team names. The app is fully generic — there's nothing Szerszenie-specific in the code. The Quick Start button on the home page is a convenience pre-fill only.

## Security

- **Anon key**: Supabase's anon key is safe to expose in the browser. It's a public key, not a secret. Access to data is controlled entirely by Row Level Security (RLS) at the database level.
- **Room access**: Rooms are protected by UUID — a 122-bit random value. Without the UUID, a room cannot be found. Treat the room link as the access token.
- **PIN**: If set, the PIN is hashed with SHA-256 in the browser before being stored. The plain PIN never leaves the client.
- **RLS policies**: All policies are in `supabase/migrations/001_initial.sql`. Expenses are scoped to `room_id` in application logic (RLS is permissive by design because the UUID itself is the secret).
