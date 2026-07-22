/** The person this site celebrates. Referenced across sections. */
export const COUPLE = {
  /** Display name shown across the site. */
  name: "Khushi",
} as const;

/** Section ids used for anchor navigation + scroll spy. */
export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "quotes", label: "Memories" },
  { id: "shayari", label: "Shayari" },
  { id: "reasons", label: "Why You" },
  { id: "love3d", label: "Cinematic" },
  { id: "letter", label: "Letter" },
  { id: "countdown", label: "Forever" },
  { id: "form", label: "Message" },
] as const;

/** Anniversary target date for the countdown (next occurrence auto-computed). */
export const ANNIVERSARY = { month: 1, day: 14 }; // 14 February (month is 0-indexed)

/** The day it all began — 13 October 2019 (month is 0-indexed, so 9 = October). */
export const RELATIONSHIP_START = new Date(2019, 9, 13, 0, 0, 0);

/** Shared framer-motion viewport config for scroll reveals. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const;
