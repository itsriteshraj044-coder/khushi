import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * The site-wide dreamy backdrop: an animated gradient mesh, drifting colour
 * blobs, soft bokeh, and slow floating hearts. Fixed behind all content.
 *
 * On phones this collapses to a *static* gradient with a couple of soft (but
 * un-animated) blobs — animating large blurred layers is the main cause of the
 * lag and flicker on mobile GPUs, so we simply don't.
 */
export function AnimatedBackground() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 22,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 12,
        opacity: 0.12 + Math.random() * 0.25,
      })),
    [],
  );

  const bokeh = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 40 + Math.random() * 120,
        delay: Math.random() * 6,
      })),
    [],
  );

  // Phones: a static gradient + a couple of un-animated blobs. Animating large
  // blurred layers is the main cause of mobile lag/flicker, so we skip it.
  if (mobile) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(150deg,#fff5f8,#ffe9f1,#f3ecff,#fff1e8)]"
      >
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-rose/20 blur-[60px]" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-lavender-deep/20 blur-[60px]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Animated gradient mesh base */}
      <div className="absolute inset-0 bg-[linear-gradient(130deg,#fff5f8,#ffe9f1,#f3ecff,#fff1e8,#fdeef6)] bg-[length:300%_300%] animate-gradient" />

      {/* Moving colour blobs */}
      <div className="absolute -left-24 top-10 h-[38vmax] w-[38vmax] rounded-full bg-rose/30 blur-[80px] animate-blob" />
      <div className="absolute right-[-10%] top-1/3 h-[34vmax] w-[34vmax] rounded-full bg-lavender-deep/30 blur-[90px] animate-blob [animation-delay:-6s]" />
      <div className="absolute bottom-[-10%] left-1/3 h-[32vmax] w-[32vmax] rounded-full bg-peach/40 blur-[80px] animate-blob [animation-delay:-12s]" />

      {/* Soft bokeh dots */}
      {bokeh.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full bg-white/40 blur-2xl animate-float-slow"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            animationDelay: `-${b.delay}s`,
          }}
        />
      ))}

      {/* Floating hearts */}
      {!reduced &&
        hearts.map((h) => (
          <Heart
            key={h.id}
            className="absolute text-rose animate-fall"
            fill="currentColor"
            style={{
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              opacity: h.opacity,
              animationDelay: `-${h.delay}s`,
              animationDuration: `${h.duration}s`,
            }}
          />
        ))}
    </div>
  );
}
