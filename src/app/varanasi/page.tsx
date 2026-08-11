import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar } from "@/components/site/sidebar";
import { TopNav } from "@/components/site/top-nav";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { CityHero } from "@/components/site/city-hero";
import { NewsletterForm } from "@/components/site/newsletter";
import { SEGMENTS } from "@/lib/segments";
import { HERO_THEMES } from "@/lib/hero-themes";

export const metadata: Metadata = {
  title: "Varanasi — SamsKruti",
  description:
    "The world's oldest continuously inhabited city, entered through three doorways — its streets, its kitchens, and its artisan hands.",
};

const DOORS = [
  {
    slug: "hriday" as const,
    roman: "I",
    pull: "Five generations of knowledge in the space between two threads.",
  },
  {
    slug: "galiyan" as const,
    roman: "II",
    pull: "The lane nobody mapped is the one worth entering.",
  },
  {
    slug: "parampara" as const,
    roman: "III",
    pull: "The recipe nobody wrote down feeds a civilisation.",
  },
] as const;

export default function VaranasiPage() {
  return (
    <div className="varanasi-hub">
      <Sidebar theme={HERO_THEMES.varanasi} />
      <TopNav page="varanasi" theme={HERO_THEMES.varanasi} />

      {/* ── Full-screen hero — mandala + city map with ideal points ── */}
      <CityHero
        theme={HERO_THEMES.varanasi}
        title={<>Vara<em>nasi</em></>}
        devanagari="वाराणसी"
        tagline="Entered through three doorways."
        sub="The world's oldest continuously inhabited city"
        hint={
          <>
            <span className="lp-hint-arrow">→</span>
            Tap a doorway on the map
          </>
        }
        dotNavigate
      />

      {/* ── Three segment doors ── */}
      <section className="varanasi-doors-section">
        <div className="varanasi-doors-head">
          <p className="hub-label">Three doorways · One civilisation</p>
        </div>
        <div className="varanasi-doors">
          {DOORS.map((door) => {
            const seg = SEGMENTS.find((s) => s.slug === door.slug)!;
            return (
              <Link
                key={door.slug}
                href={`/varanasi/${door.slug}`}
                className={`varanasi-door varanasi-door-${door.slug}`}
                style={
                  {
                    "--door-seg": seg.seg,
                    "--door-bg": seg.segBg,
                  } as React.CSSProperties
                }
              >
                {/* Grain + glow overlays */}
                <span className="varanasi-door-grain" aria-hidden="true" />
                <span className="varanasi-door-glow" aria-hidden="true" />

                <div className="varanasi-door-inner">
                  <p className="varanasi-door-number">{door.roman}</p>
                  <p className="varanasi-door-hindi">{seg.devanagari}</p>
                  <h2 className="varanasi-door-name">{seg.name}</h2>
                  <p className="varanasi-door-english">{seg.english}</p>
                  <p className="varanasi-door-pull">{door.pull}</p>
                  <span className="varanasi-door-cta">{seg.cta} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Brief colophon ── */}
      <section className="varanasi-colophon">
        <div className="varanasi-colophon-inner">
          <div className="varanasi-colophon-aside">
            <p className="hub-label hub-label-light">Stay in the story</p>
            <h2>
              Dispatches from <em>the field</em>.
            </h2>
            <p>
              New stories from the ghats, the lanes, the kitchens, and the
              workshops — sent quietly to your inbox.
            </p>
          </div>
          <div className="varanasi-colophon-form">
            <NewsletterForm ctaLabel="Join the journey" />
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
