import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Heart, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { MEMORIES } from "@/data/memories";
import type { Memory } from "@/types";
import { REVEAL_VIEWPORT } from "@/utils/constants";
import { cn } from "@/lib/utils";

/**
 * A photo memory card. On hover (desktop) or tap (touch) a glowing, blurred
 * panel rises from the bottom to reveal the moment and its location.
 */
function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="aspect-[4/5]"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={`Memory: ${memory.title}. Reveal the moment.`}
        className="group relative block h-full w-full overflow-hidden rounded-3xl border border-white/60 text-left shadow-lg [transform:translateZ(0)] transition-shadow duration-500 hover:shadow-[0_24px_60px_-18px_rgba(173,92,130,0.55)]"
      >
        {/* Blurred fill so the full photo is never cropped, no ugly bars */}
        <img
          src={memory.image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl brightness-90"
        />
        {/* The actual, full photo — contained so nothing is cut off */}
        <img
          src={memory.image}
          alt={memory.title}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105",
            open && "scale-105",
          )}
        />

        {/* Always-visible title strip */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-plum-deep/70 to-transparent p-4 transition-opacity duration-500",
            open ? "opacity-0" : "group-hover:opacity-0",
          )}
        >
          <span className="text-2xl drop-shadow">{memory.sticker}</span>
          <div>
            <h3 className="text-lg font-semibold leading-tight text-white drop-shadow">
              {memory.title}
            </h3>
            <p className="inline-flex items-center gap-1 text-xs text-white/85">
              <Calendar size={12} /> {memory.date}
            </p>
          </div>
        </div>

        {/* Hover hint */}
        <span
          className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-plum backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-0" : "group-hover:opacity-0",
          )}
        >
          Hover to reveal
        </span>

        {/* ---------- Rising glow-blur panel ---------- */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 translate-y-full rounded-t-3xl border-t border-white/60 bg-white/55 p-5 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [box-shadow:0_-16px_50px_-6px_rgba(247,168,184,0.7)] group-hover:translate-y-0 group-focus-visible:translate-y-0",
            open && "!translate-y-0",
          )}
        >
          {/* Glowing top edge */}
          <span
            aria-hidden
            className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-rose to-transparent"
          />
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">{memory.sticker}</span>
            <h3 className="text-lg font-semibold text-plum">{memory.title}</h3>
          </div>
          <p className="flex items-start gap-1.5 font-cormorant text-base italic leading-relaxed text-plum sm:text-lg">
            <Heart size={16} className="mt-1 shrink-0 text-rose" fill="currentColor" />
            “{memory.moment}”
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-gold-deep">
            <MapPin size={14} /> {memory.location}
          </p>
        </div>
      </button>
    </motion.div>
  );
}

/**
 * Section 6 — Love Memories. Interactive flip cards revealing the story behind
 * each moment, its place and its date.
 */
export function Memories() {
  return (
    <section id="memories" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Little treasures"
        title="Love Memories"
        highlight="Memories"
        subtitle="Turn each card to unwrap a moment we tucked away in our hearts."
      />

      <div className="mx-auto mt-14 grid max-w-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MEMORIES.map((m, i) => (
          <MemoryCard key={m.id} memory={m} index={i} />
        ))}
      </div>
    </section>
  );
}
