import { motion } from "motion/react";
import { Heart, Images, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { GradientText } from "@/components/GradientText";
import { scrollToId } from "@/hooks/useLenis";
import { COUPLE } from "@/utils/constants";

const TITLE = "Forever & Always";

/** Whole-title reveal — keeps the connected script flowing. */
function AnimatedTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="px-2 py-2 font-dancing text-6xl font-bold leading-[1.2] text-plum sm:text-7xl lg:text-8xl"
    >
      {TITLE}
    </motion.h1>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center"
    >
      {/* Light rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[conic-gradient(from_180deg_at_50%_-10%,transparent_0deg,rgba(255,214,231,0.5)_40deg,transparent_80deg,rgba(226,214,249,0.5)_140deg,transparent_180deg)] opacity-70 blur-2xl"
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-full flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-sm uppercase tracking-[0.4em] text-rose-gold-deep"
        >
          Our Love Story
        </motion.p>

        {/* Couple names — the star of the show */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 flex max-w-full flex-wrap items-center justify-center gap-x-2 py-3 font-names text-[2.6rem] leading-[1.4] sm:gap-x-4 sm:text-6xl lg:text-7xl"
        >
          <GradientText shimmer className="px-[0.18em]">
            {COUPLE.one}
          </GradientText>
          <Heart
            className="h-8 w-8 shrink-0 animate-pulse-heart text-rose drop-shadow-[0_4px_14px_rgba(247,168,184,0.7)] sm:h-12 sm:w-12"
            fill="currentColor"
          />
          <GradientText shimmer className="px-[0.18em]">
            {COUPLE.two}
          </GradientText>
        </motion.h2>

        <div className="mt-4">
          <AnimatedTitle />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="mt-6 max-w-xl font-cormorant text-lg text-ink-soft sm:text-2xl"
        >
          Two hearts, one story — written in stardust, sealed with a kiss, and
          destined to last <GradientText>forever</GradientText>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton onClick={() => scrollToId("story")} ariaLabel="Explore our love story">
            <Heart size={18} fill="currentColor" /> Explore Our Love
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => scrollToId("gallery")}
            ariaLabel="Open the love gallery"
          >
            <Images size={18} /> Love Gallery
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToId("story")}
        aria-label="Scroll to our story"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-soft"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </motion.span>
      </motion.button>
    </section>
  );
}
