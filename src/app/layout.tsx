import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { SiteEffects } from "@/components/site/site-effects";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const notoDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SamsKruti — A Living Cultural Narrative of India",
  description:
    "Three platforms. One country. A quiet, intentional guide to India's depth — its streets, its kitchens, and its artisan hands.",
  metadataBase: new URL("https://www.samskruti.life"),
  openGraph: {
    title: "SamsKruti — A Living Cultural Narrative of India",
    description:
      "A quiet guide to India through Sheher Ki Galiyan, Sheher Ka Swaad, and Sheher Ka Hriday.",
    url: "https://www.samskruti.life",
    siteName: "SamsKruti",
    type: "website",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "SamsKruti — A Living Culture of India" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${notoDevanagari.variable}`}>
      <body>
        {children}
        <SiteEffects />
      </body>
    </html>
  );
}
