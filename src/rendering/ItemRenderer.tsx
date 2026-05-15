import { useEffect, useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";
import { Outlines } from "@react-three/drei";
import { getCatalogEntry } from "@/catalog/entries";
import { useItemRefs } from "@/scene/itemRefs";
import { useScene } from "@/scene/store";
import { mmToM } from "@/types";
import type { Dimensions, ItemKind, MaterialId, PlacedItem } from "@/types";
import { BaseCabinet } from "./primitives/BaseCabinet";
import { WallCabinet } from "./primitives/WallCabinet";
import { TallCabinet } from "./primitives/TallCabinet";
import { Worktop } from "./primitives/Worktop";
import { Sink } from "./primitives/Sink";
import { Hob } from "./primitives/Hob";
import { Oven } from "./primitives/Oven";
import { Fridge } from "./primitives/Fridge";
import { Dishwasher } from "./primitives/Dishwasher";
import { Tap } from "./primitives/Tap";
import { Wall } from "./primitives/Wall";
import { WindowUnit } from "./primitives/Window";
import { Floor } from "./primitives/Floor";
import { Ceiling } from "./primitives/Ceiling";
import { PendantLight } from "./primitives/lights/PendantLight";
import { SpotLight } from "./primitives/lights/SpotLight";
import { UnderCabinetStrip } from "./primitives/lights/UnderCabinetStrip";

interface Props {
  item: PlacedItem;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

interface Resolved {
  dims: Dimensions;
  materials: Record<string, MaterialId>;
  config: Record<string, unknown>;
  kind: ItemKind;
}

export function ItemRenderer({ item, onPointerDown }: Props) {
  const entry = getCatalogEntry(item.sku);
  const groupRef = useRef<Group>(null);
  const register = useItemRefs((s) => s.register);
  const unregister = useItemRefs((s) => s.unregister);
  const isSelected = useScene((s) => s.selectedId === item.id);

  useEffect(() => {
    if (groupRef.current) register(item.id, groupRef.current);
    return () => unregister(item.id);
  }, [item.id, register, unregister]);

  const resolved = useMemo<Resolved | null>(() => {
    if (!entry) return null;
    return {
      dims: { ...entry.defaultDimensions, ...(item.dimensionOverrides ?? {}) },
      materials: { ...entry.defaultMaterials, ...(item.materialOverrides ?? {}) },
      config: { ...(entry.config ?? {}), ...(item.configOverrides ?? {}) },
      kind: entry.kind,
    };
  }, [entry, item.dimensionOverrides, item.materialOverrides, item.configOverrides]);

  if (!entry || !resolved) {
    if (import.meta.env.DEV) {
      console.warn(`[ItemRenderer] missing catalog entry for sku=${item.sku}`);
    }
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={[mmToM(item.position[0]), mmToM(item.position[1]), mmToM(item.position[2])]}
      rotation={[0, item.rotationY, 0]}
      userData={{ itemId: item.id }}
      onPointerDown={onPointerDown}
    >
      {renderKind(resolved)}
      {isSelected && (
        <Outlines thickness={3} color="#7aa2ff" screenspace transparent opacity={0.9} />
      )}
    </group>
  );
}

function renderKind({ dims, materials, config, kind }: Resolved) {
  switch (kind) {
    case "base_cabinet":
      return (
        <BaseCabinet
          dimensions={dims}
          materials={materials}
          frontStyle={(config.frontStyle as "doors" | "drawers" | undefined) ?? "doors"}
          doorCount={(config.doorCount as 1 | 2 | undefined) ?? 2}
          drawerCount={(config.drawerCount as 2 | 3 | 4 | undefined) ?? 3}
          handleType={(config.handleType as "bar" | "knob" | "none" | undefined) ?? "bar"}
        />
      );
    case "wall_cabinet":
      return (
        <WallCabinet
          dimensions={dims}
          materials={materials}
          doorCount={(config.doorCount as 1 | 2 | undefined) ?? 2}
          glassInsert={Boolean(config.glassInsert)}
          handleType={(config.handleType as "bar" | "knob" | "none" | undefined) ?? "bar"}
        />
      );
    case "tall_cabinet":
      return (
        <TallCabinet
          dimensions={dims}
          materials={materials}
          doorCount={(config.doorCount as 1 | 2 | undefined) ?? 2}
          handleType={(config.handleType as "bar" | "knob" | "none" | undefined) ?? "bar"}
        />
      );
    case "worktop":
      return (
        <Worktop
          dimensions={dims}
          materials={materials}
          overhangFront={(config.overhangFront as number | undefined) ?? 0}
        />
      );
    case "sink":
      return (
        <Sink
          dimensions={dims}
          materials={materials}
          bowls={(config.bowls as 1 | 2 | undefined) ?? 1}
          drainer={Boolean(config.drainer)}
        />
      );
    case "hob":
      return (
        <Hob
          dimensions={dims}
          materials={materials}
          burners={(config.burners as 2 | 4 | 5 | undefined) ?? 4}
          type={(config.type as "induction" | "gas" | undefined) ?? "induction"}
        />
      );
    case "oven":
      return <Oven dimensions={dims} materials={materials} />;
    case "fridge":
      return (
        <Fridge
          dimensions={dims}
          materials={materials}
          layout={(config.layout as "single" | "fridge_freezer" | undefined) ?? "fridge_freezer"}
        />
      );
    case "dishwasher":
      return (
        <Dishwasher
          dimensions={dims}
          materials={materials}
          variant={(config.variant as "integrated" | "freestanding" | undefined) ?? "integrated"}
        />
      );
    case "tap":
      return (
        <Tap
          dimensions={dims}
          materials={materials}
          style={(config.style as "swan" | "pillar" | undefined) ?? "swan"}
        />
      );
    case "wall":
      return <Wall dimensions={dims} materials={materials} />;
    case "window_unit":
      return (
        <WindowUnit
          dimensions={dims}
          materials={materials}
          light={(config.light as boolean | undefined) ?? true}
        />
      );
    case "floor_patch":
      return <Floor dimensions={dims} materials={materials} />;
    case "ceiling_patch":
      return <Ceiling dimensions={dims} materials={materials} />;
    case "pendant_light":
      return (
        <PendantLight
          dimensions={dims}
          materials={materials}
          intensity={(config.intensity as number | undefined) ?? 8}
          color={(config.color as string | undefined) ?? "#ffe6b8"}
          cordLength={(config.cordLength as number | undefined) ?? 600}
        />
      );
    case "spot_light":
      return (
        <SpotLight
          dimensions={dims}
          materials={materials}
          intensity={(config.intensity as number | undefined) ?? 12}
          color={(config.color as string | undefined) ?? "#fff2d6"}
          angle={(config.angle as number | undefined) ?? Math.PI / 6}
        />
      );
    case "under_cabinet_strip":
      return (
        <UnderCabinetStrip
          dimensions={dims}
          intensity={(config.intensity as number | undefined) ?? 2}
          color={(config.color as string | undefined) ?? "#fff0d6"}
        />
      );
  }
}
