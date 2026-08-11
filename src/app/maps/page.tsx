import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { IndiaMapExplorer } from "@/components/site/india-map-explorer";

export const metadata: Metadata = {
  title: "Maps — India · SamsKruti",
  description: "Explore SamsKruti across India — zoom in and out, and enter a city.",
  robots: { index: false }, // internal tool for now
};

export default function MapsPage() {
  return (
    <div
      className="maps-explorer-page"
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#0A0807" }}
    >
      <Navbar variant="maps" coverNav />
      <IndiaMapExplorer />
    </div>
  );
}
