import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../../materials";

export interface SpotLightProps {
  dimensions: Dimensions;
  materials: { housing?: MaterialId };
  intensity?: number;
  color?: string;
  angle?: number;
}

/** A recessed downlight pointing straight down. Origin: housing at
 * Y=0, beam goes -Y. */
export function SpotLight({
  dimensions,
  materials,
  intensity = 12,
  color = "#fff2d6",
  angle = Math.PI / 6,
}: SpotLightProps) {
  const r = mmToM(dimensions.width / 2);
  const h = mmToM(dimensions.height);
  return (
    <group>
      <mesh position={[0, -h / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r * 0.85, h, 24]} />
        <Pbr materialId={materials.housing ?? "metal-stainless"} />
      </mesh>
      <mesh position={[0, -h - mmToM(2), 0]}>
        <circleGeometry args={[r * 0.7, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          roughness={0.4}
        />
      </mesh>
      <spotLight
        position={[0, -h, 0]}
        target-position={[0, -10, 0]}
        intensity={intensity}
        color={color}
        angle={angle}
        penumbra={0.4}
        distance={6}
        decay={2}
        castShadow
      />
    </group>
  );
}
