import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, Stars, OrbitControls } from "@react-three/drei";
import { Heart3D } from "./Heart3D";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoveSceneProps {
  /** "hero" = single subtle heart; "full" = rich interactive scene. */
  variant?: "hero" | "full";
  className?: string;
}

/** Lighting rig shared by both scene variants. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} color="#fff0f5" />
      <pointLight position={[-5, -3, 2]} intensity={40} color="#c9b6f0" />
      <pointLight position={[4, -2, 4]} intensity={30} color="#ffb6ce" />
    </>
  );
}

/** The 3D contents, swapped by variant. */
function SceneContents({ variant }: { variant: "hero" | "full" }) {
  if (variant === "hero") {
    return (
      <>
        <Lights />
        <Heart3D scale={0.85} color="#f7768e" />
        <Sparkles count={40} scale={8} size={3} speed={0.4} color="#ffd6e7" />
      </>
    );
  }

  return (
    <>
      <Lights />
      <Stars radius={40} depth={30} count={1200} factor={3} fade speed={0.6} />
      <Heart3D position={[0, 0, 0]} scale={0.7} color="#f7768e" />
      <Float speed={1.4} floatIntensity={1.6}>
        <Heart3D position={[-3.2, 1.4, -2]} scale={0.32} color="#c9b6f0" rotationSpeed={0.5} />
      </Float>
      <Float speed={1.8} floatIntensity={2}>
        <Heart3D position={[3.1, -1.2, -1]} scale={0.28} color="#e8b298" rotationSpeed={0.6} />
      </Float>
      <Float speed={1.2} floatIntensity={1.4}>
        <Heart3D position={[2.4, 2, -3]} scale={0.22} color="#ffb6ce" rotationSpeed={0.4} />
      </Float>
      <Sparkles count={90} scale={12} size={4} speed={0.5} color="#ffd6e7" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
      />
    </>
  );
}

/**
 * Performance-optimised R3F canvas. DPR is capped, frames render on-demand for
 * the hero, and the whole scene collapses to a static gradient under reduced
 * motion for accessibility.
 */
export function LoveScene({ variant = "hero", className }: LoveSceneProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        aria-hidden
        className={`bg-[radial-gradient(circle_at_50%_40%,rgba(247,168,184,0.4),transparent_70%)] ${className ?? ""}`}
      />
    );
  }

  return (
    <Canvas
      className={className}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <SceneContents variant={variant} />
      </Suspense>
    </Canvas>
  );
}
