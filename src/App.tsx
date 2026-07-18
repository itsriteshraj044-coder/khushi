import { lazy, Suspense, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { ScrollProgress } from "@/components/ScrollProgress";
import { DotNav } from "@/components/DotNav";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Loader } from "@/sections/Loader";
import { LockScreen } from "@/sections/LockScreen";
import { LetterGate } from "@/sections/LetterGate";
import { Hero } from "@/sections/Hero";
import { useLenis } from "@/hooks/useLenis";
import { useContentProtection } from "@/hooks/useContentProtection";
import { useScreenshotGuard } from "@/hooks/useScreenshotGuard";

// Below-the-fold sections are code-split for a fast first paint.
const VideoShowcase = lazy(() => import("@/sections/VideoShowcase").then((m) => ({ default: m.VideoShowcase })));
const LoveStory = lazy(() => import("@/sections/LoveStory").then((m) => ({ default: m.LoveStory })));
const Quotes = lazy(() => import("@/sections/Quotes").then((m) => ({ default: m.Quotes })));
const Shayari = lazy(() => import("@/sections/Shayari").then((m) => ({ default: m.Shayari })));
const WhyILoveYou = lazy(() => import("@/sections/WhyILoveYou").then((m) => ({ default: m.WhyILoveYou })));
const Love3D = lazy(() => import("@/sections/Love3D").then((m) => ({ default: m.Love3D })));
const LoveLetter = lazy(() => import("@/sections/LoveLetter").then((m) => ({ default: m.LoveLetter })));
const Countdown = lazy(() => import("@/sections/Countdown").then((m) => ({ default: m.Countdown })));
const LoveForm = lazy(() => import("@/sections/LoveForm").then((m) => ({ default: m.LoveForm })));
const Footer = lazy(() => import("@/sections/Footer").then((m) => ({ default: m.Footer })));

function App() {
  // Entry flow: splash loader → private lock → love-letter gate → the site.
  const [stage, setStage] = useState<"loading" | "lock" | "letter" | "site">("loading");
  useLenis();
  useContentProtection();
  const masked = useScreenshotGuard();

  return (
    <>
      {/* Best-effort screenshot mask (PrintScreen / focus-loss). Cannot block
          phone or third-party captures — that's not possible on the web. */}
      {masked && (
        <div
          aria-hidden
          className="fixed inset-0 z-[200] bg-black"
          style={{ pointerEvents: "none" }}
        />
      )}
      {/* Private lock gate — mounted behind the splash while loading so the
          heart-iris reveal opens straight onto it. Unlocking reveals the letter. */}
      {(stage === "loading" || stage === "lock") && (
        <LockScreen onUnlock={() => setStage("letter")} />
      )}

      {/* The love-letter gate appears once unlocked; its CTA opens the site
          (and starts our first song — dispatched from within the click). */}
      {stage === "letter" && <LetterGate onEnter={() => setStage("site")} />}

      {/* Splash screen sits on top; it hands off to the lock gate underneath. */}
      {stage === "loading" && <Loader onComplete={() => setStage("lock")} />}

      {/* Global ambience */}
      <AnimatedBackground />
      <CursorGlow />
      <ScrollProgress />
      <DotNav />
      <MusicPlayer />

      <main>
        <Hero />
        <Suspense fallback={<div className="h-40" aria-hidden />}>
          <LoveStory />
          <VideoShowcase />
          <Quotes />
          <Shayari />
          <WhyILoveYou />
          <Love3D />
          <LoveLetter />
          <Countdown />
          <LoveForm />
          <Footer />
        </Suspense>
      </main>
    </>
  );
}

export default App;
