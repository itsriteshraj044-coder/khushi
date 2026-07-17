# Forever & Always — A Luxury Romantic Love Story

A single-page, cinematic couple website with a luxury Valentine's aesthetic —
soft pink, rose gold and lavender, glassmorphism, animated gradient mesh, 3D
hearts and rich scroll-driven motion. Built to feel like an expensive wedding
invitation with Apple-grade animation polish.

## Tech Stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **Motion** (Framer Motion) — reveals, magnetic buttons, layout transitions
- **GSAP** — available for timeline work
- **Three.js** via **@react-three/fiber** + **@react-three/drei** — 3D hearts, sparkles, stars
- **Lenis** — smooth scrolling
- **Swiper** — quote coverflow carousel
- **react-intersection-observer** — lazy-mount the 3D scene
- **canvas-confetti** — heart explosion on form submit
- **lucide-react** + **react-icons** — iconography
- **Web Audio API** — synthesised ambient background music (no audio file)

## Sections

Loader → Hero (3D heart) → Our Love Story (timeline) → Love Gallery (masonry +
lightbox) → Love Quotes (carousel) → Love Shayari (bilingual) → Love Memories
(flip cards) → Why I Love You (3D-tilt grid) → 3D Love (interactive scene) →
Love Letter (wax-sealed envelope) → Countdown → Love Form → Footer.

Global systems: animated gradient background, cursor glow, scroll-progress bar,
scroll-spy dot nav, and a floating music player.

## Architecture

```
src/
  components/   # reusable UI + global systems (GlassCard, MagneticButton, background…)
  sections/     # the 12 page sections + loader + footer
  three/        # Three.js scene, heart geometry & mesh
  hooks/        # useLenis, useTypingEffect, useCountdown, useAmbientAudio, …
  data/         # curated original content (story, quotes, shayari, memories…)
  types/        # shared TypeScript models
  utils/        # constants
  lib/          # cn() class helper
```

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Notes

- **Accessibility**: full `prefers-reduced-motion` support (animations, 3D and
  cursor glow all collapse gracefully), ARIA labels, keyboard-navigable
  lightbox, and semantic landmarks.
- **Performance**: below-the-fold sections and the Three.js scene are lazy /
  code-split; the 3D canvas mounts only when scrolled into view; DPR is capped.
- **Content** is original and royalty-free. Gallery "photos" are generated
  on-theme gradient portraits — swap `GradientPortrait` for real `<img>` tags
  when you have your own pictures.

## Deploy

Ready for Vercel — it's a static Vite build. Push the repo and import, or:

```bash
npm i -g vercel && vercel
```
