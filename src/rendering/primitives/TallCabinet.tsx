import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface TallCabinetProps {
  dimensions: Dimensions;
  materials: { carcass?: MaterialId; door?: MaterialId; handle?: MaterialId };
  doorCount?: 1 | 2;
  handleType?: "bar" | "knob" | "none";
}

const TOE_KICK_HEIGHT = 100;
const DOOR_GAP = 3;
const DOOR_THK = 18;

export function TallCabinet({
  dimensions,
  materials,
  doorCount = 2,
  handleType = "bar",
}: TallCabinetProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  const toe = mmToM(TOE_KICK_HEIGHT);
  const gap = mmToM(DOOR_GAP);
  const doorThk = mmToM(DOOR_THK);

  const carcassH = h - toe;
  const carcassY = toe + carcassH / 2;
  const doorMat = materials.door ?? materials.carcass ?? "matte-white";
  const doorH = carcassH - gap * 2;
  const z = d / 2 + doorThk / 2;

  const door = (x: number, dw: number) => (
    <group>
      <mesh position={[x, carcassY, z]} castShadow receiveShadow>
        <boxGeometry args={[dw, doorH, doorThk]} />
        <Pbr materialId={doorMat} />
      </mesh>
      {handleType !== "none" && (
        <mesh
          position={[x + (dw / 2 - mmToM(40)), carcassY, z + mmToM(15)]}
          castShadow
        >
          {handleType === "knob" ? (
            <sphereGeometry args={[mmToM(10), 16, 12]} />
          ) : (
            <cylinderGeometry args={[mmToM(6), mmToM(6), mmToM(180), 12]} />
          )}
          <Pbr materialId={materials.handle ?? "metal-stainless"} />
        </mesh>
      )}
    </group>
  );

  return (
    <group>
      <mesh position={[0, toe / 2, -mmToM(20)]} castShadow receiveShadow>
        <boxGeometry args={[w - mmToM(40), toe, d - mmToM(40)]} />
        <Pbr materialId="matte-black" />
      </mesh>
      <mesh position={[0, carcassY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, carcassH, d]} />
        <Pbr materialId={materials.carcass ?? "matte-white"} />
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
