import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Quote as QuoteIcon,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  Globe,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatingHearts } from "@/components/FloatingHearts";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const AUTOPLAY_MS = 6000;

/**
 * Section 4 — Love Quotes. A cinematic "spotlight" that fetches love quotes
 * live from the internet (QuoteSlate) and rotates through them one at a time,
 * with a glowing gradient orb, autoplay, manual controls and a refresh button.
 * Falls back to curated originals when offline.
 */
export function Quotes() {
  const { quotes, loading, live, refetch } = useLoveQuotes();
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  // 1 = forward, -1 = backward — drives the slide direction of the animation.
  const [dir, setDir] = useState(1);

  // Reset to the first quote whenever the underlying set changes (e.g. refetch).
  useEffect(() => setIndex(0), [quotes]);

  const go = useCallback(
    (next: number) => {
      setDir(next > index || (index === quotes.length - 1 && next === 0) ? 1 : -1);
      setIndex((next + quotes.length) % quotes.length);
    },
    [index, quotes.length],
  );

  const nextQuote = useCallback(() => {
    setDir(1);
    setIndex((i) => (i + 1) % quotes.length);
  }, [quotes.length]);

  const prevQuote = useCallback(() => {
    setDir(-1);
    setIndex((i) => (i - 1 + quotes.length) % quotes.length);
  }, [quotes.length]);

  // Autoplay
  useEffect(() => {
    if (!playing || reduced || quotes.length <= 1) return;
    const t = setInterval(nextQuote, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [playing, reduced, quotes.length, nextQuote, index]);

  const current = quotes[index];

  return (
    <section
      id="quotes"
      className="section-pad relative overflow-hidden px-5 sm:px-8 lg:px-12"
    >
      <FloatingHearts count={6} />

      <SectionHeading
        eyebrow="Words of the heart"
        title="Love Quotes"
        highlight="Love"
        subtitle="Timeless words about love — gathered fresh from around the world."
      />

      {/* Live / curated badge + refresh */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            live
              ? "bg-rose/15 text-rose-gold-deep"
              : "bg-lavender/40 text-plum"
          }`}
        >
          <Globe size={12} className={live ? "" : "opacity-60"} />
          {live ? "Live from the web" : "Curated collection"}
        </span>
        <button
          onClick={() => void refetch()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-medium text-plum transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          aria-label="Fetch new quotes"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading…" : "New quotes"}
        </button>
      </div>

      {/* Spotlight card */}
      <div className="relative mx-auto mt-10 max-w-4xl">
        {/* Glowing orb behind the card */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,168,184,0.35),rgba(201,182,240,0.15)_45%,transparent_70%)] blur-2xl"
        />

        <div className="gradient-border relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-16 sm:py-20">
          {/* Big decorative quote mark */}
          <QuoteIcon
            aria-hidden
            className="absolute -left-2 -top-2 text-rose/20 sm:left-6 sm:top-6"
            size={90}
            fill="currentColor"
          />

          <div className="relative mx-auto min-h-[220px] max-w-2xl text-center sm:min-h-[200px]">
            <AnimatePresence mode="wait" custom={dir}>
              {current && (
                <motion.blockquote
                  key={current.id}
                  custom={dir}
                  initial={{ opacity: 0, y: reduced ? 0 : dir * 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: reduced ? 0 : dir * -30, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-cormorant text-2xl italic leading-relaxed text-plum sm:text-4xl sm:leading-snug">
                    “{current.text}”
                  </p>
                  <footer className="mt-6 flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-rose-gold/60" />
                    <cite className="font-dancing text-2xl not-italic text-rose-gold-deep sm:text-3xl">
                      {current.author}
                    </cite>
                    <span className="h-px w-8 bg-rose-gold/60" />
                  </footer>
                </motion.blockquote>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="relative mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prevQuote}
              aria-label="Previous quote"
              className="flex h-11 w-11 items-center justify-center rounded-full glass text-plum transition-transform hover:-translate-x-0.5 hover:text-rose"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause autoplay" : "Play autoplay"}
              aria-pressed={playing}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow-md transition-transform hover:scale-105"
            >
              {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            <button
              onClick={nextQuote}
              aria-label="Next quote"
              className="flex h-11 w-11 items-center justify-center rounded-full glass text-plum transition-transform hover:translate-x-0.5 hover:text-rose"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {quotes.map((q, i) => (
            <button
              key={q.id}
              onClick={() => go(i)}
              aria-label={`Go to quote ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)]"
                  : "w-2 bg-plum/20 hover:bg-rose/50"
              }`}
            />
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
          <Sparkles size={12} className="text-rose-gold-deep" />
          {quotes.length} quotes · tap the heart button to pause
        </p>
      </div>
    </section>
  );
}
