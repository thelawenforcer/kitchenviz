import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { getCatalogEntry } from "@/catalog/entries";
import { mmToM } from "@/types";
import type { Dimensions, ItemKind, PlacedItem } from "@/types";
import { BaseCabinet } from "./primitives/BaseCabinet";

interface Props {
  item: PlacedItem;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

export function ItemRenderer({ item, onPointerDown }: Props) {
  const entry = getCatalogEntry(item.sku);
  const resolved = useMemo(() => {
    if (!entry) return null;
    const dims: Dimensions = { ...entry.defaultDimensions, ...(item.dimensionOverrides ?? {}) };
    const materials = { ...entry.defaultMaterials, ...(item.materialOverrides ?? {}) };
    const config = { ...(entry.config ?? {}), ...(item.configOverrides ?? {}) } as Record<string, unknown>;
    return { dims, materials, config, kind: entry.kind };
  }, [entry, item.dimensionOverrides, item.materialOverrides, item.configOverrides]);

  if (!entry || !resolved) {
    if (import.meta.env.DEV) {
      console.warn(`[ItemRenderer] missing catalog entry for sku=${item.sku}`);
    }
    return null;
  }

  return (
    <group
      position={[mmToM(item.position[0]), mmToM(item.position[1]), mmToM(item.position[2])]}
      rotation={[0, item.rotationY, 0]}
      userData={{ itemId: item.id }}
      onPointerDown={onPointerDown}
    >
      {renderKind(resolved.kind, resolved)}
    </group>
  );
}

function renderKind(
  kind: ItemKind,
  r: { dims: Dimensions; materials: Record<string, string>; config: Record<string, unknown> },
) {
  switch (kind) {
    case "base_cabinet":
      return (
        <BaseCabinet
          dimensions={r.dims}
          materials={r.materials}
          frontStyle={(r.config.frontStyle as "doors" | "drawers" | undefined) ?? "doors"}
          doorCount={(r.config.doorCount as 1 | 2 | undefined) ?? 2}
          drawerCount={(r.config.drawerCount as 2 | 3 | 4 | undefined) ?? 3}
          handleType={(r.config.handleType as "bar" | "knob" | "none" | undefined) ?? "bar"}
        />
      );
    // remaining kinds are wired up in milestone 5
    default:
      return null;
  }
}
