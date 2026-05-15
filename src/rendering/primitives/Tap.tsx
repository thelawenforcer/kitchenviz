import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface TapProps {
  dimensions: Dimensions;
  materials: { body?: MaterialId };
  style?: "swan" | "pillar";
}

/** A simple mixer tap. Origin: base centre at Y=0 (sits on a worktop or
 * sink rim). Height comes from dimensions.height; depth/width tuned to
 * match a typical fixture. */
export function Tap({ dimensions, materials, style = "swan" }: TapProps) {
  const totalH = mmToM(dimensions.height);
  const baseR = mmToM(dimensions.width / 2);
  const stemH = totalH * 0.55;
  const spoutLen = mmToM(dimensions.depth);
  const mat = materials.body ?? "metal-chrome";

  return (
    <group>
      {/* Base puck */}
      <mesh position={[0, mmToM(8), 0]} castShadow receiveShadow>
        <cylinderGeometry args={[baseR, baseR, mmToM(16), 24]} />
        <Pbr materialId={mat} />
      </mesh>
      {/* Body / stem */}
      <mesh position={[0, mmToM(16) + stemH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[mmToM(15), mmToM(18), stemH, 16]} />
        <Pbr materialId={mat} />
      </mesh>

      {style === "swan" ? (
        <>
          {/* Curved spout: torus segment */}
          <mesh
            position={[0, mmToM(16) + stemH, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <torusGeometry args={[spoutLen / 2, mmToM(10), 12, 24, Math.PI]} />
            <Pbr materialId={mat} />
          </mesh>
          {/* Outlet */}
          <mesh
            position={[0, mmToM(16) + stemH - mmToM(10), spoutLen / 2 + mmToM(2)]}
            castShadow
          >
            <cylinderGeometry args={[mmToM(12), mmToM(12), mmToM(20), 16]} />
            <Pbr materialId={mat} />
          </mesh>
        </>
      ) : (
        <>
          {/* Straight pillar spout */}
          <mesh
            position={[0, mmToM(16) + stemH + mmToM(10), spoutLen / 2]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[mmToM(10), mmToM(10), spoutLen, 16]} />
            <Pbr materialId={mat} />
          </mesh>
        </>
      )}
      {/* Lever handle */}
      <mesh
        position={[0, mmToM(16) + stemH + mmToM(20), -mmToM(10)]}
        rotation={[0, 0, Math.PI / 4]}
        castShadow
      >
        <boxGeometry args={[mmToM(8), mmToM(80), mmToM(8)]} />
        <Pbr materialId={mat} />
      </mesh>
    </group>
  );
}
