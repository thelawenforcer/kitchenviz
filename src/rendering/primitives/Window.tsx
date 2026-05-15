import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface WindowProps {
  dimensions: Dimensions;
  materials: { frame?: MaterialId };
  /** Soft daylight wash from the window opening. */
  light?: boolean;
}

/** Frame + glass plane. Origin: rectangle centre at Y = midpoint of
 * the window. */
export function WindowUnit({ dimensions, materials, light = true }: WindowProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const t = mmToM(dimensions.depth);
  const frameThk = mmToM(60);

  const frameMat = materials.frame ?? "paint-warm-white";

  return (
    <group>
      {/* Frame: top */}
      <mesh position={[0, h / 2 - frameThk / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, frameThk, t]} />
        <Pbr materialId={frameMat} />
      </mesh>
      {/* bottom */}
      <mesh position={[0, -h / 2 + frameThk / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, frameThk, t]} />
        <Pbr materialId={frameMat} />
      </mesh>
      {/* left */}
      <mesh position={[-w / 2 + frameThk / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameThk, h - frameThk * 2, t]} />
        <Pbr materialId={frameMat} />
      </mesh>
      {/* right */}
      <mesh position={[w / 2 - frameThk / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameThk, h - frameThk * 2, t]} />
        <Pbr materialId={frameMat} />
      </mesh>
      {/* mullion */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[mmToM(40), h - frameThk * 2, t]} />
        <Pbr materialId={frameMat} />
      </mesh>
      {/* Glass plane */}
      <mesh>
        <planeGeometry args={[w - frameThk * 2, h - frameThk * 2]} />
        <meshStandardMaterial
          color="#bcd0d6"
          roughness={0.05}
          metalness={0}
          transparent
          opacity={0.35}
          envMapIntensity={1.6}
        />
      </mesh>
      {light && (
        // soft fill from the window plane
        <rectAreaLight
          width={w - frameThk * 2}
          height={h - frameThk * 2}
          intensity={2.5}
          color="#fff5e6"
          position={[0, 0, -mmToM(5)]}
          rotation={[0, Math.PI, 0]}
        />
      )}
    </group>
  );
}
