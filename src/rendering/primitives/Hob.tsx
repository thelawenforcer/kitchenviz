import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface HobProps {
  dimensions: Dimensions;
  materials: { surface?: MaterialId };
  burners?: 2 | 4 | 5;
  type?: "induction" | "gas";
}

/** A flat top-mount hob: a slab of glass-black, with a grid of burner
 * markings (induction) or simple cast burners (gas). Origin: footprint
 * centre, top surface at Y=0. */
export function Hob({
  dimensions,
  materials,
  burners = 4,
  type = "induction",
}: HobProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height); // protrusion above worktop
  const d = mmToM(dimensions.depth);

  const surfaceMat = materials.surface ?? "stone-granite-black";

  const positions: [number, number][] = (() => {
    if (burners === 2) {
      return [
        [-w / 4, 0],
        [w / 4, 0],
      ];
    }
    if (burners === 5) {
      return [
        [-w / 3, d / 4],
        [w / 3, d / 4],
        [-w / 3, -d / 4],
        [w / 3, -d / 4],
        [0, 0],
      ];
    }
    // 4
    return [
      [-w / 4, d / 4],
      [w / 4, d / 4],
      [-w / 4, -d / 4],
      [w / 4, -d / 4],
    ];
  })();

  return (
    <group>
      {/* Slab */}
      <mesh position={[0, -h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <Pbr materialId={surfaceMat} roughness={0.18} />
      </mesh>

      {positions.map(([x, z], i) =>
        type === "gas" ? (
          <group key={i} position={[x, mmToM(2), z]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[mmToM(45), mmToM(45), mmToM(8), 24]} />
              <Pbr materialId="metal-stainless" roughness={0.55} />
            </mesh>
            <mesh position={[0, mmToM(8), 0]} castShadow>
              <torusGeometry args={[mmToM(35), mmToM(4), 12, 24]} />
              <Pbr materialId="metal-stainless" roughness={0.4} />
            </mesh>
          </group>
        ) : (
          <mesh
            key={i}
            position={[x, mmToM(0.5), z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[mmToM(70), mmToM(85), 48]} />
            <meshStandardMaterial color="#3a3a3e" roughness={0.4} metalness={0.1} />
          </mesh>
        ),
      )}
    </group>
  );
}
