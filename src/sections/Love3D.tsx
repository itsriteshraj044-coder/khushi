import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";

const VIDEO = "/video/love-3d.mp4";

/**
 * Section 8 — 3D Love. The interactive Three.js heart galaxy has been replaced
 * with a cinematic looping video inside the same glass box.
 */
export function Love3D() {
  return (
    <section id="love3d" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="A universe of us"
        title="3D Love"
        highlight="Love"
        subtitle="A little cinematic world, spun just for the two of us."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto mt-12 h-[460px] max-w-none overflow-hidden rounded-[2rem] glass-deep sm:h-[560px] xl:h-[640px]"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </motion.div>
    </section>
  );
}
