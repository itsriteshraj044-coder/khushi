import { Suspense, lazy } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { SectionHeading } from "@/components/SectionHeading";

const LoveScene = lazy(() =>
  import("@/three/LoveScene").then((m) => ({ default: m.LoveScene })),
);

/**
 * Section 8 — 3D Love. An interactive Three.js scene of floating hearts, stars
 * and sparkles. Mounted only once scrolled into view to save resources.
 */
export function Love3D() {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  return (
    <section id="love3d" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="A universe of us"
        title="3D Love"
        highlight="Love"
        subtitle="Drag, spin and drift through a little galaxy built of hearts."
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto mt-12 h-[460px] max-w-none overflow-hidden rounded-[2rem] glass-deep sm:h-[560px] xl:h-[640px]"
      >
        <div className="absolute inset-0">
          {inView && (
            <Suspense fallback={null}>
              <LoveScene variant="full" className="h-full w-full" />
            </Suspense>
          )}
        </div>
        <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/40 px-4 py-1.5 text-xs tracking-[0.2em] text-plum uppercase backdrop-blur-sm">
          Drag to explore
        </span>
      </motion.div>
    </section>
  );
}
