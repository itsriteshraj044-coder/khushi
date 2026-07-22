import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatingHearts } from "@/components/FloatingHearts";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const AUTOPLAY_MS = 4500;

const pad = (n: number) => String(n).padStart(2, "0");

/** Our memories — real photos in /public/image, each with its own caption. */
const MEMORIES = [
  { src: "/image/1722507919399.jpg", caption: "Pretty in Pink" },
  { src: "/image/1722507919403.jpg", caption: "Cosy Corner" },
  { src: "/image/1722507919507.jpg", caption: "Green & Graceful" },
  { src: "/image/1722507919547.jpg", caption: "Café Daydream" },
  { src: "/image/1722507919992.jpg", caption: "Sunshine in Yellow" },
  { src: "/image/1724063069532.jpg", caption: "Elegant in Blue" },
  { src: "/image/1724063070005.jpg", caption: "Rosy Glow" },
  { src: "/image/1724063070066.jpg", caption: "Dreamy Blush" },
  { src: "/image/1725908635328.jpg", caption: "Festive Grace" },
  { src: "/image/1734420994722.jpg", caption: "Cutie in Blue" },
  { src: "/image/1734421340024.jpg", caption: "Floral Elegance" },
  { src: "/image/1734421340282.jpg", caption: "Sweet Shop Stroll" },
  { src: "/image/1734421340327.jpg", caption: "Magenta Charm" },
  { src: "/image/1739547172742.jpg", caption: "Teal Serenity" },
  { src: "/image/1739547172743.jpg", caption: "Up Close" },
  { src: "/image/1739547172760.jpeg", caption: "Royal Blue" },
  { src: "/image/1739547172761.jpeg", caption: "Blue Saree Beauty" },
  { src: "/image/1739547172768.jpeg", caption: "Draped in Blue" },
  { src: "/image/1739547172773.jpeg", caption: "Bold & Beautiful" },
  { src: "/image/Snapchat-317317445.jpg", caption: "Dinner Date Glow" },
  { src: "/image/Snapchat-849491874.jpg", caption: "Chin on Hands" },
  { src: "/image/Snapchat-854556369.jpg", caption: "That Sweet Smile" },
].map((m, i) => ({ id: `mem-${i + 1}`, ...m }));

/**
 * Section 4 — Our Memories. The same cinematic "spotlight" box as before, but
 * instead of rotating through quotes it now rotates through our photos, with a
 * glowing gradient orb, autoplay and manual controls.
 */
export function Quotes() {
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  // 1 = forward, -1 = backward — drives the slide direction of the animation.
  const [dir, setDir] = useState(1);

  const nextSlide = useCallback(() => {
    setDir(1);
    setIndex((i) => (i + 1) % MEMORIES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDir(-1);
    setIndex((i) => (i - 1 + MEMORIES.length) % MEMORIES.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!playing || reduced || MEMORIES.length <= 1) return;
    const t = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [playing, reduced, nextSlide, index]);

  const current = MEMORIES[index];

  return (
    <section
      id="quotes"
      className="section-pad relative overflow-hidden px-5 sm:px-8 lg:px-12"
    >
      <FloatingHearts count={6} />

      <SectionHeading
        eyebrow="Moments we treasure"
        title="Our Memories"
        highlight="Memories"
        subtitle="Every photo a heartbeat — the little moments we never want to forget."
      />

      {/* Spotlight card */}
      <div className="relative mx-auto mt-10 max-w-4xl">
        {/* Glowing orb behind the card */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,168,184,0.35),rgba(201,182,240,0.15)_45%,transparent_70%)] blur-2xl"
        />

        <div className="gradient-border relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-16 sm:py-12">
          {/* Small decorative camera mark */}
          <Camera
            aria-hidden
            className="absolute -left-2 -top-2 text-rose/20 sm:left-6 sm:top-6"
            size={80}
          />

          <div className="relative mx-auto max-w-sm">
            <AnimatePresence mode="wait" custom={dir}>
              {current && (
                <motion.figure
                  key={current.id}
                  custom={dir}
                  initial={{ opacity: 0, y: reduced ? 0 : dir * 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: reduced ? 0 : dir * -30, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/70 shadow-[0_24px_60px_-24px_rgba(173,92,130,0.5)]">
                    <img
                      src={current.src}
                      alt={current.caption}
                      loading="lazy"
                      className="block aspect-[4/5] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-6 flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-rose-gold/60" />
                    <span className="font-dancing text-2xl text-rose-gold-deep sm:text-3xl">
                      {current.caption}
                    </span>
                    <span className="h-px w-8 bg-rose-gold/60" />
                  </figcaption>
                </motion.figure>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="relative mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous memory"
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
              onClick={nextSlide}
              aria-label="Next memory"
              className="flex h-11 w-11 items-center justify-center rounded-full glass text-plum transition-transform hover:translate-x-0.5 hover:text-rose"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Counter + progress bar */}
        <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
          <span className="font-dancing text-2xl text-plum">{pad(index + 1)}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-plum/15">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)]"
              animate={{ width: `${((index + 1) / MEMORIES.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="font-dancing text-2xl text-rose-gold-deep">{pad(MEMORIES.length)}</span>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
          <Sparkles size={12} className="text-rose-gold-deep" />
          {MEMORIES.length} memories · tap the heart button to pause
        </p>
      </div>
    </section>
  );
}
