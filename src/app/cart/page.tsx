import type { Metadata } from "next";
import { Sidebar } from "@/components/site/sidebar";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { HERO_THEMES } from "@/lib/hero-themes";
import { HRIDAY_BOXES, HRIDAY_PRODUCTS } from "@/data/hriday-shop";

export const metadata: Metadata = {
  title: "The SamsKruti Cart — Buy India's living crafts",
  description:
    "The SamsKruti Cart — heritage gift boxes and GI-tagged crafts from India's living cities, gathered into one place. Today, from Varanasi.",
};

export default function CartPage() {
  return (
    <div className="cart-page">
      <Sidebar theme={HERO_THEMES.hriday} />

      <main className="hr-shop">
        <header className="cart-head">
          <p className="hr-eyebrow">The SamsKruti Cart</p>
          <h1 className="cart-title">Everything, <em>in one place</em>.</h1>
          <p className="cart-sub">
            Heritage gift boxes and GI-tagged crafts from India&apos;s living cities — gathered into
            one cart. Today, from Varanasi; soon, from every city we open.
          </p>
          <p className="cart-empty">Your cart is empty — add a box or a craft below.</p>
        </header>

        {/* Heritage gift boxes */}
        <section className="hr-boxes-section" id="boxes">
          <div className="hr-head">
            <p className="hr-eyebrow">Heritage Gift Boxes</p>
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
                <button type="button" className="hr-box-cta">Add to cart →</button>
              </article>
            ))}
          </div>
        </section>

        {/* Crafts */}
        <section className="hr-shop-section" id="shop">
          <div className="hr-head">
            <p className="hr-eyebrow">Shop the Crafts</p>
            <h2 className="hr-head-title">The crafts of <em>Kashi</em>.</h2>
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
      </main>

      <EditorialFooter />
    </div>
  );
}
