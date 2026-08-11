"use client";

import Script from "next/script";
import { createElement } from "react";

interface Props {
  /** Path to the .glb model. When null, falls back to the still image. */
  model: string | null;
  /** Fallback still shown until a 3D model exists. */
  fallbackSrc: string;
  alt: string;
}

/**
 * The Heritage Box as a true, rotatable 3D object — via Google's <model-viewer>
 * (loaded from CDN, no bundled dependency). Until a .glb is provided it renders
 * the still image, so the page is never broken; drop in the model and it
 * upgrades to interactive 3D automatically.
 *
 * Expected model path once available: /data/models/hriday-box.glb
 */
export function Box3D({ model, fallbackSrc, alt }: Props) {
  if (!model) {
    return <img src={fallbackSrc} alt={alt} className="box3d-fallback" />;
  }

  return (
    <>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
        strategy="afterInteractive"
      />
      {createElement("model-viewer", {
        src: model,
        alt,
        "camera-controls": true,
        "auto-rotate": true,
        "auto-rotate-delay": "600",
        "rotation-per-second": "20deg",
        "interaction-prompt": "none",
        "shadow-intensity": "1",
        "environment-image": "neutral",
        poster: fallbackSrc,
        style: { width: "100%", height: "100%", background: "transparent" },
      })}
    </>
  );
}
