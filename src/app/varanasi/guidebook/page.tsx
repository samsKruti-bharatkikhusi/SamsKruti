import type { Metadata } from "next";
import { GuideBookTabs } from "@/components/site/guide-book-tabs";

export const metadata: Metadata = {
  title: "Varanasi · Guided Workbooks — SamsKruti",
  description:
    "Choose your journey — 3, 5, 8, or 14 days in Varanasi. A page-turning workbook of the guided journey: the ghats at dawn, the makers' lanes, and a guide always one call away.",
};

export default function VaranasiGuideBookPage() {
  return <GuideBookTabs />;
}
