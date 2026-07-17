import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatingHearts } from "@/components/FloatingHearts";
import { GALLERY } from "@/data/gallery";
import { REVEAL_VIEWPORT } from "@/utils/constants";


/**
 * Section 3 — Love Gallery. A masonry grid of gradient portraits with 3D tilt,
 * glow and zoom on hover, plus a full-screen lightbox with prev/next.
 */
export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % GALLERY.length)),
    [],
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length,
      ),
    [],
  );

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, next, prev]);

  return (
    <section id="gallery" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <FloatingHearts count={7} />

      <SectionHeading
        eyebrow="Frozen in time"
        title="Love Gallery"
        highlight="Gallery"
        subtitle="A handful of moments we would happily relive a thousand times."
      />

      <div className="mx-auto mt-14 max-w-none columns-2 gap-4 sm:columns-3 sm:gap-6 lg:columns-4 xl:columns-5 2xl:columns-6">
        {GALLERY.map((item, i) => (
          <motion.button
            key={item.id}
            layoutId={`portrait-${item.id}`}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
            whileHover={{ scale: 1.03 }}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl shadow-[0_14px_40px_-16px_rgba(173,92,130,0.5)] ring-1 ring-white/50 sm:mb-6"
            aria-label={`Open ${item.caption}`}
          >
            <img
              src={item.src}
              alt={item.caption}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Glow + overlay */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-rose/0 transition-all duration-500 group-hover:ring-rose/70" />
            {/* Heart pop */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Heart size={22} className="text-white drop-shadow" fill="currentColor" />
            </span>
            <span className="absolute bottom-3 left-3 translate-y-4 font-dancing text-lg text-white opacity-0 drop-shadow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-plum-deep/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              onClick={close}
              aria-label="Close preview"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full glass text-white"
            >
              <X size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full glass text-white sm:left-8"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              layoutId={`portrait-${GALLERY[active].id}`}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY[active].src}
                alt={GALLERY[active].caption}
                className="max-h-[80vh] w-full object-contain"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-4 py-1.5 font-dancing text-xl text-white backdrop-blur-sm">
                {GALLERY[active].caption}
              </span>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full glass text-white sm:right-8"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
