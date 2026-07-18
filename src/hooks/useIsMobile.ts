import { useEffect, useState } from "react";

/**
 * True on phones / touch devices (small screen OR coarse pointer). Used to drop
 * expensive effects — animated blur blobs, smooth-scroll, WebGL — that make
 * mobile browsers lag and flicker.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}
