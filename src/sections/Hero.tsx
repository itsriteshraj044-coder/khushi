import { useId } from "react";
import { motion } from "motion/react";
import { Heart, Images } from "lucide-react";
import { scrollToId } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { COUPLE } from "@/utils/constants";

/* ============================================================
 *  HERO — "Valentine" landing layout
 *  Deep magenta backdrop, couple photo blooming out of a white
 *  organic blob, paper-heart balloons, clouds & stripe hearts.
 *  Separate compositions for desktop and mobile.
 *  Existing content (names, title, tagline, CTAs) is preserved.
 * ============================================================ */

const PHOTO = "/image/Snapchat-849491874.jpg";

/* ---------------- Decorative pieces ---------------- */

/** A folded paper heart with a two-tone crease down the middle. */
function PaperHeart({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7d92" />
          <stop offset="1" stopColor="#e6394f" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b81f3d" />
          <stop offset="1" stopColor="#e0324a" />
        </linearGradient>
      </defs>
      <path
        d="M50 84 C 20 60, 0 40, 0 24 C 0 8, 14 0, 28 0 C 40 0, 47 8, 50 14 L 50 84 Z"
        fill={`url(#${id}-l)`}
      />
      <path
        d="M50 84 C 80 60, 100 40, 100 24 C 100 8, 86 0, 72 0 C 60 0, 53 8, 50 14 L 50 84 Z"
        fill={`url(#${id}-r)`}
      />
    </svg>
  );
}

/** A hot-air balloon made from a paper heart, its strings and a tiny basket. */
function HeartBalloon({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <PaperHeart className="w-full drop-shadow-[0_10px_22px_rgba(120,10,40,0.35)]" />
      <div className="relative mx-auto -mt-1 h-10 w-[46%]">
        <span className="absolute left-1/2 top-0 h-9 w-px -translate-x-[6px] rotate-[10deg] bg-white/60" />
        <span className="absolute left-1/2 top-0 h-9 w-px translate-x-[6px] -rotate-[10deg] bg-white/60" />
        <span className="absolute bottom-0 left-1/2 flex h-4 w-6 -translate-x-1/2 items-center justify-center rounded-b-md rounded-t-sm bg-[#e6394f] text-white shadow">
          <Heart size={9} fill="currentColor" />
        </span>
      </div>
    </div>
  );
}

/** Soft white cloud. */
function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden fill="currentColor">
      <path d="M18 52c-10 0-18-7-18-16s8-16 18-16c2-11 12-19 24-19 11 0 21 7 24 17 2-1 5-2 8-2 9 0 16 7 16 16 0 1 0 2-1 3 8 1 14 8 14 16 0 1-1 1-2 1H18z" />
    </svg>
  );
}

/** Outline heart filled with diagonal stripes — the airy background motif. */
function StripeHeart({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden>
      <defs>
        <pattern id={id} width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.4" />
        </pattern>
      </defs>
      <path
        d="M50 84 C 20 60, 0 40, 0 24 C 0 8, 14 0, 28 0 C 40 0, 47 8, 50 14 C 53 8, 60 0, 72 0 C 86 0, 100 8, 100 24 C 100 40, 80 60, 50 84 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

/** Little takeaway coffee cup with a heart — a template accent. */
function CoffeeCup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" className={className} aria-hidden>
      <path d="M6 14h28l-3 30a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3L6 14z" fill="#e6394f" />
      <rect x="4" y="10" width="32" height="6" rx="3" fill="#ff6b81" />
      <path
        d="M20 40c-5-4-8-6-8-9a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 3-3 5-8 9z"
        fill="#fff"
      />
    </svg>
  );
}

// A gently tall heart (bbox ≈ 0..100 x, 0..106 y, centre ≈ 50,51) — wider than a
// narrow heart yet still tall enough to fit a portrait photo with little zoom.
const HEART_FRAME =
  "M50 106 C 14 71, 0 48, 0 27 C 0 9, 16 0, 30 0 C 42 0, 48 8, 50 17 C 52 8, 58 0, 70 0 C 84 0, 100 9, 100 27 C 100 48, 86 71, 50 106 Z";

/**
 * The couple photo framed inside a heart, wrapped in a soft white border.
 * A white heart sits behind a slightly-smaller heart-clipped photo, so the
 * white rim reads as the frame. Built with an SVG clip to stay crisp at any size.
 */
function PhotoBlob({ className }: { className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <svg viewBox="0 0 100 108" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id={id}>
            {/* Inner heart — scaled down a touch to leave a white rim */}
            <path d={HEART_FRAME} transform="translate(50 51) scale(0.92) translate(-50 -51)" />
          </clipPath>
        </defs>
        {/* White heart frame */}
        <path d={HEART_FRAME} fill="white" />
        {/* Photo (960:1280) framed on her face — band placed so the decor above is
            just a thin strip, her face sits high, and the table/spoons stay out. */}
        <image
          href={PHOTO}
          x="-43"
          y="-62"
          width="185"
          height="247"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id})`}
        />
      </svg>
    </div>
  );
}

/* ---------------- Shared text content ---------------- */

function Eyebrow() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.7 }}
      className="text-sm font-semibold uppercase tracking-[0.35em] text-white/90"
    >
      Our Love Story
    </motion.p>
  );
}

function ScriptTitle({ className }: { className?: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`font-dancing font-bold leading-[1.05] text-white drop-shadow-[0_6px_20px_rgba(90,10,40,0.4)] ${className ?? ""}`}
    >
      Forever &amp; Always
    </motion.h1>
  );
}

function Names({ className }: { className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`flex flex-wrap items-center gap-x-3 font-names text-white/95 ${className ?? ""}`}
    >
      <Heart className="h-[0.7em] w-[0.7em] animate-pulse-heart text-[#ffd0da]" fill="currentColor" />
      <span>{COUPLE.name}</span>
    </motion.p>
  );
}

function Tagline({ className }: { className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className={`font-cormorant text-white/85 ${className ?? ""}`}
    >
      Two hearts, one story — written in stardust, sealed with a kiss, and destined
      to last forever.
    </motion.p>
  );
}

function Buttons({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className ?? ""}`}
    >
      <button
        onClick={() => scrollToId("story")}
        aria-label="Explore our love story"
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#b81f4f] shadow-[0_14px_30px_-10px_rgba(90,10,40,0.6)] transition hover:scale-[1.04] active:scale-95 sm:px-7"
      >
        <Heart size={16} fill="currentColor" /> Explore Our Love
      </button>
      <button
        onClick={() => scrollToId("quotes")}
        aria-label="See our memories"
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95 sm:px-7"
      >
        <Images size={16} /> Our Memories
      </button>
    </motion.div>
  );
}

/* ---------------- Hero ---------------- */

export function Hero() {
  const reduced = useReducedMotion();
  const float = (dy: number, dur: number) =>
    reduced ? undefined : { y: [0, dy, 0], transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[radial-gradient(125%_125%_at_66%_34%,#db5892_0%,#c83d78_30%,#a72a60_60%,#7d1c48_100%)] text-white"
    >
      {/* ================= DESKTOP ================= */}
      <div className="relative hidden min-h-[100svh] overflow-hidden lg:block">
        {/* Diagonal stripe hearts */}
        <StripeHeart className="pointer-events-none absolute left-[31%] top-[24%] w-36 text-white/25" />
        <StripeHeart className="pointer-events-none absolute right-[7%] bottom-[9%] w-52 text-white/18" />

        {/* Heart balloon dropping from the top, trailing a long string to a cup */}
        <div className="pointer-events-none absolute right-[26%] top-[-8%] flex w-40 flex-col items-center">
          <PaperHeart className="w-full drop-shadow-[0_18px_34px_rgba(120,10,40,0.45)]" />
          <span className="h-[23vh] w-px bg-white/45" />
          <CoffeeCup className="-mt-1 w-8" />
        </div>

        {/* Big centre paper heart */}
        <motion.div animate={float(-16, 6.8)} className="pointer-events-none absolute left-[45%] top-[56%] w-60">
          <PaperHeart className="w-full drop-shadow-[0_22px_40px_rgba(120,10,40,0.5)]" />
        </motion.div>

        {/* Heart hot-air balloons */}
        <motion.div animate={float(-16, 6)} className="pointer-events-none absolute left-[41%] top-[50%] w-24">
          <HeartBalloon className="w-full" />
        </motion.div>
        <motion.div animate={float(-22, 7.5)} className="pointer-events-none absolute left-[39%] bottom-[7%] w-16">
          <HeartBalloon className="w-full" />
        </motion.div>

        {/* Clouds */}
        <Cloud className="pointer-events-none absolute left-[53%] bottom-[19%] w-40 text-white" />

        {/* Couple photo framed inside a heart (left) — slightly smaller and
            tilted to the left for a playful, hand-placed feel. */}
        <div className="absolute left-[2%] top-1/2 w-[36%] -translate-y-1/2 -rotate-6 aspect-[100/106]">
          <PhotoBlob className="h-full w-full drop-shadow-[0_30px_80px_-30px_rgba(90,10,40,0.65)]" />
          <Cloud className="pointer-events-none absolute bottom-[6%] left-[2%] w-40 text-white drop-shadow" />
        </div>

        {/* Text block (centre-right) */}
        <div className="absolute right-[8%] top-1/2 z-10 max-w-[33%] -translate-y-1/2 text-right">
          <div className="flex flex-col items-end">
            <Eyebrow />
            <ScriptTitle className="mt-2 text-7xl xl:text-8xl" />
            <Names className="mt-4 justify-end text-3xl xl:text-4xl" />
            <Tagline className="mt-5 max-w-md text-right text-lg xl:text-xl" />
            <Buttons className="mt-8 justify-end" />
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 lg:hidden">
        {/* Decorative motifs */}
        <StripeHeart className="pointer-events-none absolute right-4 top-16 w-28 text-white/25" />
        <StripeHeart className="pointer-events-none absolute right-10 top-52 w-24 text-white/15" />
        <motion.div animate={float(-14, 6)} className="pointer-events-none absolute right-6 top-6 w-14">
          <HeartBalloon className="w-full" />
        </motion.div>

        {/* Text content (top) */}
        <div className="relative z-10 w-full max-w-full px-5 pt-20">
          <Eyebrow />
          <ScriptTitle className="mt-2 text-[min(10vw,3.25rem)] leading-[1.1]" />
          <Names className="mt-3 text-2xl" />
          <Tagline className="mt-4 max-w-[17rem] text-base" />
          <Buttons className="mt-7" />
        </div>

        {/* Couple photo framed inside a heart (bottom) with a heart balloon
            overlapping its right edge — mirroring the reference mobile panel.
            The heart is a normal flow item (not absolute) so it never overlaps
            the text and the section grows to fit it on short screens. */}
        <div className="relative mt-8 flex flex-1 items-end justify-center pt-4">
          <PhotoBlob className="aspect-[100/106] w-[76%] shrink-0 drop-shadow-[0_24px_50px_-24px_rgba(90,10,40,0.65)]" />
          <motion.div
            animate={float(-16, 7)}
            className="pointer-events-none absolute bottom-[20%] right-3 z-10 w-16"
          >
            <HeartBalloon className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
