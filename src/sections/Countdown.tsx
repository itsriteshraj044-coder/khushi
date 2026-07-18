import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { GlassCard } from "@/components/GlassCard";
import { useElapsedSince } from "@/hooks/useCountdown";
import { RELATIONSHIP_START, COUPLE } from "@/utils/constants";

/** A single animated time unit whose number rolls when it changes. */
function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/50 shadow-inner sm:h-28 sm:w-24">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl font-bold text-gradient sm:text-6xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft sm:text-sm">
        {label}
      </span>
    </div>
  );
}

/**
 * Section 11 — Our journey so far. A glass card counting *up* from the day it
 * all began (13 Oct 2019), with numbers that roll as each second ticks.
 */
export function Countdown() {
  const { years, months, days, hours, minutes, seconds } =
    useElapsedSince(RELATIONSHIP_START);

  return (
    <section id="countdown" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Since 13 October 2019"
        title="Us, So Far"
        highlight="So Far"
        subtitle={`Every second of ${COUPLE.combined} since the day it all began — and still counting.`}
      />

      <div className="mx-auto mt-14 max-w-none">
        <GlassCard gradientBorder className="flex flex-col items-center py-10">
          <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-4">
            <Unit value={years} label="Years" />
            <Unit value={months} label="Months" />
            <Unit value={days} label="Days" />
            <Unit value={hours} label="Hours" />
            <Unit value={minutes} label="Minutes" />
            <Unit value={seconds} label="Seconds" />
          </div>
          <p className="mt-8 inline-flex items-center gap-2 font-cormorant text-lg text-ink-soft">
            <Heart size={16} className="text-rose" fill="currentColor" />
            and forever more to go
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
