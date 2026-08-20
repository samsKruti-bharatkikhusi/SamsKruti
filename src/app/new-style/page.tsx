import type { Metadata } from "next";
import Link from "next/link";
import brand from "@/styles/brand.module.css";
import { Mark } from "@/components/site/seals";
import styles from "./the-door.module.css";

// A proposal, not the live door. Parked at /new-style so the current
// landing page keeps working while the design is decided.
export const metadata: Metadata = {
  title: "First time in Varanasi?",
  description:
    "Forty videos in, and you still don't know where to start. A guided Varanasi, written by hand.",
  robots: { index: false, follow: false },
};

export default function NewStyleDoorPage() {
  return (
    <div className={`${brand.scope} ${styles.door}`}>
      <div className={styles.brand}>
        <Mark size={26} className={styles.markGlyph} alt="" />
        <span className={styles.brandName}>SamsKruti</span>
      </div>

      <main className={styles.stage}>
        <div className={styles.copy}>
          <h1 className={`${styles.headline} ${styles.rise} ${styles.d1}`}>
            First time in Varanasi?
          </h1>

          <p className={`${styles.pain} ${styles.rise} ${styles.d2}`}>
            Forty videos in, and you still don&rsquo;t know where to start.
          </p>

          <div className={`${styles.panel} ${styles.rise} ${styles.d3}`}>
            <p className={styles.promise}>
              I&rsquo;ll walk you through it &mdash; from before you land to your
              last morning.
            </p>

            <Link className={styles.cta} href="/guide">
              Guide me
              <span className={styles.arrow} aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <p className={styles.fine}>Free &middot; three questions &middot; two minutes</p>
          </div>
        </div>
      </main>

      <footer className={styles.foot}>
        <p className={styles.byline}>
          <strong>Written by hand, by someone who walks these lanes.</strong>{" "}
          Not generated, not scraped from a hundred videos.
        </p>
      </footer>
    </div>
  );
}
