import { getMaterial } from "@/catalog/materials";
import type { MaterialId } from "@/types";

interface PbrProps {
  materialId?: MaterialId | null;
  /** Override roughness (e.g. for a glass-insert door). */
  roughness?: number;
  /** Override metalness. */
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
}

/** Resolve a MaterialId into a <meshStandardMaterial>. Centralised so
 * primitives never reach into the preset table directly. */
export function Pbr({
  materialId,
  roughness,
  metalness,
  transparent,
  opacity,
}: PbrProps) {
  const m = getMaterial(materialId);
  return (
    <meshStandardMaterial
      color={m.baseColor}
      roughness={roughness ?? m.roughness}
      metalness={metalness ?? m.metalness}
      transparent={transparent}
      opacity={opacity}
    />
  );
}
