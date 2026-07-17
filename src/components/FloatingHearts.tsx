import { useMemo } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

/**
 * A localized cluster of gently floating hearts, absolutely positioned to fill
 * its nearest relative parent. Decorative only.
 */
export function FloatingHearts({ count = 8, className }: FloatingHeartsProps) {
  const reduced = useReducedMotion();

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 12 + Math.random() * 20,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 4,
        hue: [340, 20, 280, 350][i % 4],
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute"
          style={{ left: `${h.left}%`, top: `${h.top}%` }}
          animate={{ y: [0, -24, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.15, 1] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart
            fill="currentColor"
            style={{
              width: h.size,
              height: h.size,
              color: `hsl(${h.hue} 85% 75%)`,
            }}
          />
        </motion.span>
      ))}
    </div>
  );
}
