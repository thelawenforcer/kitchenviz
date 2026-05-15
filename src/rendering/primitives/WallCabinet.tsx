import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface WallCabinetProps {
  dimensions: Dimensions;
  materials: { carcass?: MaterialId; door?: MaterialId; handle?: MaterialId };
  doorCount?: 1 | 2;
  glassInsert?: boolean;
  handleType?: "bar" | "knob" | "none";
}

const DOOR_GAP = 3;
const DOOR_THK = 18;

export function WallCabinet({
  dimensions,
  materials,
  doorCount = 2,
  glassInsert = false,
  handleType = "bar",
}: WallCabinetProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  const gap = mmToM(DOOR_GAP);
  const doorThk = mmToM(DOOR_THK);

  const doorMat = materials.door ?? materials.carcass ?? "matte-white";
  const doorH = h - gap * 2;
  const z = d / 2 + doorThk / 2;

  const door = (x: number, dw: number) => (
    <group>
      <mesh position={[x, h / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[dw, doorH, doorThk]} />
        <Pbr
          materialId={glassInsert ? "glass-clear" : doorMat}
          transparent={glassInsert}
          opacity={glassInsert ? 0.55 : undefined}
          roughness={glassInsert ? 0.05 : undefined}
        />
      </mesh>
      {handleType !== "none" && (
        <mesh
          position={[x + (dw / 2 - mmToM(40)), h / 2, z + mmToM(15)]}
          castShadow
        >
          {handleType === "knob" ? (
            <sphereGeometry args={[mmToM(10), 16, 12]} />
          ) : (
            <cylinderGeometry args={[mmToM(6), mmToM(6), mmToM(120), 12]} />
          )}
          <Pbr materialId={materials.handle ?? "metal-stainless"} />
        </mesh>
      )}
    </group>
  );

  return (
    <group>
      {/* Carcass */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <Pbr materialId={materials.carcass ?? "matte-white"} />
      </mesh>
      {/* Inner shadow box */}
      <mesh position={[0, h / 2, mmToM(10)]} receiveShadow>
        <boxGeometry args={[w - mmToM(36), h - mmToM(36), d - mmToM(36)]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.95} side={2} />
      </mesh>

      {doorCount === 1
        ? door(0, w - gap * 2)
        : (() => {
            const dw = (w - gap * 3) / 2;
            return (
              <>
                {door(-(dw / 2 + gap / 2), dw)}
                {door(dw / 2 + gap / 2, dw)}
              </>
            );
          })()}
    </group>
  );
}
