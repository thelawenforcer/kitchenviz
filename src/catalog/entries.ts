import type { CatalogEntry, SkuCode } from "@/types";

/** Hardcoded SKU library. Milestone 5 fills in the full set
 * (~20 entries) covering every primitive kind. */
export const CATALOG: readonly CatalogEntry[] = [
  {
    sku: "BC-600-2D",
    name: "Base Cabinet 600 — 2 Door",
    category: "base_cabinet",
    kind: "base_cabinet",
    defaultDimensions: { width: 600, height: 870, depth: 580 },
    dimensionRanges: {
      width: [300, 1200],
      height: [800, 920],
      depth: [500, 650],
    },
    defaultMaterials: {
      carcass: "matte-white",
      door: "matte-white",
      handle: "metal-stainless",
    },
    config: { frontStyle: "doors", doorCount: 2, handleType: "bar" },
  },
];

const CATALOG_BY_SKU: Record<SkuCode, CatalogEntry> = Object.fromEntries(
  CATALOG.map((e) => [e.sku, e]),
);

export function getCatalogEntry(sku: SkuCode): CatalogEntry | undefined {
  return CATALOG_BY_SKU[sku];
}
