import { useEffect, useState } from "react";
import { SECTIONS } from "@/utils/constants";
import { scrollToId } from "@/hooks/useLenis";

/**
 * A minimal vertical scroll-spy navigation (desktop only). Highlights the
 * section currently in view and scrolls smoothly on click.
 */
export function DotNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToId(id)}
          aria-label={`Go to ${label}`}
          aria-current={active === id}
          className="group relative flex items-center"
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? "h-3 w-3 bg-[linear-gradient(120deg,#f7a8b8,#c9b6f0)]"
                : "h-2 w-2 bg-plum/25 group-hover:bg-rose/60"
            }`}
          />
          <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full glass px-2.5 py-1 text-xs text-plum opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
