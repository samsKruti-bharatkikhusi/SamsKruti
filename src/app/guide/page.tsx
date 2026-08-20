import type { Metadata } from "next";
import { TheAsking } from "./asking";

export const metadata: Metadata = {
  title: "Three questions — SamsKruti",
  description:
    "Three questions, two minutes. Then a guided Varanasi, written by hand and sent to you.",
  robots: { index: false, follow: false },
};

export default function GuidePage() {
  return <TheAsking />;
}
