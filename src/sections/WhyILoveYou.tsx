import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { REASONS } from "@/data/reasons";
import type { Reason } from "@/types";
import { REVEAL_VIEWPORT } from "@/utils/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/** A card that tilts in 3D toward the cursor. */
function TiltCard({ reason, index }: { reason: Reason; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const Icon = reason.icon;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 18,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="perspective"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-3xl glass p-8"
      >
        {/* Gradient glow blob */}
        <span
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80 bg-linear-to-br",
            reason.gradient,
          )}
        />
        <span
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg bg-linear-to-br",
            reason.gradient,
          )}
          style={{ transform: "translateZ(40px)" }}
        >
          <Icon className="h-7 w-7" />
        </span>
        <h3
          className="relative mt-5 text-2xl font-semibold text-plum"
          style={{ transform: "translateZ(30px)" }}
        >
          {reason.title}
        </h3>
        <p
          className="relative mt-2 font-cormorant text-lg leading-relaxed text-ink-soft"
          style={{ transform: "translateZ(20px)" }}
        >
          {reason.text}
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Section 7 — Why I Love You. A luminous feature grid with 3D-tilt glass cards,
 * each celebrating one reason.
 */
export function WhyILoveYou() {
  return (
    <section id="reasons" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Reasons, endless reasons"
        title="Why I Love You"
        highlight="Love"
        subtitle="I could fill a library — here are just six of my favourites."
      />

      <div className="mx-auto mt-14 grid max-w-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((r, i) => (
          <TiltCard key={r.id} reason={r} index={i} />
        ))}
      </div>
    </section>
  );
}
