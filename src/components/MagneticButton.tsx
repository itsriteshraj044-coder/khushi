import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost";
  ariaLabel?: string;
  type?: "button" | "submit";
}

/**
 * A premium magnetic button: it subtly follows the cursor and springs back.
 * Magnetism is disabled when the user prefers reduced motion.
 */
export function MagneticButton({
  children,
  onClick,
  className,
  variant = "primary",
  ariaLabel,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-shadow duration-500 sm:text-base",
        variant === "primary"
          ? "text-white shadow-[0_12px_40px_-8px_rgba(217,122,140,0.6)]"
          : "text-plum",
        className,
      )}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(120deg,#f7a8b8,#e8b298,#c9b6f0)] bg-[length:200%_200%] animate-gradient"
        />
      )}
      {variant === "ghost" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full glass"
        />
      )}
      {children}
    </motion.button>
  );
}
