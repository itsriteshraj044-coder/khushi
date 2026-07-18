import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, X, Play } from "lucide-react";

/**
 * Our songs. Played through YouTube's official embedded player (clicking a title
 * loads & autoplays it) — the proper, licence-friendly way rather than ripping
 * the audio to MP3.
 */
const SONGS = [
  { id: "petoy_uTMRU", title: "Rahega Hothon Pe", artist: "Kunaal Vermaa" },
  { id: "ETv-U0ytbDA", title: "Yun Hi Re", artist: "Anirudh · David" },
  { id: "Hxe362w66GI", title: "Jahaan Tum Ho", artist: "Shrey Singhal" },
  { id: "zNUs54J3mKo", title: "Tera Chehra", artist: "Adnan Sami" },
];

/** Five equalizer bars that animate only while a song is playing. */
function Equalizer({ active, color = "bg-rose" }: { active: boolean; color?: string }) {
  return (
    <div className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className={`w-[3px] rounded-full ${color}`}
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
 * A floating "Our Song" button that opens a popup playlist. Picking a song plays
 * it in an embedded YouTube player; the popup has a close button and backdrop.
 */
export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);

  const playing = current !== null;
  const active = playing ? SONGS[current] : null;

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open our songs"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        whileHover={{ y: -2 }}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-3 rounded-full glass px-3 py-2 pr-4 shadow-lg"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow-md">
          <Music size={18} />
        </span>
        <span className="flex flex-col items-start">
          <span className="flex items-center gap-1 text-xs font-medium text-plum">
            <Music size={11} /> Our Song
          </span>
          <Equalizer active={playing} />
        </span>
      </motion.button>

      {/* Popup playlist */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-plum/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              role="dialog"
              aria-label="Our songs"
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-[1.75rem] border border-white/70 bg-[linear-gradient(160deg,#fffaf3,#fdeef4)] p-6 shadow-[0_30px_80px_-24px_rgba(90,10,40,0.55)]"
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full glass text-plum transition hover:text-rose active:scale-90"
              >
                <X size={18} />
              </button>

              <h3 className="flex items-center gap-2 font-serif text-2xl font-semibold text-plum">
                <Music size={20} className="text-rose" /> Our Songs
              </h3>
              <p className="mt-1 font-cormorant text-base text-ink-soft">
                The tunes that feel like us — tap one to play.
              </p>

              {/* Now playing */}
              {active && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/70 shadow-md">
                  <iframe
                    key={active.id}
                    className="aspect-video w-full"
                    src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                    title={active.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Playlist */}
              <ul className="mt-5 space-y-2">
                {SONGS.map((s, i) => {
                  const isCurrent = i === current;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setCurrent(i)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                          isCurrent ? "bg-rose/15 ring-1 ring-rose/40" : "hover:bg-white/70"
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow">
                          {isCurrent ? <Equalizer active color="bg-white" /> : <Play size={14} fill="currentColor" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-plum">{s.title}</span>
                          <span className="block truncate text-xs text-ink-soft">{s.artist}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
