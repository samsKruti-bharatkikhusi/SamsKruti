import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  NavSealHub,
  NavSealGaliyan,
  NavSealParampara,
  NavSealHriday,
  ItineraryIcon,
  CartIcon,
} from "@/components/site/seals";
import type { HeroTheme } from "@/components/site/site-hero";
import type { SegmentSlug } from "@/lib/segments";

type PageKey = "varanasi" | "itinerary" | SegmentSlug;

// Brand logo + the three Varanasi segments, shown over the hero on the city
// and segment pages (not home). The seal + breadcrumb are themed per page; the
// sidebar remains the primary nav. A corner icon links to the city itinerary.
const SEGMENT_NAV: { slug: SegmentSlug; href: string; label: string }[] = [
  { slug: "hriday",    href: "/varanasi/hriday",    label: "Sheher Ka Hriday" },
  { slug: "galiyan",   href: "/varanasi/galiyan",   label: "Sheher Ki Galiyan" },
  { slug: "parampara", href: "/varanasi/parampara", label: "Sheher Ka Swaad" },
];

const ITINERARY_HREF = "/varanasi/itinerary";

// Per-page seal + breadcrumb (page name on top, parent trail beneath).
const BRAND: Record<PageKey, { seal: ReactNode; title: string; sub: string }> = {
  varanasi:  { seal: <NavSealHub />,       title: "SamsKruti",         sub: "Varanasi" },
  itinerary: { seal: <NavSealHub />,       title: "SamsKruti",         sub: "Varanasi" },
  galiyan:   { seal: <NavSealGaliyan />,   title: "Sheher Ki Galiyan", sub: "Varanasi · SamsKruti" },
  parampara: { seal: <NavSealParampara />, title: "Sheher Ka Swaad",   sub: "Varanasi · SamsKruti" },
  hriday:    { seal: <NavSealHriday />,    title: "Sheher Ka Hriday",  sub: "Varanasi · SamsKruti" },
};

export function TopNav({ page, theme }: { page: PageKey; theme?: HeroTheme }) {
  const style = {
    ...(theme?.accent ? { "--nav-accent": theme.accent } : {}),
  } as CSSProperties;
  const brand = BRAND[page];
  // Logo walks one level up: Varanasi -> home; segment/itinerary -> Varanasi.
  const logoHref = page === "varanasi" ? "/" : "/varanasi";

  return (
    <>
      <nav className="top-nav" style={style} aria-label="Segments">
        <Link href={logoHref} className="top-nav-logo">
          {brand.seal}
          <span className="top-nav-text">
            <span className="top-nav-brand">{brand.title}</span>
            <span className="top-nav-sub">{brand.sub}</span>
          </span>
        </Link>

        <ul className="top-nav-links">
          {SEGMENT_NAV.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.href}
                className={`top-nav-link${page === s.slug ? " is-active" : ""}`}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Fixed cluster — stays visible on scroll, like the hamburger (top-left) */}
      <div className="top-nav-actions" style={style}>
        <Link
          href={ITINERARY_HREF}
          className={`top-nav-icon${page === "itinerary" ? " is-active" : ""}`}
          aria-label="City itinerary"
          title="Itinerary"
        >
          <ItineraryIcon />
        </Link>
        <Link
          href="/cart"
          className="top-nav-icon"
          aria-label="Cart"
          title="The SamsKruti Cart"
        >
          <CartIcon />
        </Link>
      </div>
    </>
  );
}
