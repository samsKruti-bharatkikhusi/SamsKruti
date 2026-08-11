import type { Metadata } from "next";
import { Sidebar } from "@/components/site/sidebar";
import { TopNav } from "@/components/site/top-nav";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { Marquee } from "@/components/site/marquee";
import { NewsletterForm } from "@/components/site/newsletter";
import { CityHero } from "@/components/site/city-hero";
import { HridayShop } from "@/components/site/hriday-shop";
import { SEGMENT_BY_SLUG } from "@/lib/segments";
import { HERO_THEMES } from "@/lib/hero-themes";

const segment = SEGMENT_BY_SLUG.hriday;

const MARQUEE_ITEMS = [
  "Banarasi Silk",
  "Gulabi Meenakari",
  "Zardozi",
  "Metal Repoussé",
  "Wood Carving",
  "Glass Beads",
  "Hand Block Print",
  "Soft Stone Jali",
  "Rudraksha",
  "Kulhad",
];

export const metadata: Metadata = {
  title: `${segment.name} — Heritage Gift Boxes · SamsKruti`,
  description:
    "Sheher Ka Hriday — curated Heritage Gift Boxes of Varanasi's GI-tagged artisan crafts. Don't buy a product. Carry a piece of civilizational memory.",
};

export default function HridayPage() {
  return (
    <div className="seg-page seg-hriday">
      <Sidebar theme={HERO_THEMES.hriday} />
      <TopNav page="hriday" theme={HERO_THEMES.hriday} />

      {/* Hero — shared CityHero, format unchanged */}
      <CityHero
        theme={HERO_THEMES.hriday}
        eyebrow="Sheher Ka Hriday"
        roman="I"
        title={<>The hands that <em>hold a city.</em></>}
        devanagari="शहर का हृदय"
        tagline="Behind every Indian city is a community of artisans who carry living knowledge in their hands. They make the objects India prays with, wears, and gives."
        actions={
          <>
            <a href="#boxes" className="btn-primary seg-btn">Shop the boxes</a>
            <a href="#artisans" className="btn-ghost">Meet the maker →</a>
          </>
        }
        productDots
        mapCenter={{ lat: 25.312, lng: 83.002 }}
        mapZoom={13}
      />

      <Marquee items={MARQUEE_ITEMS} className="seg-marquee" />

      {/* E-commerce body */}
      <HridayShop />

      <section className="colophon-section">
        <div className="colophon-inner">
          <div className="colophon-aside">
            <p className="label">Carry a piece home</p>
            <h2>
              The story, <em>in your hands</em>.
            </h2>
            <p>
              New boxes, artisan dispatches, and the crafts that survive — for those who understand
              the difference between a product and a piece of memory.
            </p>
          </div>
          <div className="colophon-card">
            <p className="label">Subscribe</p>
            <NewsletterForm ctaLabel="Subscribe" segmentBtn />
            <p className="meta">Sheher Ka Hriday · Chapter I of III</p>
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
