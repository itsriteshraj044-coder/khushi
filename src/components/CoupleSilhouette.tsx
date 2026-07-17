import { cn } from "@/lib/utils";

/**
 * A tasteful couple silhouette (two faces almost touching, forming the
 * negative space of a heart). Pure SVG so it scales crisply everywhere.
 */
export function CoupleSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Silhouette of a couple"
      fill="currentColor"
    >
      {/* Left figure */}
      <path d="M40 200c0-34 12-58 30-66-9-5-15-16-15-28 0-16 12-29 27-29 6 0 11 2 16 5-3 6-5 13-5 20 0 18 11 33 26 39-2 1-4 3-6 5-8 8-13 22-14 39 0 5 0 10 1 15H40c-0 0-0-0-0 0z" />
      {/* Right figure, leaning in */}
      <path d="M160 200c0-34-12-58-30-66 9-5 15-16 15-28 0-16-12-29-27-29-15 0-27 13-27 29 0 12 6 23 15 28-18 8-30 32-30 66h84z" />
    </svg>
  );
}
