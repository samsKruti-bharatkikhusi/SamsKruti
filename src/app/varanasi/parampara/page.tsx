import type { Metadata } from "next";
import { Sidebar } from "@/components/site/sidebar";
import { TopNav } from "@/components/site/top-nav";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { Marquee } from "@/components/site/marquee";
import { NewsletterForm } from "@/components/site/newsletter";
import { CityHero } from "@/components/site/city-hero";
import { ParamparaFoods } from "@/components/site/parampara-foods";
import { ParamparaCities } from "@/components/site/parampara-cities";
import { VaranasiDistrictMap } from "@/components/site/varanasi-district-map";
import { SEGMENT_BY_SLUG } from "@/lib/segments";
import { HERO_THEMES } from "@/lib/hero-themes";

const segment = SEGMENT_BY_SLUG.parampara;

const MARQUEE_ITEMS = [
  "Banarasi Paan",
  "Litti Chokha",
  "Kathi Roll",
  "Mishti Doi",
  "Dal Baati Churma",
  "Vada Pav",
  "Old Delhi Chaat",
  "Nihari",
  "Ghevar",
  "Pav Bhaji",
];

export const metadata: Metadata = {
  title: `${segment.name} — ${segment.english} · SamsKruti`,
  description: segment.tagline,
};

export default function ParamparaPage() {
  return (
    <div className="seg-page seg-parampara">
      <Sidebar theme={HERO_THEMES.parampara} />
      <TopNav page="parampara" theme={HERO_THEMES.parampara} />

      <CityHero
        theme={HERO_THEMES.parampara}
        eyebrow="Sheher Ka Swaad"
        roman="III"
        title={<>Food, but as <em>memory.</em></>}
        devanagari="शहर का स्वाद"
        tagline="India's food is not cuisine. It is geography, devotion, and survival on a plate. Each dish carries the weight of the civilization that made it."
        actions={
          <>
            <a href="#traditions" className="btn-primary seg-btn">Explore traditions</a>
            <a href="#cities" className="btn-ghost">Browse by city →</a>
          </>
        }
        segment="parampara"
      />

      <Marquee items={MARQUEE_ITEMS} className="seg-marquee" />

      <section className="chapter-intro">
        <div className="chapter-intro-inner">
          <p className="label">Editor&apos;s note</p>
          <h2>
            Not recipes. <em>Stories.</em>
          </h2>
          <p>
            Geography shapes food. The desert produces different traditions than the river-delta;
            the temple kitchen and the street cart serve different gods. We document food the way
            an anthropologist might — patiently, asking what a dish is doing in a city, not just
            what is in it.
          </p>
          <p>
            Begin with a paan-wallah in Varanasi. End with a Nihari joint in Old Delhi.
          </p>
        </div>
      </section>

      <section className="district-ctx-section">
        <div className="district-ctx-inner">
          <div className="district-ctx-text">
            <p className="label">Active district · Uttar Pradesh</p>
            <h2>
              Varanasi — <em>Kitchen by kitchen</em>.
            </h2>
            <p>
              Tamarind markers show the food lanes, bazaars, and kitchen traditions of Varanasi.
              Each location is where a specific dish or food practice survives.
            </p>
          </div>
          <VaranasiDistrictMap variant="full" activeSegment="parampara" />
        </div>
      </section>

      <section className="seg-content-section" id="traditions">
        <div className="section-inner">
          <p className="eyebrow">Living Traditions</p>
          <div className="eyebrow-rule" />
          <h2 className="section-title seg-title">
            Dishes that carry <em>memory</em>.
          </h2>
          <p className="section-body">
            Each food tradition here is a window into the city that made it and the people who
            keep it alive.
          </p>
          <ParamparaFoods />
        </div>
        <div className="stories-scroll-hint" aria-hidden="true">
          <span className="scroll-hint-line" />
          <span className="scroll-hint-text">Scroll to explore</span>
          <span className="scroll-hint-line" />
        </div>
      </section>

      <section className="seg-city-section" id="cities">
        <div className="section-inner">
          <p className="eyebrow">By City</p>
          <div className="eyebrow-rule" />
          <h2 className="section-title">
            Every city, a different <em>kitchen</em>.
          </h2>
          <p className="section-body">
            Geography shapes food. Explore what each city brought to India&apos;s table.
          </p>
          <ParamparaCities />
        </div>
      </section>

      <section className="quote-section editorial">
        <div className="section-inner">
          <div className="quote-card fade-in">
            <div className="quote-mark">&ldquo;</div>
            <p className="quote-text">
              Food is the autobiography of a civilisation. Every dish tells you what land it came
              from, what crisis it survived, and what it chose to celebrate.
            </p>
            <p className="quote-attribution">Sheher Ka Swaad — The Food Thesis</p>
          </div>
        </div>
      </section>

      <section className="colophon-section">
        <div className="colophon-inner">
          <div className="colophon-aside">
            <p className="label">Eat with context</p>
            <h2>
              Taste India <em>differently</em>.
            </h2>
            <p>
              New traditions, ingredient stories, and city kitchen dispatches — sent to those who
              eat with curiosity.
            </p>
          </div>
          <div className="colophon-card">
            <p className="label">Subscribe</p>
            <NewsletterForm ctaLabel="Subscribe" segmentBtn />
            <p className="meta">Sheher Ka Swaad · Chapter III of III</p>
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
