import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface WorktopProps {
  dimensions: Dimensions;
  materials: { surface?: MaterialId };
  /** Slight overhang past the supporting cabinets at the front edge.
   * Cosmetic only — no real cutout in the MVP. */
  overhangFront?: number;
}

/** A simple rectangular slab. Origin at footprint centre, base at Y=0
 * (so place it on top of base cabinets at y=cabinetHeight). */
export function Worktop({ dimensions, materials, overhangFront = 0 }: WorktopProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height); // thickness
  const d = mmToM(dimensions.depth);
  const overhang = mmToM(overhangFront);

  return (
    <mesh position={[0, h / 2, overhang / 2]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d + overhang]} />
      <Pbr materialId={materials.surface ?? "stone-quartz-white"} />
    </mesh>
  );
}
