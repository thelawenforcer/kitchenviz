import { mmToM } from "@/types";
import type { Dimensions, MaterialId } from "@/types";
import { Pbr } from "../materials";

export interface BaseCabinetProps {
  dimensions: Dimensions;
  materials: {
    carcass?: MaterialId;
    door?: MaterialId;
    handle?: MaterialId;
  };
  /** "doors" → 1–2 hinged doors. "drawers" → stacked drawer fronts. */
  frontStyle?: "doors" | "drawers";
  doorCount?: 1 | 2;
  drawerCount?: 2 | 3 | 4;
  handleType?: "bar" | "knob" | "none";
}

const TOE_KICK_HEIGHT = 100; // mm
const CARCASS_THICKNESS = 18; // mm
const DOOR_GAP = 3; // mm gap around each door
const DOOR_THICKNESS = 18; // mm

/** A box-frame base cabinet: toe kick at the floor, carcass body, then
 * one or two door fronts (or a stack of drawer fronts), with simple
 * handle hardware. Dimensions in mm; rendered at the unit's local
 * origin (centre of footprint, base on the floor). */
export function BaseCabinet({
  dimensions,
  materials,
  frontStyle = "doors",
  doorCount = 2,
  drawerCount = 3,
  handleType = "bar",
}: BaseCabinetProps) {
  const w = mmToM(dimensions.width);
  const h = mmToM(dimensions.height);
  const d = mmToM(dimensions.depth);
  const toe = mmToM(TOE_KICK_HEIGHT);
  const tk = mmToM(CARCASS_THICKNESS);
  const doorThk = mmToM(DOOR_THICKNESS);
  const gap = mmToM(DOOR_GAP);

  const carcassH = h - toe;
  const carcassY = toe + carcassH / 2;

  return (
    <group>
      {/* Toe kick — recessed slightly */}
      <mesh
        position={[0, toe / 2, -mmToM(20)]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w - mmToM(40), toe, d - mmToM(40)]} />
        <Pbr materialId={materials.carcass ?? "matte-black"} />
      </mesh>

      {/* Carcass body */}
      <mesh position={[0, carcassY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, carcassH, d]} />
        <Pbr materialId={materials.carcass ?? "matte-white"} />
      </mesh>

      {/* Inner cavity to read as a real cabinet (slightly inset back face) */}
      <mesh
        position={[0, carcassY, tk / 2]}
        castShadow={false}
        receiveShadow
      >
        <boxGeometry args={[w - tk * 2, carcassH - tk * 2, d - tk * 2]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.95} metalness={0} side={2} />
      </mesh>

      {frontStyle === "doors"
        ? renderDoors({ w, carcassH, carcassY, d, doorThk, gap, doorCount, materials, handleType })
        : renderDrawers({ w, carcassH, carcassY, d, doorThk, gap, drawerCount, materials, handleType })}
    </group>
  );
}

interface FrontGeom {
  w: number;
  carcassH: number;
  carcassY: number;
  d: number;
  doorThk: number;
  gap: number;
  materials: BaseCabinetProps["materials"];
  handleType: NonNullable<BaseCabinetProps["handleType"]>;
}

function renderDoors({
  w,
  carcassH,
  carcassY,
  d,
  doorThk,
  gap,
  doorCount,
  materials,
  handleType,
}: FrontGeom & { doorCount: 1 | 2 }) {
  const doorH = carcassH - gap * 2;
  const doorY = carcassY;
  const z = d / 2 + doorThk / 2;
  const doorMat = materials.door ?? materials.carcass ?? "matte-white";

  if (doorCount === 1) {
    const doorW = w - gap * 2;
    return (
      <group>
        <mesh position={[0, doorY, z]} castShadow receiveShadow>
          <boxGeometry args={[doorW, doorH, doorThk]} />
          <Pbr materialId={doorMat} />
        </mesh>
        {handle({ x: doorW / 2 - mmToM(40), y: doorY, z: z + doorThk / 2, type: handleType, material: materials.handle, vertical: true })}
      </group>
    );
  }

  const doorW = (w - gap * 3) / 2;
  const xLeft = -(doorW / 2 + gap / 2);
  const xRight = doorW / 2 + gap / 2;
  return (
    <group>
      <mesh position={[xLeft, doorY, z]} castShadow receiveShadow>
        <boxGeometry args={[doorW, doorH, doorThk]} />
        <Pbr materialId={doorMat} />
      </mesh>
      <mesh position={[xRight, doorY, z]} castShadow receiveShadow>
        <boxGeometry args={[doorW, doorH, doorThk]} />
        <Pbr materialId={doorMat} />
      </mesh>
      {handle({ x: xLeft + doorW / 2 - mmToM(40), y: doorY, z: z + doorThk / 2, type: handleType, material: materials.handle, vertical: true })}
      {handle({ x: xRight - doorW / 2 + mmToM(40), y: doorY, z: z + doorThk / 2, type: handleType, material: materials.handle, vertical: true })}
    </group>
  );
}

function renderDrawers({
  w,
  carcassH,
  carcassY,
  d,
  doorThk,
  gap,
  drawerCount,
  materials,
  handleType,
}: FrontGeom & { drawerCount: 2 | 3 | 4 }) {
  const totalGap = gap * (drawerCount + 1);
  const drawerH = (carcassH - totalGap) / drawerCount;
  const drawerW = w - gap * 2;
  const z = d / 2 + doorThk / 2;
  const doorMat = materials.door ?? materials.carcass ?? "matte-white";
  const bottom = carcassY - carcassH / 2;

  const drawers = Array.from({ length: drawerCount }, (_, i) => {
    const y = bottom + gap + drawerH / 2 + i * (drawerH + gap);
    return (
      <group key={i}>
        <mesh position={[0, y, z]} castShadow receiveShadow>
          <boxGeometry args={[drawerW, drawerH, doorThk]} />
          <Pbr materialId={doorMat} />
        </mesh>
        {handle({ x: 0, y, z: z + doorThk / 2, type: handleType, material: materials.handle, vertical: false, length: Math.min(drawerW * 0.4, mmToM(250)) })}
      </group>
    );
  });
  return <group>{drawers}</group>;
}

interface HandleProps {
  x: number;
  y: number;
  z: number;
  type: "bar" | "knob" | "none";
  material?: MaterialId;
  vertical: boolean;
  length?: number;
}

function handle({ x, y, z, type, material, vertical, length }: HandleProps) {
  if (type === "none") return null;
  const mat = material ?? "metal-stainless";
  if (type === "knob") {
    return (
      <mesh position={[x, y, z + mmToM(8)]} castShadow>
        <sphereGeometry args={[mmToM(10), 16, 12]} />
        <Pbr materialId={mat} />
      </mesh>
    );
  }
  // bar
  const len = length ?? mmToM(120);
  const standoff = mmToM(15);
  const args: [number, number, number, number] = [mmToM(6), mmToM(6), len, 12];
  if (vertical) {
    return (
      <mesh position={[x, y, z + standoff]} castShadow rotation={[0, 0, 0]}>
        <cylinderGeometry args={args} />
        <Pbr materialId={mat} />
      </mesh>
    );
  }
  return (
    <mesh position={[x, y, z + standoff]} castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={args} />
      <Pbr materialId={mat} />
    </mesh>
  );
}
