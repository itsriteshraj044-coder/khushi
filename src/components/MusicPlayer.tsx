import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

/**
 * Our songs. Played *audio-only* through YouTube's official IFrame player (the
 * video is rendered at zero size) with our own transport controls. Licence-
 * friendly — we deliberately do NOT rip the audio to MP3.
 */
const SONGS = [
  { id: "ETv-U0ytbDA", title: "Yun Hi Re", artist: "Anirudh · David" },
  { id: "petoy_uTMRU", title: "Rahega Hothon Pe", artist: "Kunaal Vermaa" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/** Five equalizer bars that animate only while a song is playing. */
function Equalizer({ active, color = "bg-rose" }: { active: boolean; color?: string }) {
  return (
    <div className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className={`w-[3px] rounded-full ${color}`}
          animate={active ? { height: ["30%", "100%", "45%", "80%", "30%"] } : { height: "30%" }}
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
 * A floating "Our Song" button that opens a popup playlist with a full audio
 * controller (seek bar, previous / play-pause / next) and a close button.
 */
export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const playerRef = useRef<any>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<number | null>(null);
  const nextRef = useRef<() => void>(() => {});
  const playFirstRef = useRef<() => void>(() => {});
  const pendingFirstRef = useRef(false);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // Load the YouTube IFrame API once.
  useEffect(() => {
    if (window.YT?.Player) {
      setApiReady(true);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      setApiReady(true);
    };
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // Create the (hidden) player once the API is ready.
  useEffect(() => {
    if (!apiReady || playerRef.current || !hostRef.current) return;
    playerRef.current = new window.YT.Player(hostRef.current, {
      height: "0",
      width: "0",
      // Pre-cue the first song so it can be started with a synchronous
      // playVideo() inside a tap — which is what iOS Safari/Chrome require.
      videoId: SONGS[0].id,
      playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1 },
      events: {
        onReady: () => {
          if (pendingFirstRef.current) {
            pendingFirstRef.current = false;
            playFirstRef.current();
          }
        },
        onStateChange: (e: any) => {
          setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
          if (e.data === window.YT.PlayerState.ENDED) nextRef.current();
        },
      },
    });
  }, [apiReady]);

  // Auto-play the first song (unmuted) when the site opens — triggered by the
  // "Explore" tap on the love letter. Queues until the player is ready.
  useEffect(() => {
    const handler = () => {
      if (playerRef.current?.loadVideoById) playFirstRef.current();
      else pendingFirstRef.current = true;
    };
    window.addEventListener("play-our-song", handler);
    return () => window.removeEventListener("play-our-song", handler);
  }, []);

  // iOS unlock: warm up the (muted) player inside the earlier Unlock tap so a
  // later programmatic play is allowed. Silent 0×0 blip, then paused at 0.
  useEffect(() => {
    const handler = () => {
      const p = playerRef.current;
      if (!p?.playVideo) return;
      try {
        p.mute();
        p.playVideo();
        window.setTimeout(() => {
          p.pauseVideo?.();
          p.seekTo?.(0, true);
        }, 60);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("prime-our-song", handler);
    return () => window.removeEventListener("prime-our-song", handler);
  }, []);

  // External control from the video: when the clip's audio is turned on, our
  // song mutes; when the clip is muted (or scrolled away), our song comes back.
  useEffect(() => {
    const muteHandler = () => {
      const p = playerRef.current;
      if (!p?.mute) return;
      p.mute();
      setMuted(true);
    };
    const unmuteHandler = () => {
      const p = playerRef.current;
      if (!p) return;
      // If the song was never started yet, start it from the top.
      if (currentRef.current === null && p.loadVideoById) {
        playFirstRef.current();
        return;
      }
      p.unMute?.();
      setMuted(false);
      p.playVideo?.();
    };
    window.addEventListener("mute-our-song", muteHandler);
    window.addEventListener("unmute-our-song", unmuteHandler);
    return () => {
      window.removeEventListener("mute-our-song", muteHandler);
      window.removeEventListener("unmute-our-song", unmuteHandler);
    };
  }, []);

  // Poll playback position while a song is loaded.
  useEffect(() => {
    if (current === null) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (p?.getDuration) {
        setProgress({ current: p.getCurrentTime() || 0, duration: p.getDuration() || 0 });
      }
    }, 400);
    return () => clearInterval(id);
  }, [current]);

  const playIndex = (i: number) => {
    const idx = (i + SONGS.length) % SONGS.length;
    setCurrent(idx);
    setProgress({ current: 0, duration: 0 });
    playerRef.current?.loadVideoById(SONGS[idx].id);
  };

  const goNext = () => playIndex((currentRef.current ?? -1) + 1);
  const goPrev = () => playIndex((currentRef.current ?? 1) - 1);
  nextRef.current = goNext;

  // Start our first song, unmuted (used by the "Explore" tap). The song is
  // already cued in the constructor, so we call playVideo() synchronously —
  // iOS blocks the async loadVideoById() path, but allows this one.
  const playFirst = () => {
    const p = playerRef.current;
    if (!p) return;
    setCurrent(0);
    currentRef.current = 0;
    setProgress({ current: 0, duration: 0 });
    p.unMute?.();
    setMuted(false);
    p.seekTo?.(0, true);
    p.playVideo?.();
  };
  playFirstRef.current = playFirst;

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const seek = (t: number) => {
    playerRef.current?.seekTo(t, true);
    setProgress((prev) => ({ ...prev, current: t }));
  };

  const active = current !== null ? SONGS[current] : null;

  return (
    <>
      {/* Hidden audio-only YouTube player (rendered at 0×0, off-screen). */}
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
        <div ref={hostRef} />
      </div>

      {/* Floating launcher + separate mute toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-1.5 rounded-full glass py-1.5 pl-1.5 pr-2 shadow-lg"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open our songs"
          className="flex items-center gap-2.5 rounded-full pr-1 transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow-md">
            <Music size={16} />
          </span>
          <span className="flex flex-col items-start">
            <span className="flex items-center gap-1 text-xs font-medium text-plum">
              <Music size={11} /> Our Song
            </span>
            <Equalizer active={isPlaying} />
          </span>
        </button>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-plum transition hover:text-rose active:scale-90"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </motion.div>

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

              {/* Now playing + controller */}
              {active && (
                <div className="mt-5 rounded-2xl bg-white/60 p-4 shadow-inner">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow">
                      <Equalizer active={isPlaying} color="bg-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-plum">{active.title}</p>
                      <p className="truncate text-xs text-ink-soft">{active.artist}</p>
                    </div>
                  </div>

                  {/* Seek bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-9 text-right text-[11px] tabular-nums text-ink-soft">
                      {fmt(progress.current)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={progress.duration || 0}
                      value={progress.current}
                      step={1}
                      onChange={(e) => seek(Number(e.target.value))}
                      aria-label="Seek"
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-plum/20 accent-rose"
                    />
                    <span className="w-9 text-[11px] tabular-nums text-ink-soft">
                      {fmt(progress.duration)}
                    </span>
                  </div>

                  {/* Transport controls */}
                  <div className="mt-3 flex items-center justify-center gap-5">
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous song"
                      className="flex h-10 w-10 items-center justify-center rounded-full glass text-plum transition hover:text-rose active:scale-90"
                    >
                      <SkipBack size={18} fill="currentColor" />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow-md transition hover:scale-105 active:scale-95"
                    >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next song"
                      className="flex h-10 w-10 items-center justify-center rounded-full glass text-plum transition hover:text-rose active:scale-90"
                    >
                      <SkipForward size={18} fill="currentColor" />
                    </button>
                  </div>
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
                        onClick={() => playIndex(i)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                          isCurrent ? "bg-rose/15 ring-1 ring-rose/40" : "hover:bg-white/70"
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)] text-white shadow">
                          {isCurrent && isPlaying ? (
                            <Equalizer active color="bg-white" />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
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
