import type { Metadata } from "next";
import { Sidebar } from "@/components/site/sidebar";
import { TopNav } from "@/components/site/top-nav";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { NewsletterForm } from "@/components/site/newsletter";
import { CityHero } from "@/components/site/city-hero";
import { GaliyanContent } from "@/components/site/galiyan-content";
import { VaranasiDistrictMap } from "@/components/site/varanasi-district-map";
import { SEGMENT_BY_SLUG } from "@/lib/segments";
import { HERO_THEMES } from "@/lib/hero-themes";

const segment = SEGMENT_BY_SLUG.galiyan;

export const metadata: Metadata = {
  title: `${segment.name} — ${segment.english} · SamsKruti`,
  description: segment.tagline,
};

export default function GaliyanPage() {
  return (
    <div className="seg-page seg-galiyan">
      <Sidebar theme={HERO_THEMES.galiyan} />
      <TopNav page="galiyan" theme={HERO_THEMES.galiyan} />

      <CityHero
        theme={HERO_THEMES.galiyan}
        eyebrow="Sheher Ki Galiyan"
        roman="II"
        title={<>Streets of the <em>city.</em></>}
        devanagari="शहर की गलियाँ"
        tagline="The living fabric of India's great cities — entered through culture, craft, people, and memory. Not a tour. An understanding."
        actions={
          <>
            <a href="?tab=cities" className="btn-primary seg-btn">Explore the cities</a>
            <a href="?tab=stories" className="btn-ghost">Read field stories →</a>
          </>
        }
        segment="galiyan"
      />

      <section className="chapter-intro">
        <div className="chapter-intro-inner">
          <p className="label">Editor&apos;s note</p>
          <h2>
            Every city, told through <em>four dimensions</em>.
          </h2>
          <p>
            We do not enter a city through its monuments. We enter through its culture, its craft,
            its people, and its memory — four windows through which a city actually lives. The
            ghats of Varanasi are not a sightseeing stop; they are an unbroken rhythm. Kolkata&apos;s
            adda is not idle talk; it is a civilisational practice. Each city here gets the same
            patient treatment.
          </p>
          <p>
            Begin with Varanasi. Then walk on.
          </p>
        </div>
      </section>

      <section className="district-ctx-section">
        <div className="district-ctx-inner">
          <div className="district-ctx-text">
            <p className="label">Active district · Uttar Pradesh</p>
            <h2>
              Varanasi — <em>Street by street</em>.
            </h2>
            <p>
              Green markers show heritage sites, ancient lanes, ghats, and the places where
              the city&apos;s living culture is held. Scroll through the stories below to find each
              location on the map.
            </p>
          </div>
          <VaranasiDistrictMap variant="full" activeSegment="galiyan" />
        </div>
      </section>

      <GaliyanContent />

      <section className="colophon-section">
        <div className="colophon-inner">
          <div className="colophon-aside">
            <p className="label">Follow the streets</p>
            <h2>
              Dispatches from <em>the lanes</em>.
            </h2>
            <p>
              New city portraits, story excerpts, and field notes — sent quietly to your inbox as
              we add them.
            </p>
          </div>
          <div className="colophon-card">
            <p className="label">Subscribe</p>
            <NewsletterForm ctaLabel="Subscribe" segmentBtn />
            <p className="meta">Sheher Ki Galiyan · Chapter II of III</p>
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
