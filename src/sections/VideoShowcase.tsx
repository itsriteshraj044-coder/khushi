import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * A full-width video band sitting right beneath the hero. To keep phones light,
 * only the matching clip is ever mounted (and downloaded):
 *   • phones  (< 768px)      → the portrait mobile clip
 *   • tablet & desktop (≥768) → the landscape clip
 * Width-based on purpose — tablets are touch devices but still get the big clip.
 */
export function VideoShowcase() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);

  // Wait for the viewport check before choosing a clip, so a phone never has to
  // download the desktop video (or vice-versa) first.
  useEffect(() => setMounted(true), []);

  const src = isMobile ? "/video/love-mobile.mp4" : "/video/love-desktop.mp4";

  return (
    <section id="video" className="relative w-full overflow-hidden bg-black leading-[0]">
      {mounted ? (
        <video
          key={src}
          className="block h-auto w-full"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
      ) : (
        // Reserve some height before the clip resolves to soften layout shift.
        <div className="w-full" style={{ minHeight: "40vh" }} />
      )}
    </section>
  );
}
