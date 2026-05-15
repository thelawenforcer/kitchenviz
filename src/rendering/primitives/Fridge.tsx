import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface FridgeProps {
  dimensions: Dimensions;
  materials: { body?: MaterialId; door?: MaterialId; handle?: MaterialId };
  /** "single" — one full-height door. "fridge_freezer" — two stacked
   * doors (fridge above, freezer below). */
  layout?: "single" | "fridge_freezer";
}

/** Tall freestanding box. Origin: footprint centre, base at Y=0. */
export function Fridge({
  dimensions,
  materials,
  layout = "fridge_freezer",
}: FridgeProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  const gap = mmToM(4);
  const doorThk = mmToM(20);

  const bodyMat = materials.body ?? "metal-stainless";
  const doorMat = materials.door ?? bodyMat;

  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <Pbr materialId={bodyMat} />
      </mesh>

      {layout === "single" ? (
        <DoorWithHandle
          x={0}
          y={h / 2}
          z={d / 2 + doorThk / 2}
          dw={w - gap * 2}
          dh={h - gap * 2}
          thk={doorThk}
          material={doorMat}
          handleMaterial={materials.handle ?? "metal-stainless"}
        />
      ) : (
        <>
          {(() => {
            const splitY = h * 0.62;
            const upperH = splitY - gap * 1.5;
            const lowerH = h - splitY - gap * 1.5;
            return (
              <>
                <DoorWithHandle
                  x={0}
                  y={h - upperH / 2 - gap}
                  z={d / 2 + doorThk / 2}
                  dw={w - gap * 2}
                  dh={upperH}
                  thk={doorThk}
                  material={doorMat}
                  handleMaterial={materials.handle ?? "metal-stainless"}
                />
                <DoorWithHandle
                  x={0}
                  y={lowerH / 2 + gap}
                  z={d / 2 + doorThk / 2}
                  dw={w - gap * 2}
                  dh={lowerH}
                  thk={doorThk}
                  material={doorMat}
                  handleMaterial={materials.handle ?? "metal-stainless"}
                />
              </>
            );
          })()}
        </>
      )}
    </group>
  );
}

function DoorWithHandle({
  x,
  y,
  z,
  dw,
  dh,
  thk,
  material,
  handleMaterial,
}: {
  x: number;
  y: number;
  z: number;
  dw: number;
  dh: number;
  thk: number;
  material: MaterialId;
  handleMaterial: MaterialId;
}) {
  return (
    <group>
      <mesh position={[x, y, z]} castShadow receiveShadow>
        <boxGeometry args={[dw, dh, thk]} />
        <Pbr materialId={material} />
      </mesh>
      <mesh
        position={[x + dw / 2 - mmToM(50), y, z + thk / 2 + mmToM(15)]}
        castShadow
      >
        <cylinderGeometry args={[mmToM(8), mmToM(8), Math.min(dh * 0.4, mmToM(300)), 16]} />
        <Pbr materialId={handleMaterial} />
      </mesh>
    </group>
  );
}
