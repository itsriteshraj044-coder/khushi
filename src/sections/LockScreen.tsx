import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Lock, User, KeyRound } from "lucide-react";
import { COUPLE } from "@/utils/constants";

interface LockScreenProps {
  onUnlock: () => void;
}

// A soft gate for the two of us. Client-side only — a playful lock, not real
// security (the answer lives in the page), but it keeps our world just ours.
const LOCK_ID = "abhishek@neha";
const LOCK_PASS = "abhishek@neha";

/** The private gate shown after the splash and before the love letter. */
export function LockScreen({ onUnlock }: LockScreenProps) {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim().toLowerCase() === LOCK_ID && pass === LOCK_PASS) {
      // Warm up the music player inside this tap so iOS will let our song
      // auto-play (unmuted) later, when the letter's Explore CTA is tapped.
      window.dispatchEvent(new Event("prime-our-song"));
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[linear-gradient(150deg,#fff5f8,#ffe4ee_40%,#f0e8ff_72%,#fff0e6)] px-5"
      initial={{ opacity: 1 }}
    >
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative w-full max-w-sm rounded-[1.75rem] p-8 text-center shadow-[0_30px_80px_-24px_rgba(173,92,130,0.5)]"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7a8b8,#c65f7b)] text-white shadow-lg">
          <Lock size={26} />
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.35em] text-wine/70">
          <Heart size={12} className="text-rose" fill="currentColor" /> Private
        </p>
        <h1 className="mt-2 font-names text-4xl leading-tight text-gradient">
          {COUPLE.combined}
        </h1>
        <p className="mt-2 font-cormorant text-lg text-ink-soft">
          Enter our secret to step inside.
        </p>

        <div className="mt-6 space-y-3 text-left">
          <label className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-rose/50">
            <User size={16} className="shrink-0 text-rose-gold-deep" />
            <input
              type="text"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setError(false);
              }}
              placeholder="ID"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full bg-transparent text-plum placeholder:text-ink-soft/50 focus:outline-none"
            />
          </label>

          <label className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-rose/50">
            <KeyRound size={16} className="shrink-0 text-rose-gold-deep" />
            <input
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoComplete="off"
              className="w-full bg-transparent text-plum placeholder:text-ink-soft/50 focus:outline-none"
            />
          </label>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-wine"
          >
            Oops, that's not it — try again ❤️
          </motion.p>
        )}

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(120deg,#f7a8b8,#e8b298,#c9b6f0)] px-8 py-3.5 font-sans text-base font-medium tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(173,92,130,0.6)] transition hover:scale-[1.03] active:scale-95"
        >
          <Heart size={18} fill="currentColor" className="animate-pulse-heart" />
          Unlock
        </button>
      </motion.form>
    </motion.div>
  );
}
