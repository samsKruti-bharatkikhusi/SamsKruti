"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";

const MODES: { key: ThemeMode; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

export const THEME_KEY = "sk-theme";
const CHANGE_EVENT = "sk-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* private mode — fall through to system */
  }
  return "system";
}

// The server cannot know the preference, so it renders the neutral
// state; the blocking script in the layout has already stamped the
// real theme on <html> before paint, so nothing flashes.
const getServerSnapshot = (): ThemeMode => "system";

/**
 * Light and dark are designed peers, not a default and a fallback —
 * preference is genuinely split, so we respect the OS and let him
 * override it once, permanently.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const apply = useCallback((next: ThemeMode) => {
    const root = document.documentElement;
    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <div
      className={`sk-theme-toggle${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Theme"
    >
      {MODES.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => apply(m.key)}
          aria-pressed={mode === m.key}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Runs synchronously before first paint, so the chosen theme is already
 * stamped on <html> when the page renders. `next/script` with
 * beforeInteractive does not block paint, which is why this is a plain
 * inline script placed first in <body>.
 */
export function ThemeScript() {
  const js = `(function(){try{var m=localStorage.getItem("${THEME_KEY}");if(m==="light"||m==="dark"){document.documentElement.setAttribute("data-theme",m);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
