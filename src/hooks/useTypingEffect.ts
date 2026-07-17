import { useEffect, useRef, useState } from "react";

interface Options {
  /** ms per character. */
  speed?: number;
  /** delay before typing starts (ms). */
  startDelay?: number;
  /** whether typing is enabled (e.g. after in-view). */
  enabled?: boolean;
}

/** Reveals `text` one character at a time; returns the visible slice + done flag. */
export function useTypingEffect(
  text: string,
  { speed = 55, startDelay = 200, enabled = true }: Options = {},
) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    setOutput("");
    setDone(false);
    indexRef.current = 0;

    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        indexRef.current += 1;
        setOutput(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, enabled]);

  return { output, done };
}
