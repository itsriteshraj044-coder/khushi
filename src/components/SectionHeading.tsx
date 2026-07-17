import { motion } from "motion/react";
import { GradientText } from "./GradientText";
import { REVEAL_VIEWPORT } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small script eyebrow line above the title. */
  eyebrow?: string;
  title: string;
  /** Word(s) inside the title to render with gradient emphasis. */
  highlight?: string;
  subtitle?: string;
  className?: string;
}

/** Consistent, animated section header used across every section. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  className,
}: SectionHeadingProps) {
  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) return title;
    const [before, after] = title.split(highlight);
    return (
      <>
        {before}
        <GradientText shimmer>{highlight}</GradientText>
        {after}
      </>
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto max-w-2xl text-center", className)}
    >
      {eyebrow && (
        <p className="font-dancing text-2xl text-rose-gold-deep sm:text-3xl">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-4xl font-semibold text-plum sm:text-5xl lg:text-6xl">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="mt-4 font-cormorant text-lg text-ink-soft sm:text-xl">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
