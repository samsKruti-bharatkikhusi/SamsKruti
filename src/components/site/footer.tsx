import Link from "next/link";
import { FooterSeal } from "@/components/site/seals";
import type { SegmentSlug } from "@/lib/segments";

export function Footer({ active }: { active?: SegmentSlug }) {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-logo">
        <FooterSeal />
        <span className="footer-logo-text">SamsKruti</span>
      </Link>
      <nav className="footer-segment-links" aria-label="Segments">
        <Link href="/varanasi/hriday" className={active === "hriday" ? "active" : undefined}>
          Sheher Ka Hriday
        </Link>
        <span>·</span>
        <Link href="/varanasi/galiyan" className={active === "galiyan" ? "active" : undefined}>
          Sheher Ki Galiyan
        </Link>
        <span>·</span>
        <Link href="/varanasi/parampara" className={active === "parampara" ? "active" : undefined}>
          Sheher Ka Swaad
        </Link>
      </nav>
      <span className="footer-copy">© 2026 SamsKruti · www.samskruti.life</span>
    </footer>
  );
}
