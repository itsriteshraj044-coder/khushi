import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { COUPLE } from "@/utils/constants";

interface LetterGateProps {
  /** Called once the visitor chooses to enter the website. */
  onEnter: () => void;
}

const LETTER = `My dearest ${COUPLE.name},

Before you step into our little world, pause here with me for a moment.

Every picture, every word, every memory ahead was gathered with one heart in mind — yours. You are my calm and my adventure, my home and my horizon.

So take my hand, and let me walk you through our story.

Forever yours,
♡`;

const PETAL_COLORS = ["#ffb6ce", "#e2d6f9", "#ffdfc4", "#f7a8b8", "#fff7f0"];

/** The handwritten letter that types itself out; reveals the button when done. */
function LetterBody({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const { output, done } = useTypingEffect(LETTER, {
    speed: 26,
    startDelay: 450,
    enabled: !reduced,
  });

  // Reveal the button once typing finishes (or immediately for reduced motion).
  useEffect(() => {
    if (reduced || done) onDone();
  }, [reduced, done, onDone]);

  // In reduced-motion mode, skip the typing and show everything at once.
  if (reduced) {
    return (
      <p className="whitespace-pre-line font-dancing text-xl leading-relaxed text-plum sm:text-2xl">
        {LETTER}
      </p>
    );
  }

  return (
    <p className="whitespace-pre-line font-dancing text-xl leading-relaxed text-plum sm:text-2xl">
      {output}
      <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-rose align-middle" />
    </p>
  );
}

/**
 * The intro gate shown right after the splash screen. A sealed love letter waits
 * on a soft romantic backdrop; opening it types out a personal note, then reveals
 * an "Explore Love Journey" button that finally lets the visitor into the site.
 */
export function LetterGate({ onEnter }: LetterGateProps) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<"sealed" | "reading">("sealed");
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);

  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 9 + Math.random() * 15,
        delay: Math.random() * 5,
        duration: 7 + Math.random() * 6,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    [],
  );

  const enter = () => {
    setExiting(true);
    // Start our song here — inside the tap — so mobile browsers allow it to
    // play unmuted. The MusicPlayer listens for this event.
    window.dispatchEvent(new Event("play-our-song"));
    // Let the fade-out play before handing off to the website.
    window.setTimeout(onEnter, reduced ? 0 : 700);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-[linear-gradient(150deg,#fff5f8,#ffe4ee_40%,#f0e8ff_72%,#fff0e6)]"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.7, ease: "easeInOut" }}
    >
      {/* Falling petals ambience */}
      {!reduced &&
        petals.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 animate-fall"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.7,
              background: p.color,
              borderRadius: "60% 40% 50% 50% / 60% 60% 40% 40%",
              animationDelay: `-${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: 0.6,
            }}
          />
        ))}

      <div className="relative flex min-h-full items-center justify-center px-5 py-16 sm:px-8">
        <AnimatePresence mode="wait">
          {stage === "sealed" ? (
            /* ---------------- Sealed envelope ---------------- */
            <motion.div
              key="sealed"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-wine/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={14} className="text-rose" /> A letter for you
              </motion.p>
              <h1 className="mb-10 flex items-center justify-center gap-3 font-names text-5xl leading-[1.2] text-gradient sm:text-6xl">
                <Heart className="h-8 w-8 shrink-0 animate-pulse-heart text-rose sm:h-10 sm:w-10" fill="currentColor" />
                {COUPLE.name}
              </h1>

              <motion.button
                onClick={() => setStage("reading")}
                aria-label="Open the love letter"
                className="relative h-60 w-[19rem] max-w-full sm:h-64 sm:w-[24rem]"
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Envelope body */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#ffe3ee,#f6d8e6)] shadow-[0_24px_60px_-18px_rgba(173,92,130,0.55)]" />
                {/* Flap */}
                <div
                  className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-[linear-gradient(160deg,#ffd0e0,#f2bfd4)]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
                {/* Wax seal */}
                <motion.span
                  className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7a8b8,#c65f7b)] text-white shadow-lg"
                  animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart size={26} fill="currentColor" />
                </motion.span>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-plum/60">
                  Click to open
                </span>
              </motion.button>
            </motion.div>
          ) : (
            /* ---------------- Opened letter ---------------- */
            <motion.div
              key="reading"
              className="flex w-full max-w-xl flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ rotateX: reduced ? 0 : -22 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full rounded-2xl border border-white/70 bg-[linear-gradient(160deg,#fffaf3,#fdeef4)] p-8 shadow-[0_28px_70px_-24px_rgba(173,92,130,0.5)] sm:p-10"
              >
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[repeating-linear-gradient(transparent,transparent_33px,rgba(201,182,240,0.16)_34px)]" />
                <div className="relative">
                  <LetterBody reduced={reduced} onDone={() => setShowButton(true)} />
                </div>
              </motion.div>

              {/* Explore button — appears once the letter has finished */}
              <AnimatePresence>
                {(showButton || reduced) && (
                  <motion.button
                    key="explore"
                    onClick={enter}
                    initial={{ opacity: 0, y: 18, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(120deg,#f7a8b8,#e8b298,#c9b6f0)] px-8 py-4 font-sans text-base font-medium tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(173,92,130,0.6)]"
                  >
                    <Heart
                      size={20}
                      fill="currentColor"
                      className="animate-pulse-heart drop-shadow"
                    />
                    Explore Love Journey
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
