import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { GlassCard } from "@/components/GlassCard";
import { STORY } from "@/data/story";
import { REVEAL_VIEWPORT } from "@/utils/constants";

/**
 * Section 2 — Our Love Story. A vertical timeline of glass cards that alternate
 * sides on desktop and stack cleanly on mobile, each revealing on scroll.
 */
export function LoveStory() {
  return (
    <section id="story" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="How it began"
        title="Our Love Story"
        highlight="Love"
        subtitle="Six little chapters of a story we never want to end."
      />

      <div className="relative mx-auto mt-16 max-w-none">
        {/* Center spine (desktop) */}
        <div
          aria-hidden
          className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-rose/40 via-lavender-deep/50 to-peach/40 md:left-1/2 md:-translate-x-1/2"
        />

        <ul className="space-y-10 md:space-y-16">
          {STORY.map((item, i) => {
            const Icon = item.icon;
            const left = i % 2 === 0;
            return (
              <li
                key={item.id}
                className="relative pl-14 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
              >
                {/* Node */}
                <span
                  className="absolute left-4 top-2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-lg md:left-1/2"
                  style={{ background: item.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, x: left ? -40 : 40, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className={
                    left
                      ? "md:col-start-1 md:text-right"
                      : "md:col-start-2 md:text-left"
                  }
                >
                  <GlassCard className="group">
                    <p className="font-dancing text-xl text-rose-gold-deep">
                      {item.date}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-plum">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-cormorant text-lg leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </GlassCard>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
