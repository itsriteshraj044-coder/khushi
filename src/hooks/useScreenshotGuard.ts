import { useEffect, useState } from "react";

/**
 * Best-effort screenshot deterrent. Returns `true` when the page should be
 * masked with a black overlay:
 *   • the desktop PrintScreen key is pressed (we also wipe the clipboard), and
 *   • the window loses focus / becomes hidden (capture-while-switching).
 *
 * HARD LIMITS (this cannot be fixed on the web): it does NOT stop phone
 * hardware-button screenshots, Win+Shift+S / Snipping Tool, or any third-party
 * capture app — the browser has no API to detect or block those.
 */
export function useScreenshotGuard(): boolean {
  const [masked, setMasked] = useState(false);

  useEffect(() => {
    let flashTimer: ReturnType<typeof setTimeout>;

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "PrintScreen" || (e.metaKey && e.shiftKey)) {
        setMasked(true);
        // Overwrite whatever the OS may have copied to the clipboard.
        navigator.clipboard?.writeText("").catch(() => {});
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => setMasked(false), 900);
      }
    };

    const hideWhileAway = () => setMasked(document.visibilityState !== "visible");
    const onBlur = () => setMasked(true);
    const onFocus = () => setMasked(false);

    window.addEventListener("keyup", onKey);
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", hideWhileAway);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      clearTimeout(flashTimer);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", hideWhileAway);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return masked;
}
