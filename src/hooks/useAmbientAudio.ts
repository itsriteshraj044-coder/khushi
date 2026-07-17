import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A tiny, self-contained WebAudio "instrumental": a soft major-chord pad with a
 * gentle tremolo. No audio files required — it is synthesised on the fly and
 * kept intentionally quiet so it feels ambient rather than intrusive.
 */
export function useAmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode[]; master: GainNode } | null>(
    null,
  );

  const stop = useCallback(() => {
    const nodes = nodesRef.current;
    const ctx = ctxRef.current;
    if (!nodes || !ctx) return;
    nodes.master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    const toStop = nodes.osc;
    setTimeout(() => toStop.forEach((o) => o.stop()), 900);
    nodesRef.current = null;
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.setTargetAtTime(0.05, ctx.currentTime, 0.6);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.connect(master);
    master.connect(ctx.destination);

    // Gentle tremolo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();

    // A major-9th-ish chord for a dreamy feel
    const freqs = [220, 277.18, 329.63, 415.3];
    const osc = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.25;
      o.connect(g).connect(filter);
      o.start();
      return o;
    });
    osc.push(lfo);

    nodesRef.current = { osc, master };
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      nodesRef.current?.osc.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      void ctxRef.current?.close();
    };
  }, []);

  return { playing, toggle };
}
