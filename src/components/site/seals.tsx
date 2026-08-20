import type { SVGProps } from "react";

/* ── THE MARK ──────────────────────────────────────────────────────────────
   ONE logo, one form, every size: the glyph — the S alone, no ring.

   The ringed seal exists as an asset (public/brand/seal-*.webp) but is NOT
   used in the interface. In the app the mark is always the bare glyph, so
   there is no size switch, no variant, and nothing that can drift.

   The crest (public/brand/crest-*) is an illustration for print and OG at
   96px and above. It has no component, deliberately.
   ────────────────────────────────────────────────────────────────────────── */

const STEPS = [64, 128, 256, 512] as const;

export function Mark({
  size = 44,
  className,
  alt = "SamsKruti",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  const px = size * 2; // 2× so it stays crisp on retina
  const step = STEPS.find((s) => s >= px) ?? 512;
  return (
    // Pre-sized WebP: 1–15KB each. next/image would re-encode for nothing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className ? `nav-seal nav-seal-img ${className}` : "nav-seal nav-seal-img"}
      src={`/brand/glyph-${step}.webp`}
      width={size}
      height={size}
      alt={alt}
      decoding="async"
    />
  );
}

/** The illustrated medallion. 96px and above only — never interface chrome.
    No small exports exist, so it cannot be used at a UI size by accident. */
export function Crest({
  size = 256,
  className,
  alt = "",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  const px = size * 2;
  const step = px <= 256 ? 256 : px <= 512 ? 512 : 1024;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={`/brand/crest-${step}.webp`}
      width={size}
      height={size}
      alt={alt}
      decoding="async"
    />
  );
}

/* Every previous seal name resolves to the same single mark, so no call
   site has to change and no variant can creep back in. */
export const NavSealHub = Mark;
export const NavSealGaliyan = Mark;
export const NavSealParampara = Mark;
export const NavSealHriday = Mark;

/* ── Page ornaments (not marks) ──────────────────────────────────────────
   Decorative only — a footer rule-seal and the hero mandala. Kept as-is:
   they never stood in for the logo. ────────────────────────────────────── */

export function FooterSeal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="footer-seal"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.3" />
      <line x1="18" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
      <line x1="30" y1="18" x2="30" y2="42" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

export function HeroMandalaHub({
  color = "#C8652A",
  innerColor = "#E8A870",
  ...props
}: SVGProps<SVGSVGElement> & { color?: string; innerColor?: string }) {
  const rotations = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const innerRots = [15, 75, 135, 195, 255, 315];
  return (
    <svg
      className="hero-mandala"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <g opacity="0.13" fill={color}>
        {rotations.map((r) => (
          <ellipse key={r} cx="250" cy="155" rx="22" ry="80" transform={`rotate(${r},250,250)`} />
        ))}
      </g>
      <g opacity="0.18" fill={innerColor}>
        {innerRots.map((r) => (
          <ellipse key={r} cx="250" cy="188" rx="12" ry="48" transform={`rotate(${r},250,250)`} />
        ))}
      </g>
      <circle cx="250" cy="250" r="238" stroke={color} strokeWidth="0.7" fill="none" opacity="0.1" />
      <circle cx="250" cy="250" r="196" stroke={color} strokeWidth="0.7" fill="none" opacity="0.08" />
      <circle cx="250" cy="250" r="148" stroke={color} strokeWidth="0.9" fill="none" opacity="0.1" />
      <circle cx="250" cy="250" r="95" stroke={color} strokeWidth="1" fill="none" opacity="0.14" />
      <circle cx="250" cy="250" r="44" stroke={color} strokeWidth="1.2" fill="none" opacity="0.18" />
      <circle cx="250" cy="250" r="7" fill={color} opacity="0.28" />
    </svg>
  );
}

export function HeroMandalaSegment({ color = "#C8652A", rotations = [0, 45, 90, 135, 180, 225, 270, 315], ...props }: SVGProps<SVGSVGElement> & { color?: string; rotations?: number[] }) {
  return (
    <svg
      className="hero-mandala"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <g opacity="0.12" fill={color}>
        {rotations.map((r) => (
          <ellipse key={r} cx="250" cy="155" rx="22" ry="80" transform={`rotate(${r},250,250)`} />
        ))}
      </g>
      <circle cx="250" cy="250" r="200" stroke={color} strokeWidth="0.7" fill="none" opacity="0.1" />
      <circle cx="250" cy="250" r="150" stroke={color} strokeWidth="0.9" fill="none" opacity="0.12" />
      <circle cx="250" cy="250" r="80" stroke={color} strokeWidth="1" fill="none" opacity="0.15" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 L21 21" />
    </svg>
  );
}

export function MapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 4 L3 6 V20 L9 18 L15 20 L21 18 V4 L15 6 L9 4 Z" />
      <path d="M9 4 V18" />
      <path d="M15 6 V20" />
    </svg>
  );
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 24 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...props}
    >
      <path d="M1 7h22M16 1l6 6-6 6" />
    </svg>
  );
}

// Cart — a heritage shopping bag.
export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8h12l-1 11.5a1 1 0 0 1-1 0.9H8a1 1 0 0 1-1-0.9L6 8z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

// Itinerary — a day-by-day agenda (dots + lines), echoing the timeline spine.
export function ItineraryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="5" cy="6" r="1.4" />
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="5" cy="18" r="1.4" />
      <path d="M10 6h9M10 12h9M10 18h9" />
    </svg>
  );
}
