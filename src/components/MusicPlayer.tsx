import { motion } from "motion/react";
import { Play, Pause, Music } from "lucide-react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

/** Five equalizer bars that animate only while music is playing. */
function Equalizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-white"
          animate={
            active
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "30%" }
          }
          transition={
            active
              ? { duration: 0.9 + i * 0.15, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}

/**
 * A floating background-music control. Synthesises a soft ambient pad (no audio
 * file needed) and shows a live equalizer while playing.
 */
export function MusicPlayer() {
  const { playing, toggle } = useAmbientAudio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-full glass px-3 py-2 pr-4 shadow-lg"
    >
      <button
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        aria-pressed={playing}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>

      <div className="flex flex-col">
        <span className="flex items-center gap-1 text-xs font-medium text-plum">
          <Music size={11} /> Our Song
        </span>
        <Equalizer active={playing} />
      </div>
    </motion.div>
  );
}
