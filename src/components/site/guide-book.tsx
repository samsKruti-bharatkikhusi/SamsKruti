"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { GuideBookData, GuidePage, Photo, CheckItem, ArrivalKey, ScanLink } from "@/data/guidebooks/types";

// ── The Guide Workbook reader ─────────────────────────────────────────────
// A generic engine: hand it a GuideBookData and it renders an OPEN two-page
// book you work in — tick off what you've done (saved per-book between visits),
// paste photos into the frames, keep it as a scrapbook. Real 3D page-flip,
// Cormorant + Devanagari, a dark cover spread. Turn with the arrows, ← → keys,
// or the side buttons. Narrow screens stack the pages and cross-fade.

// What the reader picked in the panel above the book. The cover prints these,
// so it always describes the book you are actually holding.
export type Choices = { journey: string; arrival: string; language: string };

type Ctx = { checked: Set<string>; toggle: (id: string) => void; arrival: ArrivalKey; choices?: Choices };

export function GuideBook({ book, tabs, arrival = "morning", choices }: { book: GuideBookData; tabs?: ReactNode; arrival?: ArrivalKey; choices?: Choices }) {
  const pages = book.pages;

  const spreads = useMemo(() => {
    // Page 0 is the COVER (shown closed, and as the flipping cover). Spreads
    // start at page 1 — the inside-front-cover — so opening shows the inside
    // cover on the left + page 1 on the right, never the cover again.
    const s: [GuidePage, GuidePage | null][] = [];
    for (let i = 1; i < pages.length; i += 2) s.push([pages[i], pages[i + 1] ?? null]);
    return s;
  }, [pages]);
  const total = spreads.length;

  const allIds = useMemo(() => {
    const ids: string[] = [];
    for (const pg of pages) {
      if (pg.kind === "checklist") for (const it of pg.items) ids.push(it.id);
      if (pg.kind === "arrival") for (const v of pg.variants) for (const it of v.items) ids.push(it.id);
      if (pg.kind === "craft" && pg.checkId) ids.push(pg.checkId);
    }
    return [...new Set(ids)];
  }, [pages]);

  const folioFor = useCallback(
    (pg: GuidePage | null): number | null => {
      if (!pg) return null;
      const i = pages.indexOf(pg);
      return i < 2 ? null : i - 1; // cover (0) + inside-cover (1) unnumbered; page 1 begins at index 2
    },
    [pages],
  );

  const [spread, setSpread] = useState(0);
  const [anim, setAnim] = useState<null | "next" | "prev">(null);
  const [isWide, setIsWide] = useState(true);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"front" | "open" | "back">("front");
  const [boundaryAnim, setBoundaryAnim] = useState<null | "open" | "close">(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 760px)");
    const sync = () => setIsWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(book.storeKey);
      setChecked(raw ? new Set(JSON.parse(raw) as string[]) : new Set());
    } catch { /* ignore */ }
  }, [book.storeKey]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        try { localStorage.setItem(book.storeKey, JSON.stringify([...next])); } catch { /* ignore */ }
        return next;
      });
    },
    [book.storeKey],
  );

  const ctx: Ctx = useMemo(() => ({ checked, toggle, arrival, choices }), [checked, toggle, arrival, choices]);

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (anim || boundaryAnim) return;
      if (dir === "next") {
        if (view === "front") { setSpread(0); setView("open"); setBoundaryAnim("open"); return; }
        if (view === "open") {
          if (spread < total - 1) { if (isWide) setAnim("next"); else setSpread(spread + 1); }
          else { setView("back"); setBoundaryAnim("close"); } // past the last page → close the book
          return;
        }
        // view === "back": already closed, nothing past the end
      } else {
        if (view === "back") { setSpread(total - 1); setView("open"); setBoundaryAnim("open"); return; }
        if (view === "open") {
          if (spread > 0) { if (isWide) setAnim("prev"); else setSpread(spread - 1); }
          else { setView("front"); setBoundaryAnim("close"); } // before the first page → close to the cover
          return;
        }
        // view === "front": already at the cover
      }
    },
    [anim, boundaryAnim, isWide, total, view, spread],
  );

  const endFlip = useCallback(() => {
    setSpread((s) => (anim === "next" ? s + 1 : anim === "prev" ? s - 1 : s));
    setAnim(null);
  }, [anim]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("next");
      else if (e.key === "ArrowLeft") go("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const cur = spreads[spread] ?? [null, null];
  const target = anim === "next" ? spreads[spread + 1] : anim === "prev" ? spreads[spread - 1] : null;

  let leftPage: GuidePage | null = cur[0];
  let rightPage: GuidePage | null = cur[1];
  let frontPage: GuidePage | null = null;
  let backPage: GuidePage | null = null;
  if (anim === "next" && target) {
    rightPage = target[1];
    frontPage = cur[1];
    backPage = target[0];
  } else if (anim === "prev" && target) {
    leftPage = target[0];
    frontPage = cur[0];
    backPage = target[1];
  }

  const doneCount = allIds.filter((id) => checked.has(id)).length;
  const atStart = view === "front";
  const atEnd = view === "back";
  const busy = !!anim || !!boundaryAnim;
  const label = atStart ? "Cover — tap › to open" : atEnd ? "The book is closed" : `Spread ${spread + 1} of ${total}`;

  return (
    <div className="gb-root">
      <style>{GB_CSS}</style>

      {tabs}

      {view === "open" && (
        <div className="gb-top">
          <span className="gb-top-title">{book.topLabel}</span>
          <span className="gb-progress">{doneCount} / {allIds.length} done</span>
          <a href="/varanasi" className="gb-close">Close ✕</a>
        </div>
      )}

      <div className="gb-stage">
        <button className="gb-arrow gb-arrow-l" aria-label="Previous page" onClick={() => go("prev")} disabled={atStart || busy}>‹</button>
        <button className="gb-arrow gb-arrow-r" aria-label="Next page" onClick={() => go("next")} disabled={atEnd || busy}>›</button>

        {view !== "open" ? (
          <div className={`gb-closed${boundaryAnim === "close" ? " gb-anim-close" : ""}`} onAnimationEnd={(e) => { if (e.target === e.currentTarget) setBoundaryAnim(null); }}>
            <div className={`gb-book-closed gb-paper gb-dark${pages[0].kind === "cover" && (pages[0].artwork || pages[0].image) ? " gb-paper-plate" : ""}`}>{renderPage(pages[0], ctx)}</div>
          </div>
        ) : (
          <div className={`gb-openwrap${boundaryAnim === "open" ? " gb-anim-open" : ""}`} onAnimationEnd={(e) => { if (e.target === e.currentTarget) setBoundaryAnim(null); }}>
            {isWide ? (
              <div className="gb-book2">
                <div className="gb-half gb-half-l">{leaf(leftPage, "left", ctx, folioFor(leftPage))}</div>
                <div className="gb-half gb-half-r">{leaf(rightPage, "right", ctx, folioFor(rightPage))}</div>
                {anim && (
                  <div className={`gb-flip gb-flip-${anim}`} onAnimationEnd={(e) => { if (e.target === e.currentTarget) endFlip(); }}>
                    <div className="gb-flip-face gb-flip-front">
                      {leaf(frontPage, anim === "next" ? "right" : "left", ctx, folioFor(frontPage))}
                      <div className="gb-flip-shade" />
                    </div>
                    <div className="gb-flip-face gb-flip-back">
                      {leaf(backPage, anim === "next" ? "left" : "right", ctx, folioFor(backPage))}
                      <div className="gb-flip-shade" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="gb-book2 gb-book2-narrow" key={spread}>
                <div className="gb-half gb-half-l">{leaf(cur[0], "left", ctx, folioFor(cur[0]))}</div>
                <div className="gb-half gb-half-r">{leaf(cur[1], "right", ctx, folioFor(cur[1]))}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="gb-nav">
        <button className="gb-btn" onClick={() => go("prev")} disabled={atStart || busy}>‹ Back</button>
        <span className="gb-count">{label}</span>
        <button className="gb-btn" onClick={() => go("next")} disabled={atEnd || busy}>Turn ›</button>
      </div>
    </div>
  );
}

function leaf(pg: GuidePage | null, side: "left" | "right", ctx: Ctx, folio: number | null) {
  if (!pg) return <div className={`gb-paper gb-blank gb-paper-${side}`} />;
  const dark = "dark" in pg && pg.dark;
  const plate = pg.kind === "plate" || pg.kind === "artwork" || (pg.kind === "cover" && !!(pg.artwork || pg.image));
  // Every ordinary page wears the printed frame. Full-bleed artwork brings its
  // own edge-to-edge design, and the dark endpapers are meant to stay bare.
  const framed = !plate && !dark;
  return (
    <div className={`gb-paper gb-paper-${side}${dark ? " gb-dark" : ""}${plate ? " gb-paper-plate" : ""}${framed ? " gb-framed" : ""}`}>
      {renderPage(pg, ctx)}
      {!plate && folio !== null && <Folio n={folio} />}
    </div>
  );
}

// Just the number. Everything around it — the star cartouche, the rule, the
// floral band, the ghats — is printed into the page frame artwork (see
// GB_FRAME). This sits in the empty cartouche the frame leaves for it.
function Folio({ n }: { n: number }) {
  return <span className="gb-folio-n">{String(n).padStart(2, "0")}</span>;
}

// A scannable link. The little code is drawn deterministically from the URL so
// it's stable (no hydration flicker) and *looks* like a QR; the real scannable
// code is generated for the printed edition. On screen it's a tappable hook.
function QrTag({ link, lost, boxed }: { link: ScanLink; lost?: boolean; boxed?: boolean }) {
  const N = 25;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < link.url.length; i++) { h = (h ^ link.url.charCodeAt(i)) >>> 0; h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const isFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const mods: [number, number][] = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const on = rnd() > 0.52; if (on && !isFinder(x, y)) mods.push([x, y]); }
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" fill="#1A120A" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#FFFFFF" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="#1A120A" />
    </g>
  );
  return (
    <a className={`gb-qr${lost ? " gb-qr-lost" : ""}${boxed ? " gb-qr-boxed" : ""}`} href={link.url} target="_blank" rel="noreferrer">
      <span className="gb-qr-code">
        <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" aria-hidden="true">
          <rect width={N} height={N} fill="#FFFFFF" />
          {mods.map(([x, y], i) => <rect key={i} x={x} y={y} width="1" height="1" fill="#1A120A" />)}
          {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
        </svg>
      </span>
      <span className="gb-qr-text">
        <span className="gb-qr-hook">{link.hook}</span>
        <span className="gb-qr-label">{link.label ?? "Scan or tap →"}</span>
      </span>
    </a>
  );
}

function CheckRow({ it, ctx }: { it: CheckItem; ctx: Ctx }) {
  const on = ctx.checked.has(it.id);
  const hasMeta = it.how || it.cost || it.tip;
  return (
    <button type="button" className="gb-check" data-on={on} onClick={() => ctx.toggle(it.id)}>
      <span className="gb-check-box">{on ? "✓" : ""}</span>
      <span className="gb-check-text">
        {it.time && <span className="gb-check-time">{it.time}</span>}
        <span className="gb-check-label">{it.label}</span>
        {it.sub && <span className="gb-check-sub">{it.sub}</span>}
        {hasMeta && (
          <span className="gb-check-meta">
            {it.how && <span className="gb-meta-how">↳ {it.how}</span>}
            {it.cost && <span className="gb-meta-cost">{it.cost}</span>}
            {it.tip && <span className="gb-meta-tip">✦ {it.tip}</span>}
          </span>
        )}
      </span>
    </button>
  );
}

function renderPage(p: GuidePage, ctx: Ctx) {
  switch (p.kind) {
    case "blank":
      return null;
    case "cover":
      if (p.artwork || p.frame || p.image || p.logo) return <CoverArt p={p} ctx={ctx} />;
      return (
        <div className="gb-cover">
          <div className="gb-cover-frame">
            <p className="gb-cover-kicker">SamsKruti · Sheher Ka Hriday</p>
            <h1 className="gb-cover-deva">{p.deva}</h1>
            <div className="gb-cover-rule" />
            <h2 className="gb-cover-title">{p.title}</h2>
            <p className="gb-cover-sub">{p.sub}</p>
            <p className="gb-cover-foot">{p.foot}</p>
          </div>
        </div>
      );
    case "epigraph":
      return (
        <div className="gb-center">
          <p className="gb-epigraph">{p.line}</p>
          <p className="gb-epigraph-sub">{p.sub}</p>
        </div>
      );
    case "artwork":
      return (
        <div className="gb-artwork">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.alt} />
        </div>
      );
    case "plate":
      return (
        <div className={`gb-plate${p.contain ? " gb-plate-contain" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.title} />
          {!p.contain && <div className="gb-plate-scrim" />}
          <div className="gb-plate-text">
            {p.devanagari && <p className="gb-plate-deva">{p.devanagari}</p>}
            <h3 className="gb-plate-title">{p.title}</h3>
            {p.caption && <p className="gb-plate-caption">{p.caption}</p>}
          </div>
        </div>
      );
    case "map":
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          <VaranasiMap />
          {p.note && <p className="gb-note">{p.note}</p>}
        </div>
      );
    case "text":
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          {p.devanagari && <p className="gb-deva-head">{p.devanagari}</p>}
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          {p.body.map((para, i) => <p key={i} className="gb-para">{para}</p>)}
          {p.hint && <p className="gb-hint">{p.hint}</p>}
        </div>
      );
    case "checklist": {
      const done = p.items.filter((it) => ctx.checked.has(it.id)).length;
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          {p.devanagari && <p className="gb-deva-head">{p.devanagari}</p>}
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          <div className="gb-checklist">
            {p.items.map((it) => <CheckRow key={it.id} it={it} ctx={ctx} />)}
          </div>
          <p className="gb-check-count">{done} / {p.items.length} done</p>
        </div>
      );
    }
    case "collage":
      return (
        <div className="gb-body">
          {p.eyebrow && <p className="gb-eyebrow">{p.eyebrow}</p>}
          {p.devanagari && <p className="gb-deva-head">{p.devanagari}</p>}
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          {p.lead && <p className="gb-lead">{p.lead}</p>}
          <div className="gb-album">
            {p.tiles.map((t) => (
              <figure className="gb-atile" key={t.n}>
                <span className="gb-atile-num">{t.n}</span>
                <div className={`gb-atile-photo${p.paste ? " gb-atile-paste" : ""}`}>
                  {!p.paste && t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt={t.name} />
                  ) : (
                    <span className="gb-atile-hint">{p.paste ? "paste" : "photo"}</span>
                  )}
                </div>
                <figcaption>{t.name}</figcaption>
                {t.role && <p className="gb-atile-role">{t.role}</p>}
                {t.sub && <p className="gb-atile-sub">{t.sub}</p>}
              </figure>
            ))}
          </div>
          {p.link && <QrTag link={p.link} boxed />}
        </div>
      );
    case "plan":
      return (
        <div className="gb-body">
          {p.eyebrow && <p className="gb-eyebrow">{p.eyebrow}</p>}
          {p.devanagari && <p className="gb-deva-head">{p.devanagari}</p>}
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          {p.lead && <p className="gb-lead">{p.lead}</p>}
          {p.mapTiles && p.mapTiles.length > 0 && (
            <div className="gb-plan-map"><RouteMap tiles={p.mapTiles} /></div>
          )}
          {p.snapshot && p.snapshot.length > 0 && (
            <div className="gb-snap">
              {p.snapshot.map((s) => (
                <span className="gb-snap-cell" key={s.label}>
                  <span className="gb-snap-value">{s.value}</span>
                  <span className="gb-snap-label">{s.label}</span>
                </span>
              ))}
            </div>
          )}
          <div className="gb-plan-list">
            {p.steps.map((it) => {
              const on = ctx.checked.has(it.id);
              return (
                <button key={it.id} type="button" className="gb-plan-row" data-on={on} onClick={() => ctx.toggle(it.id)}>
                  <span className="gb-plan-time">{it.time}</span>
                  <span className="gb-plan-box">{on ? "✓" : ""}</span>
                  <span className="gb-plan-label">{it.label}</span>
                </button>
              );
            })}
          </div>
          {p.pasteCaptions && p.pasteCaptions.length > 0 && (
            <div className="gb-plan-paste">
              {p.pasteCaptions.map((c, i) => (
                <figure className="gb-polaroid gb-polaroid-sm" key={i}>
                  <span className="gb-tape" />
                  <div className="gb-photo"><span className="gb-photo-hint">paste</span></div>
                  <figcaption>{c}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      );
    case "arrival": {
      const active = p.variants.find((v) => v.key === ctx.arrival) ?? p.variants[0];
      const done = active.items.filter((it) => ctx.checked.has(it.id)).length;
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          {p.devanagari && <p className="gb-deva-head">{p.devanagari}</p>}
          <h3 className="gb-title">{p.title}</h3>
          <p className="gb-arrival-tag">{active.label} arrival</p>
          <div className="gb-rule" />
          <p className="gb-arrival-lead">{active.lead}</p>
          <div className="gb-checklist">
            {active.items.map((it) => <CheckRow key={it.id} it={it} ctx={ctx} />)}
          </div>
          <p className="gb-check-count">{done} / {active.items.length} done</p>
        </div>
      );
    }
    case "gallery":
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          <div className="gb-photos">{p.photos.map((ph, i) => <Polaroid key={i} photo={ph} />)}</div>
          {p.note && <p className="gb-note">{p.note}</p>}
        </div>
      );
    case "craft":
      return (
        <div className="gb-body gb-craft">
          <p className="gb-deva-head gb-deva-big">{p.devanagari}</p>
          <h3 className="gb-title">{p.name}</h3>
          <p className="gb-maker">{p.maker}</p>
          {p.image && (
            <div className="gb-craft-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} />
            </div>
          )}
          <p className="gb-para gb-para-just">{p.story}</p>
          <p className="gb-addition">“{p.addition}”</p>
          {p.checkId && (
            <button type="button" className="gb-check gb-check-inline" data-on={ctx.checked.has(p.checkId)} onClick={() => ctx.toggle(p.checkId!)}>
              <span className="gb-check-box">{ctx.checked.has(p.checkId) ? "✓" : ""}</span>
              <span className="gb-check-text"><span className="gb-check-label">I met the maker</span></span>
            </button>
          )}
          {p.link && <QrTag link={p.link} />}
        </div>
      );
    case "scrapbook":
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          <div className="gb-photos">{p.slots.map((ph, i) => <Polaroid key={i} photo={ph} />)}</div>
          <p className="gb-note">{p.prompt}</p>
        </div>
      );
    case "contact":
      return (
        <div className="gb-body">
          <p className="gb-eyebrow">{p.eyebrow}</p>
          <h3 className="gb-title">{p.title}</h3>
          <div className="gb-rule" />
          {p.body.map((para, i) => <p key={i} className="gb-para">{para}</p>)}
          {p.link && <QrTag link={p.link} lost />}
          <div className="gb-phone">
            <p className="gb-phone-label">Your guide, one call away</p>
            <p className="gb-phone-num">+91&nbsp;&thinsp;·&thinsp;·&thinsp;·&thinsp;·&thinsp;·</p>
            <p className="gb-phone-note">(the number is set for your journey)</p>
          </div>
        </div>
      );
    case "colophon":
      return (
        <div className="gb-center">
          <p className="gb-colo-line">Every page has a soul.</p>
          <div className="gb-cover-rule" />
          <p className="gb-colo-brand">SamsKruti</p>
          <p className="gb-colo-sub">Sheher Ka Hriday · Varanasi</p>
          <p className="gb-colo-foot">Made in Kashi, for you. · पहला संस्करण</p>
        </div>
      );
  }
}

// An illustrated, hand-drawn-feeling map of the three-day journey — the Ganga,
// the ghats on the west bank, the makers' lanes inland, and Sarnath to the north.
const MAP_STOPS: { x: number; y: number; lx: number; ly: number; a: "start" | "middle" | "end"; t: string }[] = [
  { x: 285, y: 500, lx: 285, ly: 486, a: "middle", t: "Assi Ghat" },
  { x: 292, y: 330, lx: 279, ly: 333, a: "end", t: "Dashashwamedh" },
  { x: 300, y: 195, lx: 300, ly: 181, a: "middle", t: "Manikarnika" },
  { x: 232, y: 300, lx: 221, ly: 303, a: "end", t: "Kashi Vishwanath" },
  { x: 150, y: 262, lx: 161, ly: 263, a: "start", t: "Madanpura" },
  { x: 176, y: 353, lx: 187, ly: 354, a: "start", t: "Thatheri Bazar" },
  { x: 140, y: 430, lx: 151, ly: 431, a: "start", t: "Khojwan" },
  { x: 332, y: 66, lx: 344, ly: 69, a: "start", t: "Sarnath" },
];
const MAP_DAYS: { x: number; y: number; n: string }[] = [
  { x: 336, y: 430, n: "1" },
  { x: 108, y: 338, n: "2" },
  { x: 362, y: 112, n: "3" },
];

function VaranasiMap() {
  return (
    <div className="gb-map">
      <svg viewBox="0 0 440 600" role="img" aria-label="Illustrated map of the three-day Varanasi journey">
        {/* the river */}
        <path d="M300,0 C258,90 332,170 292,255 C252,340 322,420 284,500 C258,552 300,580 302,600 L440,600 L440,0 Z" fill="#B7CBC5" opacity="0.85" />
        <path d="M300,0 C258,90 332,170 292,255 C252,340 322,420 284,500 C258,552 300,580 302,600" fill="none" stroke="#8FA9A2" strokeWidth="1.5" opacity="0.7" />
        <path d="M338,120 q30,9 60,0" fill="none" stroke="#9FB8B1" strokeWidth="1" opacity="0.5" />
        <path d="M348,300 q30,9 60,0" fill="none" stroke="#9FB8B1" strokeWidth="1" opacity="0.5" />
        <path d="M344,470 q30,9 60,0" fill="none" stroke="#9FB8B1" strokeWidth="1" opacity="0.5" />
        <text className="gb-map-deva" x="380" y="230" transform="rotate(90 380 230)" textAnchor="middle" fill="#5E7A72">गंगा · The Ganga</text>

        {/* road to Sarnath */}
        <path d="M300,190 C322,140 330,108 332,74" fill="none" stroke="#C9A24A" strokeWidth="1.5" strokeDasharray="3 5" />

        {/* stops */}
        {MAP_STOPS.map((s) => (
          <g key={s.t}>
            <circle cx={s.x} cy={s.y} r="4.5" fill="#C8652A" stroke="#FBF3E2" strokeWidth="1.5" />
            <text className="gb-map-label" x={s.lx} y={s.ly} textAnchor={s.a}>{s.t}</text>
          </g>
        ))}

        {/* day markers */}
        {MAP_DAYS.map((d) => (
          <g key={d.n}>
            <circle cx={d.x} cy={d.y} r="12" fill="#C8652A" />
            <text x={d.x} y={d.y + 4} textAnchor="middle" className="gb-map-day">{d.n}</text>
          </g>
        ))}

        {/* compass */}
        <g transform="translate(42,54)">
          <line x1="0" y1="9" x2="0" y2="-9" stroke="#8A6F42" strokeWidth="1.2" />
          <path d="M0,-12 L3,-5 L-3,-5 Z" fill="#8A6F42" />
          <text className="gb-map-label" x="0" y="-15" textAnchor="middle">N</text>
        </g>
      </svg>
    </div>
  );
}

// ── The cover, composed square ────────────────────────────────────────────
// Built (not a pasted mockup): the photograph fills the lower half and fades
// into cream; the medallion, title and taglines sit above; the feature strip
// floats over the photo. Sizes use container units so it scales with the page.
function FeatIcon({ i }: { i: number }) {
  const s = { fill: "none", stroke: "#C8652A", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (i) {
    case 0: return <svg viewBox="0 0 24 24" {...s}><path d="M12 2.5l3.2 4H8.8l3.2-4z" /><path d="M5.5 7.5h13M7 7.5v12M17 7.5v12M4 19.5h16" /><path d="M10 19.5v-4.6a2 2 0 014 0v4.6" /></svg>;
    case 1: return <svg viewBox="0 0 24 24" {...s}><path d="M12 21s6-6.3 6-10.6A6 6 0 006 10.4C6 14.7 12 21 12 21z" /><circle cx="12" cy="10.4" r="2.2" /></svg>;
    case 2: return <svg viewBox="0 0 24 24" {...s}><path d="M12 19.5c-2.1-1.6-3.2-3.8-3.2-6.1 0-2.5 1.2-4.7 3.2-6 2 1.3 3.2 3.5 3.2 6 0 2.3-1.1 4.5-3.2 6.1z" /><path d="M12 19.5c-4 0-7.2-2.3-7.2-4.8 2-.7 3.8-.2 5.2.9" /><path d="M12 19.5c4 0 7.2-2.3 7.2-4.8-2-.7-3.8-.2-5.2.9" /></svg>;
    case 3: return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /></svg>;
    default: return <svg viewBox="0 0 24 24" {...s}><rect x="3.5" y="3.5" width="6.5" height="6.5" /><rect x="14" y="3.5" width="6.5" height="6.5" /><rect x="3.5" y="14" width="6.5" height="6.5" /><path d="M14 14h3v3h-3zM19.5 14v2M14 19.5h2M19 19.5h1.5" /></svg>;
  }
}

function Lotus({ cls }: { cls?: string }) {
  return (
    <svg className={cls ?? "cv-lotus"} viewBox="0 0 26 14" aria-hidden="true">
      <path d="M13 1.5c1.7 2.2 1.7 6.3 0 8.5-1.7-2.2-1.7-6.3 0-8.5z" fill="#C8652A" />
      <path d="M13 10c-3 0-5.6-1.5-5.6-3.3 1.6-.6 3.2-.2 4.6.9" fill="none" stroke="#C8652A" strokeWidth="1" strokeLinecap="round" />
      <path d="M13 10c3 0 5.6-1.5 5.6-3.3-1.6-.6-3.2-.2-4.6.9" fill="none" stroke="#C8652A" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function Birds() {
  const b: [number, number, number][] = [[14, 20, 1], [24, 12, 0.85], [33, 24, 0.7], [8, 32, 0.65], [42, 16, 0.6], [29, 36, 0.5]];
  return (
    <svg className="cv-birds" viewBox="0 0 100 60" aria-hidden="true">
      {b.map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y} q${1.8 * s} ${-1.7 * s} ${3.6 * s} 0 q${1.8 * s} ${-1.7 * s} ${3.6 * s} 0`}
          fill="none" stroke="#5A4433" strokeWidth={0.7 * s} strokeLinecap="round" opacity={0.45} />
      ))}
    </svg>
  );
}

function CoverArt({ p, ctx }: { p: Extract<GuidePage, { kind: "cover" }>; ctx: Ctx }) {
  // Finished square cover artwork — render it edge to edge, as-is.
  if (p.artwork) {
    return (
      <div className="cv-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.artwork} alt={p.title} />
      </div>
    );
  }
  // Composed on the ornamental frame, over a photograph that washes into the
  // parchment. Same mandala corners as every page, so the book matches itself.
  if (p.frame) {
    return (
      <div className="cv2">
        {p.image && (
          <div className="cv2-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" />
          </div>
        )}
        <div className="cv2-frame" style={{ backgroundImage: `url(${p.frame})` }} />
        {p.seal && (
          <div className="cv2-seal">
            <Lotus />
            <span>{p.seal}</span>
          </div>
        )}
        <div className="cv2-body">
          {p.logotype && <p className="cv2-logotype">{p.logotype}</p>}
          {p.logoSub && <p className="cv2-logosub">{p.logoSub}</p>}
          <div className="cv2-orn"><span /><Lotus /><span /></div>
          <h1 className="cv2-title">{p.title}</h1>
          <p className="cv2-sub">{p.sub}</p>
          {ctx.choices && (
            <div className="cv2-meta">
              <span className="cv2-cell"><em>Duration</em><b>{ctx.choices.journey}</b></span>
              <span className="cv2-cell"><em>Arrival</em><b>{ctx.choices.arrival}</b></span>
              <span className="cv2-cell"><em>Language</em><b>{ctx.choices.language}</b></span>
            </div>
          )}
          {p.tagline && <p className="cv2-tag">{p.tagline}</p>}
        </div>
        {p.features && p.features.length > 0 && (
          <div className="cv2-strip">
            {p.features.map((f, i) => (
              <span className="cv2-feat" key={f}><FeatIcon i={i} /><span>{f}</span></span>
            ))}
          </div>
        )}
        <p className="cv2-foot">{p.foot}</p>
      </div>
    );
  }
  return (
    <div className="cv">
      {/* the spine */}
      <div className="cv-spine">
        <span className="cv-spine-title">{p.title}</span>
        <span className="cv-spine-sub">A SamsKruti Travel Book</span>
        <Lotus cls="cv-lotus cv-spine-lotus" />
      </div>
      {/* the ornamental gold band */}
      <div className="cv-band" />
      {/* the cover face */}
      <div className="cv-face">
        {p.image && (
          <div className="cv-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" />
          </div>
        )}
        <Birds />
        <div className="cv-top">
          {p.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cv-logo" src={p.logo} alt="SamsKruti — Timeless Journeys. Real India." />
          )}
          <h1 className="cv-title">{p.title}</h1>
          {p.tagline && <p className="cv-tag">{p.tagline}</p>}
          <div className="cv-orn"><span /><Lotus /><span /></div>
          <p className="cv-sub">{p.sub}</p>
        </div>
        {p.features && p.features.length > 0 && (
          <div className="cv-strip">
            {p.features.map((f, i) => (
              <div className="cv-feat" key={f}>
                <FeatIcon i={i} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
        {p.foot && (
          <div className="cv-footwrap">
            <p className="cv-foot">{p.foot}</p>
            <div className="cv-foot-orn"><span /><Lotus /><span /></div>
          </div>
        )}
      </div>
    </div>
  );
}

// A small numbered route map for a collage page (the morning's clustered stops).
function RouteMap({ tiles }: { tiles: { n: number; name: string }[] }) {
  const pts: [number, number][] = [[38, 118], [98, 52], [166, 98], [226, 46], [286, 106], [316, 58]];
  const used = tiles.slice(0, pts.length);
  return (
    <svg viewBox="0 0 344 158" role="img" aria-label="Route of the morning stops">
      <polyline points={used.map((_, i) => pts[i].join(",")).join(" ")} fill="none" stroke="#C9A24A" strokeWidth="1.5" strokeDasharray="3 4" />
      {used.map((t, i) => (
        <g key={t.n}>
          <circle cx={pts[i][0]} cy={pts[i][1]} r="12" fill="#C8652A" />
          <text x={pts[i][0]} y={pts[i][1] + 4} textAnchor="middle" className="gb-map-day">{t.n}</text>
        </g>
      ))}
    </svg>
  );
}

function Polaroid({ photo }: { photo: Photo }) {
  return (
    <figure className="gb-polaroid" style={{ transform: `rotate(${photo.rot}deg)` }}>
      <span className="gb-tape" />
      <div className="gb-photo">
        {photo.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.caption} />
        ) : (
          <span className="gb-photo-hint">paste here</span>
        )}
      </div>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

const GB_CSS = `
.gb-root {
  --paper: #F6EEDB;
  --ink: #2A2016;
  --ink-soft: #5F4E37;
  --gold: #A87C2E;
  --gold-line: #C9A24A;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 90% 60% at 50% 0%, #FBF5E8 0%, transparent 55%),
    linear-gradient(180deg, #EFE6D2 0%, #E4D9BF 100%);
  display: flex; flex-direction: column; align-items: center;
  font-family: var(--font-cormorant), Georgia, serif; color: var(--ink);
  padding: 10px 14px 16px; box-sizing: border-box;
}
.gb-top { width: 100%; max-width: 940px; display: flex; align-items: center; gap: 16px; margin: 4px 0 10px; }
.gb-top-title { color: #A8792E; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; }
.gb-progress { color: #8A754A; font-size: 12px; letter-spacing: 2px; }
.gb-close { margin-left: auto; color: #6A5A3E; text-decoration: none; font-size: 13px; letter-spacing: 1.5px; border: 1px solid #CDBC9C; border-radius: 999px; padding: 5px 14px; }
.gb-close:hover { color: #8A6520; border-color: #A8792E; }

/* Closed book (front cover / closed at the end). The arrows open & close it. */
.gb-closed { display: flex; align-items: center; justify-content: center; }
/* Closed cover = exactly ONE open page (open spread = 2 pages = min(96vw,150vh,1320px)). */
.gb-book-closed { width: min(48.5vw, 82vh, 780px); border-radius: 4px 10px 10px 4px; box-shadow: 3px 0 0 #241708, 6px 0 0 #1E1308, 9px 0 0 #180F06, 12px 2px 0 #140D05, 0 30px 64px rgba(70,48,18,0.42); }
@media (max-width: 759px) { .gb-book-closed { width: min(94vw, 460px); } }
.gb-openwrap { display: flex; align-items: center; justify-content: center; }
.gb-anim-open { animation: gbAnimOpen .62s cubic-bezier(.38,.05,.25,1) both; transform-origin: left center; }
.gb-anim-close { animation: gbAnimClose .55s cubic-bezier(.38,.05,.25,1) both; transform-origin: left center; }
@keyframes gbAnimOpen { from { transform: perspective(1900px) rotateY(-62deg) scale(0.96); opacity: 0.35; } to { transform: none; opacity: 1; } }
@keyframes gbAnimClose { from { transform: perspective(1900px) rotateY(-52deg) scale(0.96); opacity: 0.35; } to { transform: none; opacity: 1; } }

.gb-stage { position: relative; width: 100%; display: flex; justify-content: center; flex: 1; }
.gb-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 9; width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.72); border: 1px solid #CDBC9C; color: #8A6520; font-size: 22px; line-height: 1; cursor: pointer; }
.gb-arrow-l { left: 4px; }
.gb-arrow-r { right: 4px; }
.gb-arrow:hover:not(:disabled) { background: rgba(201,162,74,0.18); color: #6A4E28; }
.gb-arrow:disabled { opacity: 0.25; cursor: default; }

/* Square 8.5x8.5in book: each page is 1:1, so the open spread is 2:1. Capped
   by vh so the square is never taller than the viewport. */
.gb-book2 { position: relative; display: flex; width: min(97vw, 164vh, 1560px); perspective: 2800px; box-shadow: 0 26px 64px rgba(70,48,18,0.32); border-radius: 8px; }
.gb-paper {
  background:
    radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0.45), transparent 42%),
    radial-gradient(140% 120% at 100% 100%, rgba(150,120,70,0.10), transparent 46%),
    var(--paper);
  padding: clamp(24px, 2.6vw, 48px) clamp(26px, 2.8vw, 52px);
  box-sizing: border-box; display: flex; flex-direction: column; position: relative; overflow: hidden;
  aspect-ratio: 1 / 1;
}
.gb-paper.gb-dark {
  background:
    radial-gradient(120% 90% at 50% 12%, #2A1B0C, transparent 62%),
    linear-gradient(160deg, #1E1308 0%, #140D05 100%);
}
.gb-half { flex: 1 1 0; min-width: 0; }
.gb-half-l .gb-paper { border-radius: 7px 0 0 7px; box-shadow: inset -20px 0 30px -20px rgba(60,40,14,0.5); }
.gb-half-r .gb-paper { border-radius: 0 7px 7px 0; box-shadow: inset 20px 0 30px -20px rgba(60,40,14,0.5); }
.gb-blank { background: #EFE6D0; }

/* Full-bleed photo plate */
.gb-paper-plate { padding: 0; }
.gb-artwork { position: absolute; inset: 0; }
.gb-artwork img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gb-plate { position: absolute; inset: 0; }
.gb-plate img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gb-plate-scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(18,9,2,0.92) 0%, rgba(18,9,2,0.35) 40%, rgba(18,9,2,0) 68%); }
.gb-plate-text { position: absolute; left: 0; right: 0; bottom: 0; padding: clamp(26px, 3.2vw, 52px); }
.gb-plate-deva { font-family: var(--font-noto-devanagari), serif; color: #F0C877; font-size: clamp(20px, 3vw, 31px); margin: 0 0 6px; }
.gb-plate-title { color: #FCF3E2; font-size: clamp(27px, 3.4vw, 46px); font-weight: 500; font-style: italic; margin: 0; line-height: 1.1; text-shadow: 0 2px 18px rgba(0,0,0,0.55); }
.gb-plate-caption { color: #E8D7B6; font-size: clamp(14px, 1.6vw, 17px); font-style: italic; margin: 9px 0 0; }
.gb-plate-contain { background: radial-gradient(120% 100% at 50% 32%, #FBF4E2, #ECE1C8); }
.gb-plate-contain img { object-fit: contain; padding: 8% 8% 24%; }
.gb-plate-contain .gb-plate-deva { color: #8A6320; }
.gb-plate-contain .gb-plate-title { color: var(--ink); text-shadow: none; }
.gb-plate-contain .gb-plate-caption { color: var(--ink-soft); }

/* Illustrated map */
.gb-map { width: 100%; flex: 1; display: flex; align-items: center; justify-content: center; padding: 6px 0; }
.gb-map svg { width: 100%; height: auto; max-height: 100%; }
.gb-map-label { fill: #4A3A22; font-family: var(--font-cormorant), Georgia, serif; font-size: 11px; }
.gb-map-deva { fill: #5E7A72; font-family: var(--font-noto-devanagari), serif; font-size: 12px; }
.gb-map-day { fill: #FBF6EC; font-family: var(--font-cormorant), Georgia, serif; font-size: 13px; font-weight: 600; }

/* ── The composed cover ───────────────────────────────────────────────────
   Layers, bottom up: parchment, the photograph washing in from the foot, the
   ornamental frame multiplied over it (so its parchment goes transparent and
   only the gold ink lands), then the type. */
.cv2 {
  position: absolute; inset: 0; overflow: hidden; background: var(--paper);
  display: flex; flex-direction: column; align-items: center;
  padding: 8.5% 9% 6%; box-sizing: border-box; text-align: center;
}
.cv2-photo { position: absolute; left: 0; right: 0; bottom: 0; height: 68%; }
.cv2-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center bottom; display: block; }
/* fades the photograph up into the paper instead of ending on a hard edge */
.cv2-photo::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(249,237,212,0.30) 0%, rgba(249,237,212,0.72) 38%, rgba(249,237,212,0.95) 72%, #F9EDD4 100%);
}
.cv2-frame { position: absolute; inset: 0; background-size: 100% 100%; background-repeat: no-repeat; mix-blend-mode: multiply; }
.cv2-seal {
  position: absolute; top: 7%; right: 7.5%; width: 15%; aspect-ratio: 1 / 1;
  border: 1px solid var(--gold-line); border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3%;
  color: var(--gold); text-align: center; padding: 3%; box-sizing: border-box;
}
.cv2-seal span { font-size: clamp(4px, 0.52vw, 7.5px); letter-spacing: 0.8px; text-transform: uppercase; line-height: 1.35; }
.cv2-seal svg { width: 26%; height: auto; }
.cv2-body { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; width: 100%; }
.cv2-logotype { color: var(--ink); font-size: clamp(17px, 2.3vw, 37px); font-weight: 500; margin: 0; line-height: 1; }
.cv2-logosub { color: var(--ink-soft); font-size: clamp(5.5px, 0.72vw, 11px); letter-spacing: 3px; text-transform: uppercase; margin: 3% 0 0; }
.cv2-orn { display: flex; align-items: center; gap: 8px; margin: 5% 0; width: 46%; color: var(--gold); }
.cv2-orn span { flex: 1; height: 1px; background: var(--gold-line); opacity: 0.6; }
.cv2-orn svg { width: clamp(9px, 1.1vw, 17px); height: auto; flex: none; }
.cv2-title {
  color: #7A2018; font-size: clamp(30px, 4.4vw, 70px); font-weight: 500; line-height: 1;
  letter-spacing: clamp(2px, 0.5vw, 8px); margin: 0; text-indent: clamp(2px, 0.5vw, 8px);
}
.cv2-sub { color: var(--ink); font-size: clamp(10px, 1.35vw, 22px); font-style: italic; line-height: 1.35; margin: 5% 0 0; }
.cv2-meta {
  display: flex; margin: 7% 0 0; width: 84%;
  border: 1px solid rgba(168,124,46,0.5); border-radius: 3px; padding: 3% 0;
  background: rgba(251,243,229,0.5);
}
.cv2-cell { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 0 4%; }
.cv2-cell + .cv2-cell { border-left: 1px solid rgba(168,124,46,0.35); }
.cv2-cell em { color: var(--gold); font-size: clamp(4.5px, 0.58vw, 9px); letter-spacing: 1.4px; text-transform: uppercase; font-style: normal; }
.cv2-cell b { color: var(--ink); font-size: clamp(9px, 1.15vw, 18px); font-weight: 500; line-height: 1.15; }
.cv2-tag { color: var(--ink-soft); font-size: clamp(7px, 0.9vw, 14px); font-style: italic; line-height: 1.4; margin: 5% 0 0; }
.cv2-strip { position: relative; z-index: 2; margin-top: auto; display: flex; justify-content: center; gap: clamp(8px, 1.6vw, 26px); width: 100%; }
.cv2-feat { display: flex; flex-direction: column; align-items: center; gap: 5px; color: var(--gold); flex: 1; }
.cv2-feat svg { width: clamp(11px, 1.4vw, 22px); height: auto; }
.cv2-feat span { color: var(--ink-soft); font-size: clamp(4.5px, 0.58vw, 9px); letter-spacing: 1.1px; text-transform: uppercase; line-height: 1.3; }
.cv2-foot { position: relative; z-index: 2; color: var(--ink-soft); opacity: 0.85; font-size: clamp(4.5px, 0.56vw, 8.5px); letter-spacing: 1.2px; text-transform: uppercase; line-height: 1.5; margin: 4% 0 0; max-width: 78%; }

/* The printed page frame: parchment, rule border, mandala corners, the ghats
   and the floral band with its empty number cartouche. One 1254x1254 square
   stretched over the page, so every proportion below is a % of that artwork. */
.gb-framed {
  background: url("/data/images/varanasi/page-frame.png") center / 100% 100% no-repeat, var(--paper);
  /* keep content inside the rule, clear of the mandala corners, and above the
     ghat illustration (which starts at 83%) and the band beneath it */
  padding: 6.5% 7% 19%;
}
/* The frame's mandalas own the top corners, so a framed page centres its
   header down the middle, where the artwork leaves a clear channel. */
.gb-framed .gb-eyebrow, .gb-framed .gb-deva-head, .gb-framed .gb-title, .gb-framed .gb-lead { text-align: center; }
.gb-framed .gb-rule { margin-left: auto; margin-right: auto; }
.gb-framed .gb-eyebrow { color: #8C3F2A; letter-spacing: 3.4px; }
.gb-framed .gb-title { font-size: clamp(19px, 2.4vw, 31px); }
.gb-framed .gb-rule { margin-top: 9px; margin-bottom: 11px; }
/* The frame leaves ~74% of the page for content — not enough for a grid of
   square photos at this width. So the album takes whatever height is left over
   and the photos shrink into it, instead of a fixed ratio overflowing. */
.gb-framed .gb-album {
  flex: 1; min-height: 0;
  grid-auto-rows: 1fr;
  gap: clamp(8px, 1vw, 13px) clamp(6px, 0.7vw, 9px);
  align-content: stretch;
}
.gb-framed .gb-atile { display: flex; flex-direction: column; min-height: 0; }
.gb-framed .gb-atile-photo { aspect-ratio: auto; flex: 1; min-height: 0; }
.gb-framed .gb-qr { margin-top: 11px; padding-top: 10px; }

.gb-lead { color: var(--ink-soft); font-size: clamp(10px, 1.05vw, 13.5px); font-style: italic; line-height: 1.45; margin: 0 0 10px; }
.gb-atile-role { text-align: center; margin: 2px 0 0; color: var(--gold); font-size: clamp(6.5px, 0.62vw, 8.5px); letter-spacing: 1px; text-transform: uppercase; line-height: 1.2; }

.gb-snap { display: flex; justify-content: center; gap: clamp(10px, 1.4vw, 22px); margin: 0 0 10px; padding: 7px 0; border-top: 1px solid rgba(168,124,46,0.22); border-bottom: 1px solid rgba(168,124,46,0.22); }
.gb-snap-cell { display: flex; flex-direction: column; align-items: center; }
.gb-snap-value { color: var(--ink); font-size: clamp(11px, 1.15vw, 15px); font-weight: 500; line-height: 1.1; }
.gb-snap-label { color: var(--gold); font-size: clamp(6.5px, 0.6vw, 8.5px); letter-spacing: 1.1px; text-transform: uppercase; margin-top: 2px; }

/* sits in the cartouche the frame leaves empty — centre (626, 1196) of 1254 */
.gb-folio-n {
  position: absolute; left: 49.9%; top: 95.37%; transform: translate(-50%, -50%);
  color: var(--ink); opacity: 0.82;
  font-size: clamp(10px, 1.15vw, 18.5px); line-height: 1; letter-spacing: 0.5px;
  pointer-events: none;
}

.gb-flip { position: absolute; top: 0; bottom: 0; width: 50%; transform-style: preserve-3d; z-index: 6; pointer-events: none; }
.gb-flip-next { left: 50%; transform-origin: left center; animation: gbFlipNext .85s cubic-bezier(.36,.02,.22,1) both; }
.gb-flip-prev { left: 0; transform-origin: right center; animation: gbFlipPrev .85s cubic-bezier(.36,.02,.22,1) both; }
.gb-flip-face { position: absolute; inset: 0; backface-visibility: hidden; overflow: hidden; }
.gb-flip-front { transform: rotateY(0deg); }
.gb-flip-back { transform: rotateY(180deg); }
.gb-flip-face .gb-paper { box-shadow: 0 16px 44px rgba(40,25,8,0.32); }
/* the moving light/shadow that makes it read as paper turning */
.gb-flip-shade { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
.gb-flip-next .gb-flip-front .gb-flip-shade { background: linear-gradient(to left, rgba(24,14,4,0.58), rgba(24,14,4,0) 58%); animation: gbShadeAway .85s ease-in both; }
.gb-flip-next .gb-flip-back  .gb-flip-shade { background: linear-gradient(to right, rgba(24,14,4,0.58), rgba(24,14,4,0) 58%); animation: gbShadeIn .85s ease-out both; }
.gb-flip-prev .gb-flip-front .gb-flip-shade { background: linear-gradient(to right, rgba(24,14,4,0.58), rgba(24,14,4,0) 58%); animation: gbShadeAway .85s ease-in both; }
.gb-flip-prev .gb-flip-back  .gb-flip-shade { background: linear-gradient(to left, rgba(24,14,4,0.58), rgba(24,14,4,0) 58%); animation: gbShadeIn .85s ease-out both; }
@keyframes gbFlipNext { from { transform: rotateY(0); } to { transform: rotateY(-180deg); } }
@keyframes gbFlipPrev { from { transform: rotateY(0); } to { transform: rotateY(180deg); } }
@keyframes gbShadeAway { from { opacity: 0; } to { opacity: 1; } }
@keyframes gbShadeIn { from { opacity: 1; } to { opacity: 0; } }

.gb-book2-narrow { flex-direction: column; width: min(94vw, 460px); perspective: none; animation: gbFade .4s ease both; }
.gb-book2-narrow .gb-paper { min-height: auto; }
.gb-book2-narrow .gb-half-l .gb-paper { border-radius: 7px 7px 0 0; box-shadow: none; }
.gb-book2-narrow .gb-half-r .gb-paper { border-radius: 0 0 7px 7px; box-shadow: none; border-top: 1px solid #E4D8BC; }
@keyframes gbFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* ── The cover, built square — on the official SamsKruti system ───────────
   Tokens + type per uploads/samskruti-design-system.html:
   display = Cormorant Garamond (logotype face, 500) · devanagari = Noto Serif
   Devanagari · palette = earth/parchment with terracotta as the one accent. */
/* Finished square cover artwork — the page IS the artwork, edge to edge */
.cv-art { position: absolute; inset: 0; background: #1F0F06; }
.cv-art img { width: 100%; height: 100%; object-fit: cover; display: block; }

.cv {
  --deep-earth: #1F0F06; --dark-soil: #2C1F12; --walnut: #4A3728; --dust: #8C7A66;
  --linen: #E8DDD1; --parchment: #F5E8DC; --ivory: #FAF7F3; --terracotta: #C8652A; --ochre: #E8A870;
  position: absolute; inset: 0; overflow: hidden; container-type: size; display: flex; background: var(--parchment);
}

/* the spine */
.cv-spine { width: 8%; flex-shrink: 0; position: relative;
  background: linear-gradient(90deg, var(--deep-earth) 0%, var(--dark-soil) 45%, var(--deep-earth) 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5cqw; padding: 5cqw 0; }
.cv-spine::after { content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 2px; background: rgba(0,0,0,0.3); }
.cv-spine-title { writing-mode: vertical-rl; transform: rotate(180deg); color: var(--ivory); font-family: var(--font-cormorant), Georgia, serif; font-weight: 500; font-size: 3.2cqw; letter-spacing: 0.45em; }
.cv-spine-sub { writing-mode: vertical-rl; transform: rotate(180deg); color: var(--dust); font-family: var(--font-cormorant), Georgia, serif; font-size: 1.1cqw; letter-spacing: 0.3em; text-transform: uppercase; }
.cv-spine-lotus { width: 2.6cqw; opacity: 0.9; }

/* the ornamental band — terracotta lotus vine on parchment */
.cv-band { width: 4.6%; flex-shrink: 0; background-color: var(--parchment); border-right: 1px solid var(--linen);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='58' viewBox='0 0 28 58'%3E%3Cg fill='none' stroke='%23C8652A' stroke-width='0.9' stroke-linecap='round' opacity='0.55'%3E%3Cpath d='M14 5c3.2 3 3.2 7.6 0 10.6-3.2-3-3.2-7.6 0-10.6z'/%3E%3Cpath d='M8.4 10.6c2.2-1.1 4.2-1.1 5.6 0M19.6 10.6c-2.2-1.1-4.2-1.1-5.6 0'/%3E%3Cpath d='M14 21v5'/%3E%3Cpath d='M14 33c3.2 3 3.2 7.6 0 10.6-3.2-3-3.2-7.6 0-10.6z'/%3E%3Cpath d='M14 49v5'/%3E%3C/g%3E%3Ccircle cx='14' cy='29' r='1.5' fill='%23C8652A' opacity='0.75'/%3E%3C/svg%3E");
  background-repeat: repeat-y; background-position: center top; background-size: 100% auto; }

/* the face */
.cv-face { flex: 1; position: relative; overflow: hidden; background: linear-gradient(180deg, var(--ivory) 0%, var(--parchment) 42%); }
.cv-photo { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; }
.cv-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cv-photo::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(to bottom, #FAF7F3 0%, rgba(250,247,243,0.9) 10%, rgba(245,232,220,0.3) 28%, rgba(245,232,220,0) 48%); }
.cv-birds { position: absolute; left: 4%; top: 44%; width: 34%; height: auto; z-index: 2; pointer-events: none; }

.cv-top { position: relative; z-index: 3; width: 100%; box-sizing: border-box; text-align: center; padding: 5cqw 7cqw 0; }
.cv-logo { width: 21cqw; height: auto; display: block; margin: 0 auto 2.4cqw; mix-blend-mode: multiply; }
.cv-title { font-family: var(--font-cormorant), Georgia, serif; color: var(--terracotta); font-size: 13cqw; letter-spacing: 0.08em; font-weight: 500; line-height: 1; margin: 0; }
.cv-tag { color: var(--dust); font-family: var(--font-cormorant), Georgia, serif; font-size: 2.7cqw; letter-spacing: 0.24em; text-transform: uppercase; margin: 2.2cqw 0 0; }
.cv-orn { display: flex; align-items: center; justify-content: center; gap: 1.6cqw; margin: 2.4cqw 0; }
.cv-orn span { height: 1px; width: 15cqw; background: linear-gradient(90deg, transparent, var(--terracotta)); opacity: 0.6; }
.cv-orn span:last-child { background: linear-gradient(90deg, var(--terracotta), transparent); }
.cv-lotus { width: 3cqw; height: auto; flex-shrink: 0; }
.cv-sub { color: var(--walnut); font-family: var(--font-cormorant), Georgia, serif; font-size: 3cqw; line-height: 1.55; margin: 0; white-space: pre-line; }

.cv-strip { position: absolute; left: 5%; right: 5%; bottom: 11%; z-index: 3; display: flex;
  background: rgba(250,247,243,0.95); border: 1px solid var(--linen); border-radius: 1.6cqw; padding: 2.2cqw 0.6cqw;
  box-shadow: 0 1.2cqw 3.2cqw rgba(31,15,6,0.18); }
.cv-feat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.9cqw; text-align: center; padding: 0 0.8cqw; border-right: 1px solid var(--linen); }
.cv-feat:last-child { border-right: 0; }
.cv-feat svg { width: 3.8cqw; height: auto; }
.cv-feat span { color: var(--walnut); font-family: var(--font-cormorant), Georgia, serif; font-size: 1.3cqw; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1.3; font-weight: 500; }

.cv-footwrap { position: absolute; left: 0; right: 0; bottom: 3.6%; z-index: 3; text-align: center; }
.cv-foot { color: var(--dust); font-family: var(--font-cormorant), Georgia, serif; font-size: 2cqw; letter-spacing: 0.24em; text-transform: uppercase; margin: 0 0 1cqw; }
.cv-foot-orn { display: flex; align-items: center; justify-content: center; gap: 1.2cqw; }
.cv-foot-orn span { height: 1px; width: 12cqw; background: linear-gradient(90deg, transparent, var(--terracotta)); opacity: 0.5; }
.cv-foot-orn span:last-child { background: linear-gradient(90deg, var(--terracotta), transparent); }
.cv-foot-orn .cv-lotus { width: 2.4cqw; }

.gb-cover { flex: 1; display: flex; align-items: center; justify-content: center; }
.gb-cover-frame { border: 1px solid rgba(201,162,74,0.4); padding: clamp(24px, 4vw, 44px) clamp(16px, 3vw, 32px); text-align: center; width: 100%; }
.gb-cover-kicker { color: #B98F3E; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin: 0 0 22px; }
.gb-cover-deva { font-family: var(--font-noto-devanagari), serif; color: #EBC578; font-size: clamp(40px, 6vw, 82px); font-weight: 500; margin: 0; line-height: 1; }
.gb-cover-rule { width: 54px; height: 1px; background: linear-gradient(90deg, transparent, #C9A24A, transparent); margin: 18px auto; }
.gb-cover-title { color: #F3E4C4; font-size: clamp(26px, 4.6vw, 44px); font-weight: 500; font-style: italic; margin: 0; }
.gb-cover-sub { color: #C9A24A; font-size: clamp(13px, 2vw, 17px); letter-spacing: 5px; text-transform: uppercase; margin: 12px 0 0; }
.gb-cover-foot { color: #8A6F42; font-size: 11px; letter-spacing: 2px; margin: 30px 0 0; }

.gb-body { flex: 1; display: flex; flex-direction: column; }
.gb-eyebrow { color: var(--gold); font-size: 12px; letter-spacing: 4px; text-transform: uppercase; margin: 0 0 9px; }
.gb-deva-head { font-family: var(--font-noto-devanagari), serif; color: #7A5A24; font-size: clamp(18px, 2.5vw, 25px); font-weight: 500; margin: 0 0 5px; }
.gb-deva-big { font-size: clamp(26px, 4vw, 40px); color: #8A6320; }
.gb-title { color: var(--ink); font-size: clamp(25px, 3.2vw, 40px); font-weight: 500; font-style: italic; margin: 0; line-height: 1.15; }
.gb-rule { width: 44px; height: 2px; background: var(--gold-line); margin: 14px 0 18px; }
.gb-para { color: var(--ink-soft); font-size: clamp(14px, 1.5vw, 17.5px); line-height: 1.8; margin: 0 0 13px; }
.gb-para-just { text-align: justify; }
.gb-hint { margin-top: auto; color: var(--gold); font-size: 13px; letter-spacing: 1px; border-top: 1px dashed rgba(168,124,46,0.4); padding-top: 14px; }
.gb-note { color: #9C8560; font-size: 12.5px; font-style: italic; margin: 14px 0 0; text-align: center; }

.gb-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.gb-epigraph { color: var(--ink); font-size: clamp(20px, 2.8vw, 28px); font-style: italic; line-height: 1.5; max-width: 20ch; margin: 0; }
.gb-epigraph-sub { font-family: var(--font-noto-devanagari), serif; color: var(--gold); font-size: 22px; margin: 24px 0 0; }
.gb-dark .gb-epigraph { color: #F0E1C0; }
.gb-dark .gb-epigraph-sub { color: #C9A24A; }
.gb-colo-line { color: var(--ink); font-size: clamp(19px, 2.6vw, 25px); font-style: italic; margin: 0; }
.gb-colo-brand { color: var(--gold); font-size: 25px; letter-spacing: 4px; text-transform: uppercase; margin: 8px 0 0; }
.gb-colo-sub { color: var(--ink-soft); font-size: 14px; letter-spacing: 2px; margin: 8px 0 0; }
.gb-colo-foot { color: #8A6F42; font-size: 12px; letter-spacing: 1.5px; margin: 28px 0 0; }

.gb-checklist { display: flex; flex-direction: column; gap: 10px; }
.gb-check { display: flex; gap: 12px; align-items: flex-start; text-align: left; background: transparent; border: 0; padding: 6px 4px; cursor: pointer; border-radius: 5px; transition: background .15s ease; font-family: inherit; }
.gb-check:hover { background: rgba(168,124,46,0.07); }
.gb-check-inline { margin-top: 16px; border-top: 1px dashed rgba(168,124,46,0.4); padding-top: 14px; }
.gb-check-box { flex-shrink: 0; width: 22px; height: 22px; border: 1.5px solid var(--gold); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #FBF6EC; font-size: 14px; margin-top: 2px; transition: background .15s ease; }
.gb-check[data-on="true"] .gb-check-box { background: var(--gold); }
.gb-check-text { display: flex; flex-direction: column; }
.gb-check-time { color: var(--gold); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1px; }
.gb-check-label { color: var(--ink); font-size: clamp(14.5px, 1.8vw, 18px); line-height: 1.3; }
.gb-check-sub { color: var(--ink-soft); font-size: clamp(12px, 1.4vw, 13.5px); font-style: italic; line-height: 1.5; margin-top: 2px; }
.gb-check[data-on="true"] .gb-check-label { color: #9C8968; text-decoration: line-through; text-decoration-color: rgba(168,124,46,0.6); }
.gb-check-count { margin-top: 14px; color: var(--gold); font-size: 12px; letter-spacing: 2px; text-align: right; }
.gb-check-meta { display: flex; flex-wrap: wrap; gap: 3px 12px; margin-top: 5px; }
.gb-meta-how, .gb-meta-cost { color: #8C7A5A; font-size: 11px; }
.gb-meta-tip { color: #A87C2E; font-size: 11px; font-style: italic; }

/* Arrival-time personalisation */
.gb-arrival-pick { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 14px; }
.gb-arrival-q { color: var(--ink-soft); font-size: 13px; font-style: italic; }
.gb-arrival-opts { display: flex; gap: 6px; flex-wrap: wrap; }
.gb-arrival-opt { background: transparent; border: 1px solid rgba(168,124,46,0.5); color: var(--gold); border-radius: 999px; padding: 5px 14px; font-size: 12.5px; letter-spacing: 0.5px; cursor: pointer; font-family: inherit; transition: all .15s ease; }
.gb-arrival-opt:hover { background: rgba(168,124,46,0.1); }
.gb-arrival-opt[data-on="true"] { background: var(--gold); border-color: var(--gold); color: #FBF6EC; }
.gb-arrival-lead { color: var(--ink); font-size: clamp(14px, 1.7vw, 17px); font-style: italic; line-height: 1.5; margin: 0 0 16px; padding-left: 12px; border-left: 2px solid var(--gold-line); }
.gb-arrival-tag { color: var(--gold); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 8px 0 0; }

/* Photo-album page — six place frames (3 x 2 so they all fit with room to spare) */
.gb-album { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px 11px; align-content: start; }
.gb-atile { position: relative; margin: 0; background: #FCFBF6; padding: 5px 5px 4px; box-shadow: 0 4px 12px rgba(40,25,8,0.2); }
.gb-atile-num { position: absolute; top: -8px; left: -8px; z-index: 2; width: 22px; height: 22px; border-radius: 50%; background: #C8652A; color: #FBF3E8; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 600; box-shadow: 0 2px 6px rgba(0,0,0,0.25); font-family: var(--font-cormorant), serif; }
.gb-atile-photo { aspect-ratio: 1 / 1; background: repeating-linear-gradient(45deg, #EFE7D6, #EFE7D6 8px, #EAE1CD 8px, #EAE1CD 16px); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #E4D8BC; }
.gb-atile-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gb-atile-paste { background: #FFFDF8; background-image: none; border: 1px dashed #C7B590; }
.gb-atile-hint { color: #B6A585; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; }
.gb-atile figcaption { text-align: center; margin-top: 4px; color: #5C4A32; font-size: 11px; font-weight: 500; line-height: 1.15; }
.gb-atile-sub { text-align: center; margin: 2px 0 0; color: #8A7A5C; font-size: 9.5px; font-style: italic; line-height: 1.25; }

/* Plan (compact timings + paste frames) */
.gb-plan-map { background: #FCFBF6; padding: 8px 12px; box-shadow: 0 4px 12px rgba(40,25,8,0.16); margin-bottom: 14px; display: flex; justify-content: center; }
.gb-plan-map svg { width: 100%; height: auto; max-height: 108px; }
.gb-plan-list { display: flex; flex-direction: column; }
.gb-plan-row { display: grid; grid-template-columns: 66px 20px 1fr; gap: 9px; align-items: center; background: transparent; border: 0; border-bottom: 1px solid rgba(168,124,46,0.18); padding: 8px 2px; text-align: left; cursor: pointer; font-family: inherit; }
.gb-plan-row:hover { background: rgba(168,124,46,0.06); }
.gb-plan-time { color: var(--gold); font-size: 11px; letter-spacing: 0.5px; font-family: var(--font-cormorant), Georgia, serif; }
.gb-plan-box { width: 18px; height: 18px; border: 1.5px solid var(--gold); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #FBF6EC; font-size: 12px; }
.gb-plan-row[data-on="true"] .gb-plan-box { background: var(--gold); }
.gb-plan-label { color: var(--ink); font-size: clamp(13px, 1.6vw, 15.5px); line-height: 1.3; }
.gb-plan-row[data-on="true"] .gb-plan-label { color: #9C8968; text-decoration: line-through; }
.gb-plan-paste { display: flex; gap: 12px; margin-top: auto; padding-top: 14px; border-top: 1px dashed rgba(168,124,46,0.3); }
.gb-polaroid-sm { width: clamp(96px, 40%, 140px); }

/* Scannable link (QR in print, tap on screen) */
.gb-qr { display: flex; align-items: center; gap: 14px; margin-top: 16px; text-decoration: none; border-top: 1px dashed rgba(168,124,46,0.4); padding-top: 14px; }
.gb-qr-code { flex-shrink: 0; width: 66px; height: 66px; background: #fff; padding: 5px; border: 1px solid #E4D8BC; border-radius: 4px; box-shadow: 0 3px 10px rgba(40,25,8,0.15); }
.gb-qr-code svg { width: 100%; height: 100%; display: block; }
.gb-qr-text { display: flex; flex-direction: column; }
.gb-qr-hook { color: var(--ink); font-size: 13.5px; font-style: italic; line-height: 1.45; }
.gb-qr-label { color: var(--gold); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 5px; }
.gb-qr-lost { border-top: 0; border: 1px solid rgba(200,101,42,0.5); background: rgba(200,101,42,0.06); border-radius: 8px; padding: 14px; }
.gb-qr-lost .gb-qr-code { width: 76px; height: 76px; }
.gb-qr-lost .gb-qr-label { color: #C8652A; }
.gb-qr-boxed { margin-top: 14px; border-top: 0; border: 1px solid rgba(200,101,42,0.5); background: rgba(200,101,42,0.07); border-radius: 8px; padding: 12px 14px; }
.gb-qr-boxed .gb-qr-code { width: 74px; height: 74px; }
.gb-qr-boxed .gb-qr-label { color: #C8652A; font-weight: 600; }

.gb-photos { display: flex; flex-wrap: wrap; gap: 18px 22px; justify-content: center; align-content: center; flex: 1; padding: 8px 0; }
.gb-polaroid { position: relative; margin: 0; background: #FCFBF6; padding: 8px 8px 6px; box-shadow: 0 6px 16px rgba(40,25,8,0.28); width: clamp(120px, 30%, 168px); }
.gb-tape { position: absolute; top: -9px; left: 50%; transform: translateX(-50%) rotate(-3deg); width: 54px; height: 20px; background: rgba(210,180,110,0.45); border: 1px solid rgba(180,150,90,0.3); }
.gb-photo { aspect-ratio: 1 / 1; background: repeating-linear-gradient(45deg, #EFE7D6, #EFE7D6 8px, #EAE1CD 8px, #EAE1CD 16px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.gb-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gb-photo-hint { color: #B6A585; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
.gb-polaroid figcaption { text-align: center; margin-top: 6px; color: #6E5B3C; font-size: 13px; font-style: italic; }

.gb-craft { justify-content: flex-start; }
.gb-maker { color: var(--gold); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 6px 0 12px; }
.gb-craft-photo { width: clamp(120px, 40%, 170px); align-self: center; background: #FCFBF6; padding: 8px; box-shadow: 0 6px 16px rgba(40,25,8,0.25); margin-bottom: 14px; transform: rotate(-2deg); }
.gb-craft-photo img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
.gb-addition { color: #8A6320; font-size: clamp(16px, 2.1vw, 22px); font-style: italic; text-align: center; margin: 14px 0 0; }

.gb-phone { margin-top: auto; text-align: center; border: 1px solid rgba(201,162,74,0.45); border-radius: 6px; padding: 16px; background: rgba(201,162,74,0.06); }
.gb-phone-label { color: var(--gold); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px; }
.gb-phone-num { color: var(--ink); font-size: clamp(20px, 3vw, 28px); letter-spacing: 3px; margin: 0; }
.gb-phone-note { color: #9C8560; font-size: 12px; font-style: italic; margin: 8px 0 0; }

.gb-nav { width: 100%; max-width: 460px; margin-top: 12px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.gb-btn { background: transparent; color: #8A6520; border: 1px solid #CDBC9C; border-radius: 999px; padding: 9px 22px; font-size: 15px; letter-spacing: 1px; cursor: pointer; font-family: var(--font-cormorant), Georgia, serif; transition: all .2s ease; }
.gb-btn:hover:not(:disabled) { background: rgba(201,162,74,0.14); border-color: #A8792E; color: #6A4E28; }
.gb-btn:disabled { opacity: 0.35; cursor: default; }
.gb-count { color: #8A7A5C; font-size: 13px; letter-spacing: 2px; }
`;
