import type { GalleryItem } from "@/types";

/** Path to a photo in /public/image. */
const img = (n: number) => `/image/love-${String(n).padStart(2, "0")}.jpg`;

const CAPTIONS = [
  "Golden Hour",
  "Hand in Hand",
  "That Laugh",
  "Slow Dance",
  "Morning Light",
  "Just Us",
  "The Getaway",
  "Forehead Kiss",
  "City Lights",
  "Quiet Sunday",
  "Our Little World",
  "Sunset Hues",
  "Forever You",
  "Stolen Moment",
  "My Favourite View",
];

const SPANS: GalleryItem["span"][] = [
  "tall", "short", "short", "wide", "tall",
  "short", "short", "tall", "wide", "short",
  "tall", "short", "short", "wide", "tall",
];

/** All 15 couple photos, wired into the masonry gallery. */
export const GALLERY: GalleryItem[] = CAPTIONS.map((caption, i) => ({
  id: `g${i + 1}`,
  caption,
  span: SPANS[i],
  src: img(i + 1),
}));
