import { motion } from "motion/react";
import { Heart, ArrowUp } from "lucide-react";
import { scrollToId } from "@/hooks/useLenis";
import { FloatingHearts } from "@/components/FloatingHearts";
import { COUPLE } from "@/utils/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 pt-20 pb-10 text-center">
      <FloatingHearts count={6} />

      <div className="relative z-10 mx-auto max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-script text-3xl text-gradient sm:text-4xl"
        >
          Till the last star fades…
        </motion.p>
        <p className="mt-4 font-cormorant text-lg text-ink-soft">
          Thank you for wandering through our little universe of love. May your
          own story be every bit as tender, and twice as long.
        </p>

        {/* Back to top */}
        <button
          onClick={() => scrollToId("hero")}
          className="group mt-10 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm text-plum transition-transform hover:-translate-y-1"
        >
          <ArrowUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
          Back to Top
        </button>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-sm text-ink-soft">
          Made with
          <Heart size={14} fill="#f7a8b8" className="animate-pulse-heart text-rose" />
          by <span className="font-dancing text-lg text-gradient">{COUPLE.one}</span>
          for <span className="font-dancing text-lg text-gradient">{COUPLE.two}</span>
        </p>
        <p className="mt-1 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} · {COUPLE.combined} · Forever &amp; Always
        </p>
      </div>
    </footer>
  );
}
