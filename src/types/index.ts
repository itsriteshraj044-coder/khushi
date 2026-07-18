import type { ComponentType } from "react";

/** A single milestone in the love-story timeline. */
export interface StoryMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}

/** A curated love quote. */
export interface Quote {
  id: string;
  text: string;
  author: string;
}

/** A bilingual shayari (Hindi transliteration + English). */
export interface Shayari {
  id: string;
  hindi: string;
  english: string;
  author: string;
}

/** A flippable memory card. */
export interface Memory {
  id: string;
  date: string;
  title: string;
  location: string;
  moment: string;
  sticker: string;
  gradient: string;
  image: string;
}

/** A reason from the "Why I Love You" grid. */
export interface Reason {
  id: string;
  title: string;
  text: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
}

/** Love form data model. */
export interface LoveFormData {
  yourName: string;
  partnerName: string;
  email: string;
  specialDate: string;
  favoriteMemory: string;
  loveMessage: string;
  favoriteSong: string;
  relationshipGoal: string;
}
