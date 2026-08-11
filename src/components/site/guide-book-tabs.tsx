"use client";

import { useEffect, useMemo, useState } from "react";
import { GUIDEBOOKS, GUIDEBOOK_LIST, LANGS, getGuideBook, type Lang } from "@/data/guidebooks";
import type { ArrivalKey } from "@/data/guidebooks/types";
import { GuideBook } from "./guide-book";

// The control panel lives OUTSIDE the (static) book: pick the itinerary length,
// the language, and when you arrive. The book below just reflects the choices.
const ARRIVALS: { key: ArrivalKey; label: string }[] = [
  { key: "morning", label: "Early morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

export function GuideBookTabs() {
  const [active, setActive] = useState("3-day");
  const [lang, setLangState] = useState<Lang>("en");
  const [arrival, setArrivalState] = useState<ArrivalKey>("morning");
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    try {
      const l = localStorage.getItem("gb-lang");
      if (l === "en" || l === "hi" || l === "te") setLangState(l);
      const a = localStorage.getItem("gb-arrival");
      setArrivalState(a === "afternoon" || a === "evening" ? a : "morning");
    } catch { /* ignore */ }
  }, []);

  const setLang = (l: Lang) => { setLangState(l); try { localStorage.setItem("gb-lang", l); } catch { /* ignore */ } };
  const setArrival = (a: ArrivalKey) => { setArrivalState(a); try { localStorage.setItem("gb-arrival", a); } catch { /* ignore */ } };

  const book = useMemo(() => getGuideBook(active, lang), [active, lang]);

  const jLabel = GUIDEBOOK_LIST.find((t) => t.slug === active)?.label ?? "";
  const lLabel = LANGS.find((l) => l.key === lang)?.label ?? "";
  const aLabel = ARRIVALS.find((a) => a.key === arrival)?.label ?? "";

  const panel = (
    <div className="gt-panel">
      <style>{GT_CSS}</style>
      {panelOpen ? (
        <div className="gt-full">
          <div className="gt-full-top">
            <span className="gt-full-title">Your journey</span>
            <button type="button" className="gt-collapse" onClick={() => setPanelOpen(false)}>Done</button>
          </div>
          <div className="gt-row">
            <span className="gt-row-label">Days</span>
            <div className="gt-group">
              {GUIDEBOOK_LIST.map((t) => (
                <button key={t.slug} type="button" className="gt-pill" data-on={t.slug === active} onClick={() => setActive(t.slug)}>
                  <span>{t.label}</span>
                  {!t.ready && <span className="gt-pill-soon">soon</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="gt-row">
            <span className="gt-row-label">Language</span>
            <div className="gt-group">
              {LANGS.map((l) => (
                <button key={l.key} type="button" className="gt-pill" data-on={l.key === lang} onClick={() => setLang(l.key)}>{l.label}</button>
              ))}
            </div>
          </div>
          <div className="gt-row">
            <span className="gt-row-label">I arrive</span>
            <div className="gt-group">
              {ARRIVALS.map((a) => (
                <button key={a.key} type="button" className="gt-pill" data-on={a.key === arrival} onClick={() => setArrival(a.key)}>{a.label}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="gt-summary" onClick={() => setPanelOpen(true)}>
          <span className="gt-summary-txt">{jLabel} · {lLabel} · {aLabel}</span>
          <span className="gt-summary-chip">Change</span>
        </button>
      )}
    </div>
  );

  // the cover prints these, so it always matches the book actually selected.
  // memoised — a fresh object each render would defeat the reader's own memo.
  const choices = useMemo(() => ({ journey: jLabel, arrival: aLabel, language: lLabel }), [jLabel, aLabel, lLabel]);
  if (book) return <GuideBook key={active} book={book} tabs={panel} arrival={arrival} choices={choices} />;

  const meta = GUIDEBOOK_LIST.find((t) => t.slug === active)!;
  return (
    <div className="gt-soon-root">
      {panel}
      <div className="gt-soon">
        <p className="gt-soon-eyebrow">{meta.label} · Varanasi</p>
        <h2 className="gt-soon-title">Coming soon</h2>
        <p className="gt-soon-body">{meta.blurb}</p>
        <p className="gt-soon-note">We build these one page at a time. The 3-day book is ready — start there.</p>
        <button type="button" className="gt-soon-btn" onClick={() => setActive("3-day")}>Open the 3-day book →</button>
      </div>
    </div>
  );
}

const GT_CSS = `
.gt-panel { width: 100%; display: flex; justify-content: center; margin: 2px auto 6px; }
.gt-summary { display: inline-flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.55); border: 1px solid #CDBC9C; border-radius: 999px; padding: 6px 7px 6px 18px; cursor: pointer; font-family: var(--font-cormorant), Georgia, serif; }
.gt-summary:hover { border-color: #A8792E; }
.gt-summary-txt { color: #7A6A4C; font-size: 13px; letter-spacing: 0.5px; }
.gt-summary-chip { background: #C8652A; color: #FBF6EC; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; border-radius: 999px; padding: 5px 13px; }
.gt-full { width: 100%; max-width: 720px; background: rgba(255,255,255,0.5); border: 1px solid #E0D3B8; border-radius: 12px; padding: 12px 16px 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 24px rgba(70,48,18,0.1); }
.gt-full-top { display: flex; align-items: center; justify-content: space-between; }
.gt-full-title { color: #A8792E; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
.gt-collapse { background: transparent; border: 1px solid #CDBC9C; color: #8A6520; border-radius: 999px; padding: 4px 14px; font-size: 12px; cursor: pointer; font-family: inherit; }
.gt-collapse:hover { border-color: #A8792E; color: #6A4E28; }
.gt-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.gt-row-label { color: #8A754A; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; width: 72px; flex-shrink: 0; text-align: right; }
.gt-group { display: flex; gap: 6px; flex-wrap: wrap; }
.gt-pill { background: rgba(255,255,255,0.6); border: 1px solid #CDBC9C; color: #7A6A4C; border-radius: 999px; padding: 6px 15px; cursor: pointer; font-family: var(--font-cormorant), Georgia, serif; font-size: 13.5px; letter-spacing: 1px; transition: all .18s ease; display: inline-flex; align-items: baseline; gap: 7px; }
.gt-pill:hover { color: #8A6520; border-color: #A8792E; }
.gt-pill[data-on="true"] { background: #C8652A; border-color: #C8652A; color: #FBF6EC; }
.gt-pill-soon { font-size: 8.5px; letter-spacing: 1px; text-transform: uppercase; opacity: 0.75; }
.gt-pill[data-on="true"] .gt-pill-soon { color: #F3D6B8; }

.gt-soon-root { min-height: 100vh; background: radial-gradient(ellipse 90% 60% at 50% 0%, #FBF5E8, transparent 55%), linear-gradient(180deg, #EFE6D2, #E4D9BF); display: flex; flex-direction: column; align-items: center; padding: 16px 14px 40px; box-sizing: border-box; font-family: var(--font-cormorant), Georgia, serif; }
.gt-soon { margin: auto; text-align: center; max-width: 440px; }
.gt-soon-eyebrow { color: #A8792E; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px; }
.gt-soon-title { color: #5A4A32; font-size: 34px; font-style: italic; font-weight: 500; margin: 0 0 14px; }
.gt-soon-body { color: #6A5A3E; font-size: 16px; line-height: 1.7; margin: 0 0 8px; }
.gt-soon-note { color: #8A754A; font-size: 13px; font-style: italic; margin: 0 0 24px; }
.gt-soon-btn { background: transparent; color: #8A6520; border: 1px solid #CDBC9C; border-radius: 999px; padding: 10px 24px; font-size: 15px; cursor: pointer; font-family: inherit; letter-spacing: 1px; }
.gt-soon-btn:hover { background: rgba(201,162,74,0.14); color: #6A4E28; }
`;
