import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Send, Heart, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { GlassCard } from "@/components/GlassCard";
import type { LoveFormData } from "@/types";
import { FIELDS, EMPTY_FORM as EMPTY, type FieldConfig } from "@/data/formFields";
import { supabase, SUBMISSIONS_TABLE } from "@/lib/supabase";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/** A glass field with a floating label; supports input, textarea and select. */
function FloatingField({
  config,
  value,
  error,
  onChange,
}: {
  config: FieldConfig;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const id = `field-${config.name}`;

  const shared =
    "peer w-full rounded-2xl border bg-white/50 px-4 pb-2.5 pt-6 text-plum outline-none transition-colors placeholder-transparent focus:border-rose";
  const borderClass = error ? "border-rose" : "border-white/70";

  return (
    <div className={cn("relative", config.full && "sm:col-span-2")}>
      {config.kind === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={config.label}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={cn(shared, borderClass, "resize-none")}
        />
      ) : config.kind === "select" ? (
        <select
          id={id}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={cn(shared, borderClass, "appearance-none")}
        >
          <option value="" disabled hidden />
          {config.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={config.kind}
          value={value}
          placeholder={config.label}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={cn(shared, borderClass)}
        />
      )}

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 origin-left text-ink-soft transition-all duration-200",
          floated ? "top-2 text-xs text-rose-gold-deep" : "top-4 text-base",
        )}
      >
        {config.label}
        {config.required && <span className="text-rose"> *</span>}
      </label>

      {error && <p className="mt-1 pl-1 text-xs text-rose">{error}</p>}
    </div>
  );
}

/**
 * Section 12 — Love Form. A premium glass form with floating labels, inline
 * validation and a celebratory heart-confetti explosion on submit.
 */
export function LoveForm() {
  const [data, setData] = useState<LoveFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof LoveFormData, string>>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const heartShape = useMemo(
    () => (typeof confetti.shapeFromText === "function"
      ? confetti.shapeFromText({ text: "❤️", scalar: 2 })
      : undefined),
    [],
  );

  const update = (name: keyof LoveFormData, v: string) => {
    setData((d) => ({ ...d, [name]: v }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof LoveFormData, string>> = {};
    for (const f of FIELDS) {
      if (f.required && !data[f.name].trim()) next[f.name] = "This one matters — please fill it in.";
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "That email looks a little off.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const celebrate = () => {
    if (reduced) return;
    const opts = heartShape
      ? { shapes: [heartShape], scalar: 2 }
      : { colors: ["#f7a8b8", "#e8b298", "#c9b6f0", "#ffb6ce"] };
    confetti({ ...opts, particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setTimeout(
      () => confetti({ ...opts, particleCount: 40, angle: 60, spread: 55, origin: { x: 0 } }),
      150,
    );
    setTimeout(
      () => confetti({ ...opts, particleCount: 40, angle: 120, spread: 55, origin: { x: 1 } }),
      300,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || sending) return;

    setSending(true);
    setSendError(null);

    // Save to Supabase when configured; otherwise still celebrate so the site
    // works before the backend is wired up.
    if (supabase) {
      const { error } = await supabase.from(SUBMISSIONS_TABLE).insert({ data });
      if (error) {
        setSending(false);
        setSendError("Couldn't send right now — please try again in a moment.");
        return;
      }
    }

    setSending(false);
    setSent(true);
    celebrate();
  };

  return (
    <section id="form" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Send some love"
        title="Write Your Love"
        highlight="Love"
        subtitle="Pour your heart out below — every word is safe with us."
      />

      <div className="mx-auto mt-14 max-w-none">
        <GlassCard gradientBorder className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow-lg"
                >
                  <Heart size={36} fill="currentColor" className="animate-pulse-heart" />
                </motion.span>
                <h3 className="mt-6 text-3xl font-semibold text-plum">
                  Sent with all my heart
                </h3>
                <p className="mt-2 font-cormorant text-lg text-ink-soft">
                  Thank you, {data.yourName || "my love"}. Your words are on their
                  way to {data.partnerName || "someone lucky"}. 💌
                </p>
                <button
                  onClick={() => { setSent(false); setData(EMPTY); }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm text-plum"
                >
                  <Sparkles size={15} className="text-rose-gold-deep" /> Write another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-5 sm:grid-cols-2"
              >
                {FIELDS.map((f) => (
                  <FloatingField
                    key={f.name}
                    config={f}
                    value={data[f.name]}
                    error={errors[f.name]}
                    onChange={(v) => update(f.name, v)}
                  />
                ))}

                <div className="flex flex-col items-center gap-3 pt-2 sm:col-span-2">
                  {sendError && (
                    <p className="text-sm text-rose">{sendError}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.04 }}
                    whileTap={{ scale: sending ? 1 : 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#f7a8b8,#e8b298,#c9b6f0)] bg-[length:200%_200%] px-8 py-3.5 font-medium text-white shadow-[0_14px_40px_-10px_rgba(217,122,140,0.6)] animate-gradient disabled:opacity-70"
                  >
                    <Send size={18} /> {sending ? "Sending…" : "Send My Love"}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}
