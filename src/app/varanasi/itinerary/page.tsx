import type { Metadata } from "next";
import { Sidebar } from "@/components/site/sidebar";
import { TopNav } from "@/components/site/top-nav";
import { CityHero } from "@/components/site/city-hero";
import { VaranasiItinerary } from "@/components/site/varanasi-itinerary";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { HERO_THEMES } from "@/lib/hero-themes";

export const metadata: Metadata = {
  title: "Varanasi Itinerary — SamsKruti",
  description:
    "The complete Varanasi itinerary — the streets, the kitchens, and the artisan lanes of all three doorways, woven into a day-by-day journey.",
};

export default function VaranasiItineraryPage() {
  return (
    <div className="itinerary-page">
      <Sidebar theme={HERO_THEMES.varanasi} />
      <TopNav page="itinerary" theme={HERO_THEMES.varanasi} />

      <CityHero
        theme={HERO_THEMES.varanasi}
        eyebrow="Varanasi"
        title={<>The <em>Itinerary</em></>}
        devanagari="वाराणसी · यात्रा"
        tagline="Three doorways, one journey — the ghats, the kitchens, and the artisan lanes, woven into days."
        actions={
          <>
            <a href="#itinerary" className="btn-primary seg-btn">Begin the journey</a>
            <a href="/varanasi" className="btn-ghost">Back to Varanasi →</a>
          </>
        }
      />

      <section className="itin-section" id="itinerary">
        <div className="section-inner">
          <p className="eyebrow">The Complete Itinerary</p>
          <div className="eyebrow-rule" />
          <h2 className="section-title">
            All three doorways, <em>woven into days</em>.
          </h2>
          <p className="section-body">
            Not three separate trips — one journey. The streets, the kitchens, and the artisan
            quarters of Varanasi, sequenced into a day-by-day plan.
          </p>
          <VaranasiItinerary />
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
