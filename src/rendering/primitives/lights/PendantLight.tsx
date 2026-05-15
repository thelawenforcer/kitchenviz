import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../../materials";

export interface PendantLightProps {
  dimensions: Dimensions;
  materials: { shade?: MaterialId };
  intensity?: number;
  color?: string;
  /** Length of the cord above the shade. */
  cordLength?: number;
}

/** A hanging pendant: cord, dome shade, emissive bulb, and a point
 * light. Origin: bulb position at Y=0 — set position.y to where the
 * light should hang. The cord rises from there to ceiling height. */
export function PendantLight({
  dimensions,
  materials,
  intensity = 8,
  color = "#ffe6b8",
  cordLength = 600,
}: PendantLightProps) {
  const r = mmToM(dimensions.width / 2);
  const h = mmToM(dimensions.height);
  const cord = mmToM(cordLength);

  return (
    <group>
      {/* Cord */}
      <mesh position={[0, h + cord / 2, 0]}>
        <cylinderGeometry args={[mmToM(2), mmToM(2), cord, 6]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.8} />
      </mesh>
      {/* Shade — open dome */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <coneGeometry args={[r, h, 24, 1, true]} />
        <Pbr materialId={materials.shade ?? "matte-black"} />
      </mesh>
      {/* Emissive bulb */}
      <mesh position={[0, mmToM(20), 0]}>
        <sphereGeometry args={[mmToM(20), 16, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          roughness={0.3}
        />
      </mesh>
      <pointLight
        position={[0, mmToM(10), 0]}
        intensity={intensity}
        color={color}
        distance={5}
        decay={2}
        castShadow
      />
    </group>
  );
}
