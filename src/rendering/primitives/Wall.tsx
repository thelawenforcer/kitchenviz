import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface WallProps {
  dimensions: Dimensions;
  materials: { surface?: MaterialId };
}

/** A thin rectangular wall slab. Origin: footprint centre, base at Y=0.
 * Real cutouts for windows/doors are out of scope for the MVP — the
 * window primitive renders independently and is expected to be placed
 * in front of the wall. */
export function Wall({ dimensions, materials }: WallProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const t = mmToM(dimensions.depth); // thickness
  return (
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, t]} />
      <Pbr materialId={materials.surface ?? "paint-warm-white"} />
    </mesh>
  );
}
