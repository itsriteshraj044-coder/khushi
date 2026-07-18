import { lazy, Suspense, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { ScrollProgress } from "@/components/ScrollProgress";
import { DotNav } from "@/components/DotNav";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Loader } from "@/sections/Loader";
import { LetterGate } from "@/sections/LetterGate";
import { Hero } from "@/sections/Hero";
import { useLenis } from "@/hooks/useLenis";

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
  // Entry flow: splash loader → love-letter gate → the site itself.
  const [stage, setStage] = useState<"loading" | "letter" | "site">("loading");
  useLenis();

  return (
    <>
      {/* The love-letter gate is mounted *behind* the splash while loading, so the
          heart-iris reveal opens straight onto the sealed letter — the website is
          never flashed in between. It stays until the visitor clicks "Explore". */}
      {stage !== "site" && <LetterGate onEnter={() => setStage("site")} />}

      {/* Splash screen sits on top; it hands off to the letter gate underneath. */}
      {stage === "loading" && <Loader onComplete={() => setStage("letter")} />}

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
