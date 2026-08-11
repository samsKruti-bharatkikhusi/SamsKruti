import type { SVGProps } from "react";

/* ── Master mark ───────────────────────────────────────────────────────────
   The lotus-S emblem is the universal logo, tinted to each section's accent
   (hub/earth, galiyan/green, parampara/terracotta, hriday/blue). The untinted
   S is the global favicon (src/app/icon.png); the full medallion lives at
   /brand/samskruti-medallion.png for OG/large use. Assets are cut + tinted
   from the source artwork by scripts/logo-lab/process-logo.js.                */
function SealS({ theme, alt }: { theme: string; alt: string }) {
  return <img className="nav-seal nav-seal-img" src={`/brand/s-${theme}.png`} alt={alt} />;
}

export function NavSealHub() {
  return <SealS theme="hub" alt="SamsKruti — A Living Culture of India" />;
}
export function NavSealGaliyan() {
  return <SealS theme="galiyan" alt="Sheher Ki Galiyan" />;
}
export function NavSealParampara() {
  return <SealS theme="parampara" alt="Sheher Ka Swaad" />;
}
export function NavSealHriday() {
  return <SealS theme="hriday" alt="Sheher Ka Hriday" />;
}

export function CardSealGaliyan(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="seg-seal"
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="80" cy="80" r="67" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <g transform="translate(80,80)" fill="currentColor" opacity="0.6">
        <polygon points="0,-34 8,-20 6,-20 6,10 -6,10 -6,-20 -8,-20" />
        <rect x="-20" y="10" width="40" height="6" />
        <rect x="-24" y="16" width="48" height="4" />
        <polygon points="-18,-22 -12,-12 -12,10 -18,10" opacity="0.5" />
        <polygon points="18,-22 12,-12 12,10 18,10" opacity="0.5" />
        <line x1="0" y1="-34" x2="0" y2="-42" stroke="currentColor" strokeWidth="1" />
        <polygon points="0,-42 8,-38 0,-34" opacity="0.7" />
      </g>
      <path id="galiyanTop" d="M 14,80 A 66,66 0 0,1 146,80" fill="none" />
      <path id="galiyanBot" d="M 146,82 A 66,66 0 0,1 14,82" fill="none" />
      <text fontFamily="'Trebuchet MS',sans-serif" fontSize="9.5" letterSpacing="2.5" fill="currentColor" opacity="0.7">
        <textPath href="#galiyanTop" startOffset="8%">SHEHER KI GALIYAN</textPath>
      </text>
      <text fontFamily="'Trebuchet MS',sans-serif" fontSize="7.5" letterSpacing="2" fill="currentColor" opacity="0.5">
        <textPath href="#galiyanBot" startOffset="15%">STREETS OF THE CITY</textPath>
      </text>
    </svg>
  );
}

export function CardSealParampara(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="seg-seal"
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="80" cy="80" r="67" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <g transform="translate(80,80)" fill="currentColor" opacity="0.6">
        <path d="M -18,0 Q -22,16 0,20 Q 22,16 18,0 Z" />
        <ellipse cx="0" cy="0" rx="18" ry="5" />
        <path d="M -18,0 Q -26,-2 -24,-8 Q -22,-14 -18,-10" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 18,0 Q 26,-2 24,-8 Q 22,-14 18,-10" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M -6,-6 Q -4,-14 -6,-20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M 0,-8 Q 2,-16 0,-22" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M 6,-6 Q 8,-14 6,-20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <g transform="translate(22, 8)" opacity="0.8">
          <path d="M -5,4 Q 0,7 5,4 Q 4,0 0,-2 Q -4,0 -5,4 Z" />
          <path d="M 0,-2 Q 1,-8 0,-12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="0" cy="-12" rx="2" ry="3" opacity="0.7" />
        </g>
      </g>
      <path id="paramparaTop" d="M 14,80 A 66,66 0 0,1 146,80" fill="none" />
      <path id="paramparaBot" d="M 146,82 A 66,66 0 0,1 14,82" fill="none" />
      <text fontFamily="'Trebuchet MS',sans-serif" fontSize="9.5" letterSpacing="2.5" fill="currentColor" opacity="0.7">
        <textPath href="#paramparaTop" startOffset="8%">SHEHER KA SWAAD</textPath>
      </text>
      <text fontFamily="'Trebuchet MS',sans-serif" fontSize="7.5" letterSpacing="2.5" fill="currentColor" opacity="0.5">
        <textPath href="#paramparaBot" startOffset="13%">TASTE OF THE CITY</textPath>
      </text>
    </svg>
  );
}

export function CardSealHriday(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="seg-seal"
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="80" cy="80" r="67" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <g transform="translate(80,84)" fill="currentColor" opacity="0.6">
        <rect x="-24" y="4" width="48" height="2.5" rx="1" />
        <rect x="-24" y="12" width="48" height="2.5" rx="1" />
        <line x1="-14" y1="4" x2="-10" y2="14" stroke="currentColor" strokeWidth="1" />
        <line x1="-6" y1="4" x2="-4" y2="14" stroke="currentColor" strokeWidth="1" />
        <line x1="2" y1="4" x2="2" y2="14" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="4" x2="8" y2="14" stroke="currentColor" strokeWidth="1" />
        <line x1="18" y1="4" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />
        <path
          d="M -20,-2 Q -26,6 -18,10 Q -10,12 -4,8 L 0,4 L 4,8 Q 10,12 18,10 Q 26,6 20,-2 Q 10,-8 0,-10 Q -10,-8 -20,-2 Z"
          opacity="0.5"
        />
        <g transform="translate(0,-22)">
          <ellipse cx="0" cy="0" rx="5" ry="10" opacity="0.9" />
          <ellipse cx="-7" cy="2" rx="4" ry="8" transform="rotate(-25,0,0)" opacity="0.7" />
          <ellipse cx="7" cy="2" rx="4" ry="8" transform="rotate(25,0,0)" opacity="0.7" />
          <ellipse cx="-12" cy="4" rx="3" ry="6" transform="rotate(-45,0,0)" opacity="0.5" />
          <ellipse cx="12" cy="4" rx="3" ry="6" transform="rotate(45,0,0)" opacity="0.5" />
        </g>
      </g>
      <path id="hridayTop" d="M 14,80 A 66,66 0 0,1 146,80" fill="none" />
      <path id="hridayBot" d="M 146,82 A 66,66 0 0,1 14,82" fill="none" />
      <text fontFamily="'Trebuchet MS',sans-serif" fontSize="9.5" letterSpacing="2.5" fill="currentColor" opacity="0.7">
        <textPath href="#hridayTop" startOffset="8%">SHEHER KA HRIDAY</textPath>
      </text>
      <text fontFamily="'Trebuchet MS',sans-serif" fontSize="7.5" letterSpacing="2.5" fill="currentColor" opacity="0.5">
        <textPath href="#hridayBot" startOffset="14%">HEART OF THE CITY</textPath>
      </text>
    </svg>
  );
}

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
