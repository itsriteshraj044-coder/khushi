import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * A full-width video band directly under the "How it began" section. Only the
 * matching clip is mounted/downloaded (width-based, so tablets get the desktop
 * clip):
 *   • phones  (< 768px)       → love-mobile.mp4 (portrait)
 *   • tablet & desktop (≥768)  → love-desktop.mp4 (landscape)
 *
 * The clip autoplays muted and loops forever with no native controls. A small
 * circular music button sits over the source watermark — it both hides the
 * watermark and lets the visitor unmute / mute the sound.
 */

// Position of the circular button over each clip's fixed bottom-right watermark.
// Tweak the insets per video if the sparkle peeks out on any side.
const BADGE_POS = {
  mobile: "bottom-[3%] right-[3%]",
  desktop: "bottom-[4%] right-[3%]",
} as const;

export function VideoShowcase() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Resolve the viewport before choosing a clip so a phone never downloads the
  // desktop video first (and vice-versa).
  useEffect(() => setMounted(true), []);

  const src = isMobile ? "/video/love-mobile.mp4" : "/video/love-desktop.mp4";
  const badgePos = isMobile ? BADGE_POS.mobile : BADGE_POS.desktop;

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    // Some browsers pause on the interaction — keep it looping.
    void v.play().catch(() => {});
  };

  return (
    <section id="video" className="relative w-full overflow-hidden bg-black leading-[0]">
      {mounted ? (
        <>
          <video
            ref={videoRef}
            key={src}
            className="block h-auto w-full"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* Circular music button over the watermark (also mute/unmute).
              Opaque fill + blur so the translucent sparkle behind is fully hidden. */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className={`absolute ${badgePos} z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#3a1228] text-white shadow-lg ring-1 ring-white/40 backdrop-blur-md transition hover:bg-[#521a39] active:scale-90`}
          >
            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </>
      ) : (
        // Reserve some height before the clip resolves to soften layout shift.
        <div className="w-full" style={{ minHeight: "40vh" }} />
      )}
    </section>
  );
}
