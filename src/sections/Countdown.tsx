import { motion, AnimatePresence } from "motion/react";
import { Infinity as InfinityIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { GlassCard } from "@/components/GlassCard";
import { useCountdown } from "@/hooks/useCountdown";
import { ANNIVERSARY, COUPLE } from "@/utils/constants";

/** A single animated countdown unit whose number rolls when it changes. */
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
      <span className="mt-3 text-xs uppercase tracking-[0.25em] text-ink-soft sm:text-sm">
        {label}
      </span>
    </div>
  );
}

/**
 * Section 11 — Countdown. A glass card counting down to the next anniversary,
 * with numbers that roll as each second ticks.
 */
export function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(
    ANNIVERSARY.month,
    ANNIVERSARY.day,
  );

  return (
    <section id="countdown" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Every second counts"
        title="Countdown to Forever"
        highlight="Forever"
        subtitle={`Counting down the moments until ${COUPLE.combined} celebrate us, all over again.`}
      />

      <div className="mx-auto mt-14 max-w-none">
        <GlassCard gradientBorder className="flex flex-col items-center py-10">
          <div className="flex items-center gap-3 sm:gap-5">
            <Unit value={days} label="Days" />
            <span className="pb-8 text-3xl text-rose/50 sm:text-5xl">:</span>
            <Unit value={hours} label="Hours" />
            <span className="pb-8 text-3xl text-rose/50 sm:text-5xl">:</span>
            <Unit value={minutes} label="Minutes" />
            <span className="pb-8 text-3xl text-rose/50 sm:text-5xl">:</span>
            <Unit value={seconds} label="Seconds" />
          </div>
          <p className="mt-8 inline-flex items-center gap-2 font-cormorant text-lg text-ink-soft">
            <InfinityIcon size={18} className="text-rose-gold-deep" />
            and then a whole lifetime more
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
