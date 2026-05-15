import { mmToM } from "@/types";
import type { Dimensions } from "@/types";

export interface UnderCabinetStripProps {
  dimensions: Dimensions;
  intensity?: number;
  color?: string;
}

/** A thin emissive strip + soft rect-area light, intended to be placed
 * under a wall cabinet (item position.y = wall cabinet bottom). */
export function UnderCabinetStrip({
  dimensions,
  intensity = 2,
  color = "#fff0d6",
}: UnderCabinetStripProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  return (
    <group>
      <mesh position={[0, -h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          roughness={0.5}
        />
      </mesh>
      <rectAreaLight
        width={w * 0.95}
        height={d * 0.8}
        intensity={intensity}
        color={color}
        position={[0, -h - mmToM(1), 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
