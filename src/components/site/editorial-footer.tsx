import Link from "next/link";
import { FooterSeal } from "@/components/site/seals";
import { SEGMENTS } from "@/lib/segments";

const ROMAN = ["I", "II", "III"] as const;

export function EditorialFooter() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-footer-inner">
        <Link href="/" className="editorial-footer-mast">
          <FooterSeal />
          <div>
            <p className="footer-logo-text">SamsKruti</p>
            <small>A quiet guide to India</small>
          </div>
        </Link>

        <nav className="editorial-footer-chapters" aria-label="Chapters">
          {SEGMENTS.map((segment, i) => (
            <Link key={segment.slug} href={`/varanasi/${segment.slug}`}>
              <span className="ch-no">{ROMAN[i]}</span>
              <span className="ch-name">{segment.name}</span>
            </Link>
          ))}
        </nav>

        <p className="editorial-footer-colophon">
          Vol. 01
          <br />
          MMXXVI
          <br />
          samskruti.life
        </p>
      </div>

      <div className="editorial-footer-base">
        <span>© 2026 SamsKruti · Streets of India</span>
        <a href="mailto:hello@samskruti.life">hello@samskruti.life</a>
      </div>
    </footer>
  );
}
