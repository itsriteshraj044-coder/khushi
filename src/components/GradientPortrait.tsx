import { CoupleSilhouette } from "./CoupleSilhouette";
import { cn } from "@/lib/utils";

interface GradientPortraitProps {
  hue: number;
  caption?: string;
  className?: string;
}

/**
 * An on-theme romantic "photo" rendered entirely from gradients + a couple
 * silhouette. Ships without any external image dependency and never breaks.
 * Swap this for a real <img> later without touching the gallery layout.
 */
export function GradientPortrait({
  hue,
  caption,
  className,
}: GradientPortraitProps) {
  const bg = `radial-gradient(120% 120% at 30% 15%, hsl(${hue} 100% 92%) 0%, hsl(${
    (hue + 24) % 360
  } 80% 84%) 45%, hsl(${(hue + 300) % 360} 72% 82%) 100%)`;

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background: bg }}
    >
      {/* Soft glow orbs */}
      <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute bottom-2 right-2 h-24 w-24 rounded-full bg-white/30 blur-2xl" />

      {/* Couple silhouette */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <CoupleSilhouette className="h-3/4 w-auto text-plum/70" />
      </div>

      {/* Subtle grain / sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)]" />

      {caption && (
        <span className="absolute left-4 top-4 rounded-full bg-white/50 px-3 py-1 font-dancing text-lg text-plum backdrop-blur-sm">
          {caption}
        </span>
      )}
    </div>
  );
}
