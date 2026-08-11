# Database (Prisma + Supabase)

The content core lives in Postgres (hosted on Supabase) and is accessed through
Prisma. This first pass covers: **states, cities/districts, stories (galiyan),
foods (parampara), artisans (hriday), and itineraries.** Guidebooks and the shop
still live in TypeScript under `src/data`.

## Files

| File | What it is |
| --- | --- |
| `prisma/schema.prisma` | The data model. Source of truth for tables. |
| `prisma/seed.ts` | Imports the existing `src/data` content into the DB. Idempotent. |
| `src/lib/db.ts` | The shared `PrismaClient` (`import { db } from "@/lib/db"`). |
| `.env` | Your Supabase connection strings (gitignored). |
| `.env.example` | Template for `.env`. |

## One-time Supabase setup

1. Go to <https://supabase.com> → **New project**. Pick a name, a strong
   **database password** (save it), and the region closest to your users.
2. Wait for it to provision (~2 min).
3. Top bar → **Connect** → **ORMs** tab → **Prisma**. Copy the two URLs it shows
   into `.env`:
   - `DATABASE_URL` — the pooled URL, port **6543**, ends with `?pgbouncer=true`
   - `DIRECT_URL` — the direct URL, port **5432**
   Replace `[YOUR-PASSWORD]` in both with the password from step 1.

## Create the tables and load content

```bash
npm run db:migrate -- --name init   # creates tables from the schema
npm run db:seed                      # loads src/data content into them
```

`db:migrate` writes a versioned migration under `prisma/migrations/` (commit
these). Then open **Studio** to eyeball the data:

```bash
npm run db:studio
```

## Everyday commands

| Command | When |
| --- | --- |
| `npm run db:migrate -- --name <change>` | You changed `schema.prisma` and want a migration. |
| `npm run db:seed` | Re-load content after editing `src/data` (upserts, non-destructive). |
| `npm run db:generate` | Regenerate the typed client (usually automatic after migrate). |
| `npm run db:studio` | Visual table browser. |
| `npm run db:reset` | Drop everything, re-run migrations, re-seed. Destructive. |

## Using it in the app

```ts
import { db } from "@/lib/db";

const varanasi = await db.city.findUnique({
  where: { slug: "varanasi" },
  include: { stories: true, foods: true, artisans: true },
});
```

## Images

The DB never stores image bytes — only a path/URL string (`City.heroImage`,
`Story.coverImage`, `ItineraryStop.image`, …). Store the actual files in a
**Supabase Storage** bucket (S3-compatible, CDN-backed) and keep the path in the
column. Do **not** commit generated art to `git`/`public` — it bloats the repo
and every deploy. See the "Where images go" note when we wire Storage.
