"use client";

import { useState } from "react";
import { HRIDAY_PRODUCTS } from "@/data/hriday-shop";
import { Box3D } from "@/components/site/box-3d";

// Set to "/data/models/hriday-box.glb" once the 3D model is provided.
const BOX_MODEL: string | null = null;

/**
 * Build-your-own box (Phase 6). The hero is the ADDITION: as you add a craft,
 * the box fills and the newest piece takes the spotlight with its story.
 * Local state only — no cart backend yet.
 */
export function BuildABox() {
  const [added, setAdded] = useState<string[]>([]);

  function toggle(name: string) {
    setAdded((cur) =>
      cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name],
    );
  }

  // The most recently added piece still in the box — the addition spotlight.
  const spotName = added.length ? added[added.length - 1] : null;
  const spot = HRIDAY_PRODUCTS.find((p) => p.name === spotName) ?? null;

  return (
    <section className="bab" id="build">
      <div className="hr-head">
        <p className="hr-eyebrow">Create Your Own</p>
        <h2 className="hr-head-title">Build your <em>box</em>.</h2>
        <p className="bab-intro">
          Choose the crafts that mean something to you. Each piece you add carries its
          story into the box — the box is yours, and so is the reason behind it.
        </p>
      </div>

      <div className="bab-grid">
        {/* ── The box ─────────────────────────────── */}
        <aside className="bab-box">
          <div className={`bab-box-visual${added.length ? " has-items" : ""}${BOX_MODEL ? " is-3d" : ""}`}>
            <Box3D model={BOX_MODEL} fallbackSrc="/data/images/hriday/varanasi-box.png" alt="Your SamsKruti heritage box" />
            <span className="bab-box-badge">{added.length}</span>
          </div>
          <div className="bab-box-head">
            <span className="bab-box-title">Your Box</span>
            <span className="bab-box-count">
              {added.length} {added.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          {spot ? (
            <div className="bab-spotlight" key={spot.name}>
              <div className="bab-spot-img"><img src={spot.image} alt={spot.name} /></div>
              <p className="bab-spot-label">Just added · the story</p>
              <h3 className="bab-spot-name">{spot.name}</h3>
              <p className="bab-spot-why">{spot.story}</p>
              <p className="bab-spot-maker">{spot.maker}</p>
            </div>
          ) : (
            <div className="bab-empty">
              <p className="bab-empty-title">Your box is empty.</p>
              <p className="bab-empty-sub">
                Add a craft and watch it fill — each with the story of why it belongs.
              </p>
            </div>
          )}

          {added.length > 0 && (
            <ul className="bab-items">
              {added.map((name) => {
                const prod = HRIDAY_PRODUCTS.find((x) => x.name === name);
                return (
                  <li key={name} className="bab-item">
                    {prod && (
                      <span className="bab-item-thumb"><img src={prod.image} alt="" /></span>
                    )}
                    <span className="bab-item-name">{name}</span>
                    <button
                      type="button"
                      className="bab-item-remove"
                      aria-label={`Remove ${name}`}
                      onClick={() => toggle(name)}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button type="button" className="bab-cta" disabled={added.length === 0}>
            {added.length === 0
              ? "Add a craft to begin"
              : `Gift this box (${added.length}) →`}
          </button>
        </aside>

        {/* ── The picker ──────────────────────────── */}
        <div className="bab-picker">
          {HRIDAY_PRODUCTS.map((p) => {
            const isAdded = added.includes(p.name);
            return (
              <article key={p.name} className={`bab-pick${isAdded ? " is-added" : ""}`}>
                <div className="bab-pick-thumb">
                  <img src={p.image} alt={p.name} loading="lazy" />
                </div>
                <div className="bab-pick-top">
                  <span className="bab-pick-cat">{p.category}</span>
                  {p.gi && <span className="hr-product-gi" title="Geographical Indication tagged">GI</span>}
                </div>
                <h3 className="bab-pick-name">{p.name}</h3>
                <p className="bab-pick-blurb">{p.blurb}</p>
                <p className="bab-pick-maker">{p.maker}</p>
                <div className="bab-pick-foot">
                  <span className="bab-pick-price">{p.price}</span>
                  <button
                    type="button"
                    className="bab-pick-btn"
                    aria-pressed={isAdded}
                    onClick={() => toggle(p.name)}
                  >
                    {isAdded ? "Added ✓" : "Add +"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
