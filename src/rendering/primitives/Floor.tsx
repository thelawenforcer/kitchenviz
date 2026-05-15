import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface FloorProps {
  dimensions: Dimensions;
  materials: { surface?: MaterialId };
}

/** A textured floor patch — used to override the global viewport floor
 * for an item-defined area (e.g. a tiled splash zone). Origin: footprint
 * centre, Y=0. */
export function Floor({ dimensions, materials }: FloorProps) {
  const w = mmToM(dimensions.width);
  const d = mmToM(dimensions.depth);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, mmToM(2), 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <Pbr materialId={materials.surface ?? "wood-oak"} />
    </mesh>
  );
}
