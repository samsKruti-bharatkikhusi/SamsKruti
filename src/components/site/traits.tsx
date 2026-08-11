import type { ReactNode } from "react";

type Trait = { title: string; desc: string; icon: ReactNode };

const TRAITS: Trait[] = [
  {
    title: "Calm",
    desc: "Not loud. Not urgent. Still — like a morning on the ghats.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 6 C16 6 12 11 12 16 C12 21 16 26 16 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M6 16 L26 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Curious",
    desc: "There is always more. Every city holds depths not yet seen.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 20 L27 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 10 L14 18 M10 14 L18 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Rooted",
    desc: "This is not a trend. It is a culture thousands of years deep.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4 L16 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 10 C8 10 12 8 16 10 C20 12 24 10 24 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M8 18 C8 18 12 16 16 18 C20 20 24 18 24 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Intentional",
    desc: "Every word, image, and object is chosen — not filled in.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 16 L15 20 L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Inclusive",
    desc: "For the diaspora, the urban Indian, the curious foreigner.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 16 C12 16 13.5 19 16 19 C18.5 19 20 16 20 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="12" cy="13" r="1" fill="currentColor" />
        <circle cx="20" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Observant",
    desc: "A guide that notices what others overlook.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 22 L14 14 L19 19 L26 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="10" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
];

export function TraitsGrid() {
  return (
    <div className="traits-grid">
      {TRAITS.map((t) => (
        <div key={t.title} className="trait-card">
          <div className="trait-icon">{t.icon}</div>
          <p className="trait-title">{t.title}</p>
          <p className="trait-desc">{t.desc}</p>
        </div>
      ))}
    </div>
  );
}
