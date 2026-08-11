// Seed the content database from the existing TypeScript/JSON content in
// src/data. Idempotent: re-running upserts by natural key, so it's safe to run
// after every content edit. Run with `npm run db:seed`.
import { PrismaClient } from "@prisma/client";
import { DISTRICT_DATA } from "../src/data";

import upState from "../src/data/states/uttar-pradesh.json";
import wbState from "../src/data/states/west-bengal.json";
import rjState from "../src/data/states/rajasthan.json";
import mhState from "../src/data/states/maharashtra.json";
import dlState from "../src/data/states/delhi.json";

const prisma = new PrismaClient();

const STATES = [upState, wbState, rjState, mhState, dlState];

// publishedAt lives in the JSON but not in the TS content types — read it loosely.
const toDate = (v: unknown): Date | null =>
  typeof v === "string" ? new Date(v) : null;

async function main() {
  // 1. States (cities reference these by slug, so seed them first)
  for (const s of STATES) {
    await prisma.state.upsert({
      where: { slug: s.slug },
      update: { name: s.name, hindi: s.hindi },
      create: { slug: s.slug, name: s.name, hindi: s.hindi },
    });
  }
  console.log(`✔ states     ${STATES.length}`);

  const count = { cities: 0, stories: 0, foods: 0, artisans: 0, itineraries: 0 };

  for (const key of Object.keys(DISTRICT_DATA) as (keyof typeof DISTRICT_DATA)[]) {
    const d = DISTRICT_DATA[key];
    const meta = d.meta;
    const [lat, lng] = meta.coordinates ?? [];

    // 2. City / district
    await prisma.city.upsert({
      where: { id: meta._id },
      update: {
        slug: meta.slug,
        name: meta.name,
        hindi: meta.hindi,
        tagline: meta.tagline,
        description: meta.description,
        featured: meta.featured,
        latitude: lat ?? null,
        longitude: lng ?? null,
        dimensions: meta.dimensions,
        stateSlug: meta.state,
      },
      create: {
        id: meta._id,
        slug: meta.slug,
        name: meta.name,
        hindi: meta.hindi,
        tagline: meta.tagline,
        description: meta.description,
        featured: meta.featured,
        latitude: lat ?? null,
        longitude: lng ?? null,
        dimensions: meta.dimensions,
        stateSlug: meta.state,
      },
    });
    count.cities++;

    // 3. Stories (galiyan)
    for (const st of d.galiyan) {
      const fields = {
        slug: st.slug,
        title: st.title,
        excerpt: st.excerpt,
        body: st.body,
        category: st.category,
        tag: st.tag ?? null,
        featured: st.featured,
        gradient: st.gradient,
        publishedAt: toDate((st as { publishedAt?: string }).publishedAt),
        cityId: meta._id,
      };
      await prisma.story.upsert({
        where: { id: st._id },
        update: fields,
        create: { id: st._id, ...fields },
      });
      count.stories++;
    }

    // 4. Foods (parampara)
    for (const f of d.parampara) {
      const fields = {
        slug: f.slug,
        name: f.name,
        excerpt: f.excerpt,
        body: f.body,
        category: f.category,
        featured: f.featured,
        tags: f.tags,
        gradient: f.gradient,
        publishedAt: toDate((f as { publishedAt?: string }).publishedAt),
        cityId: meta._id,
      };
      await prisma.food.upsert({
        where: { id: f._id },
        update: fields,
        create: { id: f._id, ...fields },
      });
      count.foods++;
    }

    // 5. Artisans (hriday)
    for (const a of d.hriday) {
      const fields = {
        slug: a.slug,
        name: a.name,
        craft: a.craft,
        generation: a.generation,
        excerpt: a.excerpt,
        body: a.body,
        featured: a.featured,
        tags: a.tags,
        gradient: a.gradient,
        publishedAt: toDate((a as { publishedAt?: string }).publishedAt),
        cityId: meta._id,
      };
      await prisma.artisan.upsert({
        where: { id: a._id },
        update: fields,
        create: { id: a._id, ...fields },
      });
      count.artisans++;
    }

    // 6. Itinerary (only some districts have one)
    if ("itinerary" in d && d.itinerary) {
      const it = d.itinerary;
      const slug = `${it.stats.days}-day`;
      const itin = await prisma.itinerary.upsert({
        where: { cityId_slug: { cityId: meta._id, slug } },
        update: {
          title: it.title,
          subtitle: it.subtitle,
          intro: it.intro,
          durationDays: it.stats.days,
          stopCount: it.stats.stops,
          pricePerPerson: it.stats.pricePerPerson,
          operationalNotes: it.operationalNotes ?? [],
        },
        create: {
          cityId: meta._id,
          slug,
          title: it.title,
          subtitle: it.subtitle,
          intro: it.intro,
          durationDays: it.stats.days,
          stopCount: it.stats.stops,
          pricePerPerson: it.stats.pricePerPerson,
          operationalNotes: it.operationalNotes ?? [],
        },
      });

      // Replace the days/stops wholesale so edits to the itinerary flow through.
      await prisma.itineraryDay.deleteMany({ where: { itineraryId: itin.id } });
      for (const day of it.days) {
        await prisma.itineraryDay.create({
          data: {
            itineraryId: itin.id,
            dayNumber: day.day,
            theme: day.theme,
            themeEnglish: day.themeEnglish,
            hindi: day.hindi,
            tagline: day.tagline,
            accentColor: day.accentColor,
            stops: {
              create: day.stops.map((stp, i) => ({
                order: i,
                time: stp.time,
                name: stp.name,
                desc: stp.desc,
                story: stp.story,
                duration: stp.duration,
                isClosing: stp.isClosing ?? false,
              })),
            },
          },
        });
      }
      count.itineraries++;
    }
  }

  console.log(
    `✔ cities     ${count.cities}\n` +
      `✔ stories    ${count.stories}\n` +
      `✔ foods      ${count.foods}\n` +
      `✔ artisans   ${count.artisans}\n` +
      `✔ itineraries ${count.itineraries}`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
