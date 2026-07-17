import { motion, useScroll, useSpring } from "motion/react";

/** A slim rose-gold progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-[linear-gradient(90deg,#f7a8b8,#e8b298,#c9b6f0)]"
    />
  );
}
