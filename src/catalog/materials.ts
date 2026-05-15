import type { MaterialPreset, MaterialId } from "@/types";

/** Seed library — milestone 6 expands this to ~15 entries spanning
 * laminate, wood, stone, metal and paint. */
export const MATERIAL_PRESETS: readonly MaterialPreset[] = [
  // Laminate / paint
  { id: "matte-white", name: "Matte White", baseColor: "#f3f0ea", roughness: 0.55, metalness: 0, family: "paint" },
  { id: "matte-sage", name: "Matte Sage", baseColor: "#9aa68c", roughness: 0.6, metalness: 0, family: "paint" },
  { id: "matte-black", name: "Matte Black", baseColor: "#1a1a1c", roughness: 0.55, metalness: 0, family: "paint" },
  { id: "gloss-white", name: "Gloss White", baseColor: "#f6f4ee", roughness: 0.18, metalness: 0, family: "laminate" },
  { id: "gloss-navy", name: "Gloss Navy", baseColor: "#1f2c45", roughness: 0.2, metalness: 0, family: "laminate" },
  { id: "paint-warm-white", name: "Warm White", baseColor: "#ece6d9", roughness: 0.85, metalness: 0, family: "paint" },

  // Wood
  { id: "wood-oak", name: "Oak", baseColor: "#c8a274", roughness: 0.55, metalness: 0, family: "wood" },
  { id: "wood-walnut", name: "Walnut", baseColor: "#5b3a22", roughness: 0.5, metalness: 0, family: "wood" },
  { id: "wood-ash", name: "Ash", baseColor: "#d8c69b", roughness: 0.6, metalness: 0, family: "wood" },

  // Stone
  { id: "stone-quartz-white", name: "White Quartz", baseColor: "#ece8e0", roughness: 0.28, metalness: 0, family: "stone" },
  { id: "stone-granite-black", name: "Black Granite", baseColor: "#1d1d20", roughness: 0.32, metalness: 0, family: "stone" },
  { id: "stone-marble", name: "Marble", baseColor: "#e6e3da", roughness: 0.22, metalness: 0, family: "stone" },
  { id: "stone-concrete", name: "Concrete", baseColor: "#9b9a96", roughness: 0.78, metalness: 0, family: "stone" },

  // Metal
  { id: "metal-stainless", name: "Stainless Steel", baseColor: "#cfd2d6", roughness: 0.32, metalness: 0.9, family: "metal" },
  { id: "metal-brass-brushed", name: "Brushed Brass", baseColor: "#b89668", roughness: 0.42, metalness: 0.85, family: "metal" },
  { id: "metal-chrome", name: "Chrome", baseColor: "#e6e8eb", roughness: 0.08, metalness: 1.0, family: "metal" },

  // Glass
  { id: "glass-clear", name: "Clear Glass", baseColor: "#bfd4d8", roughness: 0.05, metalness: 0, family: "glass" },
];

const MATERIAL_BY_ID: Record<MaterialId, MaterialPreset> = Object.fromEntries(
  MATERIAL_PRESETS.map((m) => [m.id, m]),
);

const FALLBACK: MaterialPreset = {
  id: "__fallback",
  name: "Missing material",
  baseColor: "#ff00ff",
  roughness: 0.6,
  metalness: 0,
  family: "paint",
};

export function getMaterial(id: MaterialId | undefined | null): MaterialPreset {
  if (!id) return FALLBACK;
  return MATERIAL_BY_ID[id] ?? FALLBACK;
}
