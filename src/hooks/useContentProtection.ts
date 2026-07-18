import { useEffect } from "react";

/** True when the event happened inside an editable field (keep those usable). */
function inEditable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

/**
 * Deters casual copying / saving of the page's content: blocks the right-click
 * menu, copy/cut, image & text dragging, and the usual save / view-source /
 * devtools shortcuts. Form fields stay fully usable.
 *
 * NOTE: this is a deterrent, not DRM. A determined user can still bypass it
 * (disable JS, view source, etc.), and NOTHING a website does can block OS or
 * third-party screenshots — that is simply not possible on the web.
 */
export function useContentProtection(): void {
  useEffect(() => {
    const preventUnlessEditable = (e: Event) => {
      if (!inEditable(e.target)) e.preventDefault();
    };

    const onContextMenu = (e: Event) => e.preventDefault();
    const onDragStart = (e: Event) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // Copy / cut / save / print / view-source — allow inside form fields.
      if (mod && ["c", "x", "s", "u", "p"].includes(k) && !inEditable(e.target)) {
        e.preventDefault();
        return;
      }
      // Devtools shortcuts.
      if (k === "f12" || (mod && e.shiftKey && ["i", "j", "c"].includes(k))) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", preventUnlessEditable);
    document.addEventListener("cut", preventUnlessEditable);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", preventUnlessEditable);
      document.removeEventListener("cut", preventUnlessEditable);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
