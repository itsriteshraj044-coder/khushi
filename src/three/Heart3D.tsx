import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";
import { heartGeometry } from "./heartGeometry";

interface Heart3DProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  rotationSpeed?: number;
  floatIntensity?: number;
}

/**
 * A single glossy, gently rotating 3D heart. Uses a shared cached geometry and
 * a physically-based material with a soft emissive glow for a "bloom" feel.
 */
export function Heart3D({
  position = [0, 0, 0],
  scale = 1,
  color = "#f7768e",
  rotationSpeed = 0.3,
  floatIntensity = 1.2,
}: Heart3DProps) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={floatIntensity}>
      <mesh
        ref={ref}
        geometry={heartGeometry}
        position={position}
        scale={scale}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.18}
          metalness={0.35}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}
