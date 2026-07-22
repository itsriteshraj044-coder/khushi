import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { COUPLE } from "@/utils/constants";

const LETTER = `My dearest ${COUPLE.name},

If I had a single wish, I would spend it on more time with you — more slow mornings, more shared silences, more of your laughter filling the quiet corners of my days.

You are my calm and my adventure, my home and my horizon. Thank you for choosing me, again and again.

Yours, completely and always,
♡`;

/** The handwritten letter with a typing reveal, shown after the seal breaks. */
function LetterBody() {
  const { output } = useTypingEffect(LETTER, { speed: 28, startDelay: 500 });
  return (
    <p className="whitespace-pre-line font-dancing text-xl leading-relaxed text-plum sm:text-2xl">
      {output}
      <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-rose align-middle" />
    </p>
  );
}

/**
 * Section 9 — Love Letter. A wax-sealed envelope that opens on click, lifts its
 * flap, and reveals a handwritten letter that types itself out.
 */
export function LoveLetter() {
  const [open, setOpen] = useState(false);

  return (
    <section id="letter" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Sealed with a kiss"
        title="A Love Letter"
        highlight="Love"
        subtitle="Some feelings are too big for a caption. Open when you're ready."
      />

      <div className="mx-auto mt-14 flex max-w-xl justify-center perspective">
        <AnimatePresence mode="wait">
          {!open ? (
            /* ---------- Sealed envelope ---------- */
            <motion.button
              key="envelope"
              onClick={() => setOpen(true)}
              aria-label="Open the love letter"
              className="relative h-64 w-full max-w-md preserve-3d"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -6 }}
            >
              {/* Envelope body */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#ffe3ee,#f6d8e6)] shadow-[0_20px_50px_-18px_rgba(173,92,130,0.55)]" />
              {/* Flap */}
              <div
                className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-[linear-gradient(160deg,#ffd0e0,#f2bfd4)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              {/* Wax seal */}
              <motion.span
                className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7a8b8,#c65f7b)] text-white shadow-lg"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart size={26} fill="currentColor" />
              </motion.span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-plum/60">
                Click to open
              </span>
            </motion.button>
          ) : (
            /* ---------- Opened letter ---------- */
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 60, rotateX: -25 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full rounded-2xl border border-white/70 bg-[linear-gradient(160deg,#fffaf3,#fdeef4)] p-8 shadow-[0_24px_60px_-24px_rgba(173,92,130,0.5)] sm:p-10"
            >
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[repeating-linear-gradient(transparent,transparent_33px,rgba(201,182,240,0.16)_34px)]" />
              <div className="relative">
                <LetterBody />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="relative mt-8 inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm text-plum"
              >
                <Heart size={14} className="text-rose" fill="currentColor" /> Seal it again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
