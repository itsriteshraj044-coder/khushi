import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CoupleSilhouette } from "@/components/CoupleSilhouette";
import { COUPLE } from "@/utils/constants";

interface LoaderProps {
  onComplete: () => void;
}

const PETAL_COLORS = ["#ffb6ce", "#e2d6f9", "#ffdfc4", "#f7a8b8", "#fff7f0"];

// A heart path (bbox centre ≈ 12,12) used for the iris reveal.
const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// Reveal timing
const CONTENT_FADE = 0.4;
const IRIS_DELAY = 0.45;
const IRIS_DURATION = 1.2;

/**
 * Cinematic splash screen that flows directly into a heart-shaped iris reveal —
 * the pink cover itself blooms open through a growing heart window, so the site
 * is only ever seen fully (never a faded flash between splash and reveal).
 */
export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealing">("loading");
  const reduced = useReducedMotion();
  const { output } = useTypingEffect("Every Love Story is Beautiful…", {
    speed: 55,
    startDelay: 300,
  });

  // Keep the latest onComplete without re-triggering the completion timers.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const petals = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 6,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    [],
  );

  // Deterministic, time-based progress — always fills in ~2.2s (no random stall).
  useEffect(() => {
    const DURATION = 2200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / DURATION) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Begin the reveal shortly after the bar fills (typing has finished by then).
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setPhase("revealing"), 500);
      return () => clearTimeout(t);
    }
  }, [progress]);

  // Finish once the reveal completes (uses a ref so App re-renders don't reset it).
  useEffect(() => {
    if (phase !== "revealing") return;
    const total = reduced ? 300 : (CONTENT_FADE + IRIS_DELAY + IRIS_DURATION + 0.2) * 1000;
    const t = setTimeout(() => onCompleteRef.current(), total);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  // Safety net: never let the splash get stuck — always finish within 6s.
  useEffect(() => {
    const hard = setTimeout(() => onCompleteRef.current(), 6000);
    return () => clearTimeout(hard);
  }, []);

  const revealing = phase === "revealing";

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* ---------- Pink cover with a heart-shaped iris window ---------- */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff5f8" />
            <stop offset="0.35" stopColor="#ffe4ee" />
            <stop offset="0.7" stopColor="#f0e8ff" />
            <stop offset="1" stopColor="#fff0e6" />
          </linearGradient>
          <mask id="loaderIris">
            <rect x="-100" y="-100" width="300" height="300" fill="white" />
            <g transform="translate(38 38)">
              <motion.path
                d={HEART_PATH}
                fill="black"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ scale: 0 }}
                animate={{ scale: revealing && !reduced ? 18 : 0 }}
                transition={{
                  duration: IRIS_DURATION,
                  delay: IRIS_DELAY,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            </g>
          </mask>
        </defs>
        <rect
          x="-100"
          y="-100"
          width="300"
          height="300"
          fill="url(#loaderGrad)"
          mask="url(#loaderIris)"
        />
      </svg>

      {/* ---------- Splash content (fades out just before the iris opens) ---------- */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={{ opacity: revealing ? 0 : 1 }}
        transition={{ duration: CONTENT_FADE, ease: "easeInOut" }}
      >
        {/* Falling petals */}
        {petals.map((p) => (
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
              opacity: 0.7,
            }}
          />
        ))}

        {/* Couple silhouette + heartbeat */}
        <div className="relative mb-8 h-32 w-32 sm:h-40 sm:w-40">
          <motion.div
            className="absolute inset-0 text-plum"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <CoupleSilhouette />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 12 }}
          >
            <Heart
              className="animate-pulse-heart text-rose drop-shadow-[0_6px_18px_rgba(247,168,184,0.7)]"
              fill="currentColor"
              size={34}
            />
          </motion.div>
        </div>

        {/* Couple names */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mb-4 flex flex-wrap items-center justify-center gap-x-2.5 py-1 font-names text-4xl leading-[1.3] sm:gap-x-4 sm:text-5xl"
        >
          <span className="text-gradient">{COUPLE.one}</span>
          <Heart
            className="h-6 w-6 shrink-0 animate-pulse-heart text-rose sm:h-8 sm:w-8"
            fill="currentColor"
          />
          <span className="text-gradient">{COUPLE.two}</span>
        </motion.p>

        {/* Typing tagline */}
        <p className="min-h-[2.5rem] px-6 text-center font-cormorant text-xl italic text-ink-soft sm:text-2xl">
          {output}
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-rose align-middle" />
        </p>

        {/* Progress */}
        <div className="mt-10 w-56 sm:w-72">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/50">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f7a8b8,#e8b298,#c9b6f0)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <p className="mt-3 text-center font-sans text-xs tracking-[0.3em] text-ink-soft">
            {Math.round(progress)}%
          </p>
        </div>
      </motion.div>
    </div>
  );
}
