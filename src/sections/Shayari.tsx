import { motion } from "motion/react";
import { Feather, Heart } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SHAYARI } from "@/data/shayari";
import { REVEAL_VIEWPORT } from "@/utils/constants";

/**
 * Section 5 — Love Shayari. Bilingual (Hindi + English) verses presented on
 * warm "paper" cards with an animated quill and heart decorations.
 */
export function Shayari() {
  return (
    <section id="shayari" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="दिल की बात"
        title="Love Shayari"
        highlight="Shayari"
        subtitle="Verses whispered from the heart — in two languages, one feeling."
      />

      <div className="mx-auto mt-14 grid max-w-none gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {SHAYARI.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
            whileHover={{ y: -8, rotate: i % 2 ? 0.8 : -0.8 }}
            className="group relative overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(145deg,#fffaf3,#fdeef4)] p-7 shadow-[0_18px_50px_-20px_rgba(173,92,130,0.45)]"
          >
            {/* Paper ruled sheen */}
            <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_31px,rgba(201,182,240,0.18)_32px)]" />
            {/* Heart corner */}
            <Heart
              className="absolute right-5 top-5 text-rose/40 transition-transform duration-500 group-hover:scale-125"
              size={26}
              fill="currentColor"
            />

            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-rose-gold-deep shadow-sm">
              <Feather size={20} className="transition-transform duration-500 group-hover:-rotate-12" />
            </span>

            <p className="relative mt-5 whitespace-pre-line font-dancing text-2xl leading-relaxed text-plum">
              {s.hindi}
            </p>
            <p className="relative mt-4 whitespace-pre-line font-cormorant text-lg italic leading-relaxed text-ink-soft">
              {s.english}
            </p>
            <p className="relative mt-4 text-right font-sans text-sm tracking-wide text-rose-gold-deep">
              {s.author}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
