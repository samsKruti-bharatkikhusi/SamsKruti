"use client";

import { useEffect } from "react";

export function SiteEffects() {
  useEffect(() => {
    // Fade-in observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const FADE_SELECTOR =
      ".fade-in, .segment-card, .trait-card, .city-card, .stat-item, .quote-card, .story-card, .seg-card, .seg-city-card, .seg-note-card";

    function observeAll(root: ParentNode = document) {
      root.querySelectorAll(FADE_SELECTOR).forEach((el) => observer.observe(el));
    }
    observeAll();

    // Watch for cards inserted later (filter switches, client lists)
    const mutation = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(FADE_SELECTOR)) observer.observe(node);
          observeAll(node);
        });
      }
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    // Smooth scroll for hash links accounting for nav height
    function onAnchorClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const nav = document.querySelector(".site-nav") as HTMLElement | null;
      const navH = nav ? nav.offsetHeight : 0;
      const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: "smooth" });
    }
    document.addEventListener("click", onAnchorClick);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return null;
}

export function DragScroll({ targetSelector }: { targetSelector: string }) {
  useEffect(() => {
    const el = document.querySelector(targetSelector) as HTMLElement | null;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    function down(e: MouseEvent) {
      if (!el) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    }
    function leave() {
      isDown = false;
    }
    function up() {
      isDown = false;
    }
    function move(e: MouseEvent) {
      if (!isDown || !el) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4;
    }
    el.addEventListener("mousedown", down);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mouseup", up);
    el.addEventListener("mousemove", move);
    return () => {
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mouseup", up);
      el.removeEventListener("mousemove", move);
    };
  }, [targetSelector]);
  return null;
}
