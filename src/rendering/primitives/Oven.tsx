import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface OvenProps {
  dimensions: Dimensions;
  materials: { body?: MaterialId; door?: MaterialId; handle?: MaterialId };
}

/** A built-in box oven. Origin: footprint centre, base at Y=0 — for
 * built-in placement, set position.y to the cabinet shelf height. */
export function Oven({ dimensions, materials }: OvenProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  const trim = mmToM(20);
  const glassThk = mmToM(8);

  return (
    <group>
      {/* Body */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <Pbr materialId={materials.body ?? "metal-stainless"} />
      </mesh>
      {/* Recessed glass door */}
      <mesh position={[0, h / 2 - trim / 2, d / 2 + glassThk / 2]} castShadow>
        <boxGeometry args={[w - trim * 2, h - trim * 3, glassThk]} />
        <meshStandardMaterial
          color="#0a0a0c"
          roughness={0.08}
          metalness={0.0}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* Handle bar across the top */}
      <mesh
        position={[0, h - trim, d / 2 + mmToM(35)]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[mmToM(8), mmToM(8), w - trim * 3, 16]} />
        <Pbr materialId={materials.handle ?? "metal-stainless"} />
      </mesh>
      {/* Control strip */}
      <mesh position={[0, h - trim / 2, d / 2 + mmToM(2)]}>
        <boxGeometry args={[w - trim, trim, mmToM(4)]} />
        <Pbr materialId="matte-black" roughness={0.3} />
      </mesh>
    </group>
  );
}
