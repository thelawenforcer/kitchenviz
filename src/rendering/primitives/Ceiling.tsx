import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface CeilingProps {
  dimensions: Dimensions;
  materials: { surface?: MaterialId };
}

/** A ceiling patch (e.g. a soffit). Origin: footprint centre, top at
 * Y=0 — set position.y to the room height. */
export function Ceiling({ dimensions, materials }: CeilingProps) {
  const w = mmToM(dimensions.width);
  const d = mmToM(dimensions.depth);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <Pbr materialId={materials.surface ?? "paint-warm-white"} />
    </mesh>
  );
}
