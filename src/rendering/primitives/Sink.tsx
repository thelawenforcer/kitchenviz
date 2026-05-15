import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface SinkProps {
  dimensions: Dimensions;
  materials: { body?: MaterialId };
  bowls?: 1 | 2;
  drainer?: boolean;
}

/** Inset stainless basin sitting on top of a worktop slot. The basin is
 * an "inverted L" of plates approximating bowl geometry — readable but
 * cheap to render. Origin: footprint centre, top rim at Y=0. */
export function Sink({ dimensions, materials, bowls = 1, drainer = false }: SinkProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height); // basin depth
  const d = mmToM(dimensions.depth);
  const wall = mmToM(2);
  const lip = mmToM(20);

  const mat = materials.body ?? "metal-stainless";

  // basin region width (excl drainer)
  const drainerWidth = drainer ? w * 0.35 : 0;
  const basinW = w - drainerWidth;
  const basinX = drainer ? -drainerWidth / 2 : 0;

  const basins = bowls === 2
    ? [
        { x: basinX - basinW / 4, w: basinW / 2 - lip },
        { x: basinX + basinW / 4, w: basinW / 2 - lip },
      ]
    : [{ x: basinX, w: basinW - lip }];

  return (
    <group>
      {/* Top rim plate */}
      <mesh position={[0, -lip / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, lip, d]} />
        <Pbr materialId={mat} />
      </mesh>

      {basins.map((b, i) => (
        <group key={i} position={[b.x, 0, 0]}>
          {/* Bottom */}
          <mesh position={[0, -h, 0]} receiveShadow castShadow>
            <boxGeometry args={[b.w, wall, d - lip]} />
            <Pbr materialId={mat} />
          </mesh>
          {/* Walls */}
          <mesh position={[0, -h / 2, (d - lip) / 2 - wall / 2]} receiveShadow castShadow>
            <boxGeometry args={[b.w, h, wall]} />
            <Pbr materialId={mat} />
          </mesh>
          <mesh position={[0, -h / 2, -((d - lip) / 2 - wall / 2)]} receiveShadow castShadow>
            <boxGeometry args={[b.w, h, wall]} />
            <Pbr materialId={mat} />
          </mesh>
          <mesh position={[b.w / 2 - wall / 2, -h / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[wall, h, d - lip - wall * 2]} />
            <Pbr materialId={mat} />
          </mesh>
          <mesh position={[-b.w / 2 + wall / 2, -h / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[wall, h, d - lip - wall * 2]} />
            <Pbr materialId={mat} />
          </mesh>
        </group>
      ))}

      {drainer && (
        // Stamped drainer panel — a shallow tray with a few ribs
        <group position={[w / 2 - drainerWidth / 2, -mmToM(8), 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[drainerWidth - lip, mmToM(4), d - lip]} />
            <Pbr materialId={mat} />
          </mesh>
        </group>
      )}
    </group>
  );
}
