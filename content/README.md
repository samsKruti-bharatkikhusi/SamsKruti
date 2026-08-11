# SamsKruti — Content & Research workspace

This is where a city's entries are **researched and drafted** before they're published
into the app. Drafting happens here in markdown (fast, low-friction); the finished
entry is then converted into the typed JSON under `src/data/districts/<city>/`.

## The unit: one Entry
An Entry is one **Place** (Galiyan), one **Food** (Parampara), or one **Craft/Art** (Hriday).
Every entry is filled to the same anatomy — see `entry-template.md`:

- **History** — what happened · why it exists *(Past · Preserved)*
- **Memory** — how it's lived now · why people come, what they do *(Present · Practiced)*
- **Continuity** — how it survives or dies · who carries it on *(Future · Continued)*
- **Stories** — the narratives at the centre
- **People** — the voices & keepers
- **Experience** — how to engage (Visit / Taste / Meet)

Plus a **Vitality** flag: `Living · Fading · Endangered · Nearly Lost`.

## The pipeline (each stage ≈ one hour)
1. **Research** — gather + note sources → `content/<city>/research/<slug>.md`
2. **Draft** — copy `entry-template.md` → fill the six facets
3. **Verify** — fact-check the claims, set Vitality, tighten the prose
4. **Publish** — convert to JSON under `src/data/districts/<city>/{galiyan,parampara,hriday}.json`

## How we work
One hour a day, one entry at a time — consistency over intensity. Claude does the
first-pass research and first draft; the owner directs, verifies, and adds the
"hidden gem" judgment. **Depth-first: finish Varanasi before the next city.**

## What's next
See `content/varanasi/backlog.md` for the ordered list of entries to make.
