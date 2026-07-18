/** The couple this site celebrates. Referenced across sections. */
export const COUPLE = {
  one: "Abhishek",
  two: "Neha",
  /** "Abhishek & Neha" */
  combined: "Abhishek & Neha",
} as const;

/** Section ids used for anchor navigation + scroll spy. */
export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "quotes", label: "Quotes" },
  { id: "shayari", label: "Shayari" },
  { id: "memories", label: "Memories" },
  { id: "reasons", label: "Why You" },
  { id: "love3d", label: "3D Love" },
  { id: "letter", label: "Letter" },
  { id: "countdown", label: "Forever" },
  { id: "form", label: "Message" },
] as const;

/** Anniversary target date for the countdown (next occurrence auto-computed). */
export const ANNIVERSARY = { month: 1, day: 14 }; // 14 February (month is 0-indexed)

/** Shared framer-motion viewport config for scroll reveals. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const;
