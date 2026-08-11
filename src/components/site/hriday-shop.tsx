import { HRIDAY_BOXES, HRIDAY_PRODUCTS, HRIDAY_ARTISAN } from "@/data/hriday-shop";
import { BuildABox } from "@/components/site/build-a-box";

/**
 * Sheher Ka Hriday — the commerce body (the hero stays the shared CityHero).
 * A premium artisan storefront: the Heritage Gift Box as the gateway product,
 * the three tiers, the GI-tagged crafts inside, and the maker behind them.
 * Navy + gold, echoing the physical box aesthetic.
 */
export function HridayShop() {
  return (
    <div className="hr-shop">
      {/* ── The Box — the gateway product ─────────────────────── */}
      <section className="hr-feature" id="the-box">
        <div className="hr-feature-media">
          <img src="/data/images/hriday/varanasi-box.png" alt="The SamsKruti Varanasi Heritage Gift Box, open" />
        </div>
        <div className="hr-feature-copy">
          <p className="hr-eyebrow">The Heritage Gift Box</p>
          <h2 className="hr-feature-title">
            Don&apos;t buy a product. <em>Carry a piece of civilizational memory.</em>
          </h2>
          <p className="hr-feature-body">
            Not a gift hamper — a curated cultural experience in physical form. Every box opens with a
            heritage card telling the city&apos;s story, holds GI-tagged crafts made by Varanasi&apos;s
            master artisans, and carries a story card for every piece inside.
          </p>
          <ul className="hr-feature-points">
            <li>Every piece GI-tagged or artisan-sourced — no mass-produced imitations</li>
            <li>A story card for each piece — who made it, where, why it matters</li>
            <li>A heritage city card set into the lid</li>
            <li>Sealed with the maker&apos;s mark</li>
          </ul>
          <p className="hr-feature-tag">Treasures of Varanasi · Crafted with Heritage. Given with Honor.</p>
          <a href="#boxes" className="hr-cta-primary">Choose your box ↓</a>
        </div>
      </section>

      {/* ── Three box tiers ───────────────────────────────────── */}
      <section className="hr-boxes-section" id="boxes">
        <div className="hr-head">
          <p className="hr-eyebrow">The Boxes</p>
          <h2 className="hr-head-title">Three boxes. <em>One civilisation.</em></h2>
        </div>
        <div className="hr-boxes">
          {HRIDAY_BOXES.map((box) => (
            <article key={box.id} className={`hr-box${box.featured ? " is-featured" : ""}`}>
              {box.featured && <span className="hr-box-flag">Most Popular</span>}
              <p className="hr-box-hindi">{box.hindi}</p>
              <h3 className="hr-box-name">{box.name}</h3>
              <p className="hr-box-tier">{box.tier}</p>
              <p className="hr-box-price">{box.price}</p>
              <ul className="hr-box-contents">
                {box.contents.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p className="hr-box-for">{box.forWhom}</p>
              <p className="hr-box-delivery">{box.delivery}</p>
              <button type="button" className="hr-box-cta">Gift this box →</button>
            </article>
          ))}
        </div>
      </section>

      {/* ── Build your own box (Phase 6) ──────────────────────── */}
      <BuildABox />

      {/* ── Shop the crafts ───────────────────────────────────── */}
      <section className="hr-shop-section" id="shop">
        <div className="hr-shop-banner">
          <img src="/data/images/hriday/varanasi-crafts.jpg" alt="Hand-made Varanasi crafts" />
          <div className="hr-shop-banner-text">
            <p className="hr-eyebrow">What Goes Inside</p>
            <h2 className="hr-head-title">The crafts of <em>Kashi</em>.</h2>
            <p className="hr-shop-banner-sub">
              Sourced from Varanasi&apos;s master artisans. Where it exists, every craft is GI-tagged —
              legally protected, and only ever made here.
            </p>
          </div>
        </div>
        <div className="hr-products">
          {HRIDAY_PRODUCTS.map((p) => (
            <article key={p.name} className="hr-product">
              <div className="hr-product-thumb">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="hr-product-top">
                <span className="hr-product-cat">{p.category}</span>
                {p.gi && <span className="hr-product-gi" title="Geographical Indication tagged">GI</span>}
              </div>
              <h3 className="hr-product-name">{p.name}</h3>
              <p className="hr-product-blurb">{p.blurb}</p>
              <p className="hr-product-maker">{p.maker}</p>
              <p className="hr-product-price">{p.price}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── The artisan ───────────────────────────────────────── */}
      <section className="hr-artisan" id="artisans">
        <div className="hr-artisan-inner">
          <p className="hr-eyebrow">The Maker</p>
          <blockquote className="hr-artisan-pull">{HRIDAY_ARTISAN.pull}</blockquote>
          <p className="hr-artisan-story">{HRIDAY_ARTISAN.story}</p>
          <p className="hr-artisan-name">
            {HRIDAY_ARTISAN.name}
            <span className="hr-artisan-meta">{HRIDAY_ARTISAN.craft} · {HRIDAY_ARTISAN.place}</span>
          </p>
        </div>
      </section>

    </div>
  );
}
