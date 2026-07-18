import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const VIDEO = "/video/love-3d.mp4";

/**
 * Section 8 — 3D Love. The interactive Three.js heart galaxy has been replaced
 * with a cinematic looping video inside the same glass box. A circular music
 * button sits over the source watermark (bottom-right) and toggles the sound.
 */
export function Love3D() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    void v.play().catch(() => {});
  };

  return (
    <section id="love3d" className="section-pad relative px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="A universe of us"
        title="3D Love"
        highlight="Love"
        subtitle="A little cinematic world, spun just for the two of us."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto mt-12 h-[460px] max-w-none overflow-hidden rounded-[2rem] glass-deep sm:h-[560px] xl:h-[640px]"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Circular music button over the bottom-right watermark (also mute/unmute).
            Opaque fill + blur so the translucent sparkle behind is fully hidden. */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#3a1228] text-white shadow-lg ring-1 ring-white/40 backdrop-blur-md transition hover:bg-[#521a39] active:scale-90"
        >
          {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      </motion.div>
    </section>
  );
}
