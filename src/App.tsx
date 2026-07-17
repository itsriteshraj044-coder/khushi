import { lazy, Suspense, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { ScrollProgress } from "@/components/ScrollProgress";
import { DotNav } from "@/components/DotNav";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Loader } from "@/sections/Loader";
import { Hero } from "@/sections/Hero";
import { useLenis } from "@/hooks/useLenis";

// Below-the-fold sections are code-split for a fast first paint.
const LoveStory = lazy(() => import("@/sections/LoveStory").then((m) => ({ default: m.LoveStory })));
const Gallery = lazy(() => import("@/sections/Gallery").then((m) => ({ default: m.Gallery })));
const Quotes = lazy(() => import("@/sections/Quotes").then((m) => ({ default: m.Quotes })));
const Shayari = lazy(() => import("@/sections/Shayari").then((m) => ({ default: m.Shayari })));
const Memories = lazy(() => import("@/sections/Memories").then((m) => ({ default: m.Memories })));
const WhyILoveYou = lazy(() => import("@/sections/WhyILoveYou").then((m) => ({ default: m.WhyILoveYou })));
const Love3D = lazy(() => import("@/sections/Love3D").then((m) => ({ default: m.Love3D })));
const LoveLetter = lazy(() => import("@/sections/LoveLetter").then((m) => ({ default: m.LoveLetter })));
const Countdown = lazy(() => import("@/sections/Countdown").then((m) => ({ default: m.Countdown })));
const LoveForm = lazy(() => import("@/sections/LoveForm").then((m) => ({ default: m.LoveForm })));
const Footer = lazy(() => import("@/sections/Footer").then((m) => ({ default: m.Footer })));

function App() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      {/* The splash screen flows straight into a heart-iris reveal, so the site
          is only ever seen fully — never a faded flash in between. */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

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
          <Gallery />
          <Quotes />
          <Shayari />
          <Memories />
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
