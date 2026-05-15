import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface DishwasherProps {
  dimensions: Dimensions;
  materials: { body?: MaterialId; door?: MaterialId; handle?: MaterialId };
  /** "integrated" — door takes the cabinet front material.
   * "freestanding" — exposed stainless body. */
  variant?: "integrated" | "freestanding";
}

export function Dishwasher({
  dimensions,
  materials,
  variant = "integrated",
}: DishwasherProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  const doorThk = mmToM(20);

  const bodyMat =
    materials.body ?? (variant === "integrated" ? "matte-black" : "metal-stainless");
  const doorMat =
    materials.door ?? (variant === "integrated" ? "matte-white" : "metal-stainless");

  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <Pbr materialId={bodyMat} />
      </mesh>
      <mesh position={[0, h / 2, d / 2 + doorThk / 2]} castShadow receiveShadow>
        <boxGeometry args={[w - mmToM(8), h - mmToM(8), doorThk]} />
        <Pbr materialId={doorMat} />
      </mesh>
      {/* Top recessed handle */}
      <mesh position={[0, h - mmToM(40), d / 2 + doorThk + mmToM(8)]} castShadow>
        <boxGeometry args={[w * 0.5, mmToM(12), mmToM(20)]} />
        <Pbr materialId={materials.handle ?? "metal-stainless"} />
      </mesh>
    </group>
  );
}
