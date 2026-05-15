import type { CatalogEntry, SkuCode } from "@/types";

/** Hardcoded SKU library — ~22 entries spanning every primitive kind.
 * Real product specs would be dropped in here later. */
export const CATALOG: readonly CatalogEntry[] = [
  // ─── Base cabinets ──────────────────────────────────────────────
  {
    sku: "BC-600-2D",
    name: "Base Cabinet 600 — 2 Door",
    category: "base_cabinet",
    kind: "base_cabinet",
    defaultDimensions: { width: 600, height: 870, depth: 580 },
    dimensionRanges: { width: [300, 1200], height: [800, 920], depth: [500, 650] },
    defaultMaterials: { carcass: "matte-white", door: "matte-white", handle: "metal-stainless" },
    config: { frontStyle: "doors", doorCount: 2, handleType: "bar" },
  },
  {
    sku: "BC-450-1D",
    name: "Base Cabinet 450 — 1 Door",
    category: "base_cabinet",
    kind: "base_cabinet",
    defaultDimensions: { width: 450, height: 870, depth: 580 },
    dimensionRanges: { width: [300, 600], height: [800, 920], depth: [500, 650] },
    defaultMaterials: { carcass: "wood-oak", door: "wood-oak", handle: "metal-brass-brushed" },
    config: { frontStyle: "doors", doorCount: 1, handleType: "knob" },
  },
  {
    sku: "BC-600-3DR",
    name: "Drawer Stack 600 — 3 Drawer",
    category: "base_cabinet",
    kind: "base_cabinet",
    defaultDimensions: { width: 600, height: 870, depth: 580 },
    dimensionRanges: { width: [400, 1000], height: [800, 920], depth: [500, 650] },
    defaultMaterials: { carcass: "matte-sage", door: "matte-sage", handle: "metal-stainless" },
    config: { frontStyle: "drawers", drawerCount: 3, handleType: "bar" },
  },

  // ─── Wall cabinets ──────────────────────────────────────────────
  {
    sku: "WC-600-2D",
    name: "Wall Cabinet 600 — 2 Door",
    category: "wall_cabinet",
    kind: "wall_cabinet",
    defaultDimensions: { width: 600, height: 720, depth: 320 },
    dimensionRanges: { width: [300, 1200], height: [400, 900], depth: [280, 400] },
    defaultMaterials: { carcass: "matte-white", door: "matte-white", handle: "metal-stainless" },
    config: { doorCount: 2, handleType: "bar" },
  },
  {
    sku: "WC-600-GLASS",
    name: "Wall Cabinet 600 — Glass Door",
    category: "wall_cabinet",
    kind: "wall_cabinet",
    defaultDimensions: { width: 600, height: 720, depth: 320 },
    dimensionRanges: { width: [400, 800], height: [400, 900], depth: [280, 400] },
    defaultMaterials: { carcass: "matte-white", door: "glass-clear", handle: "metal-brass-brushed" },
    config: { doorCount: 1, handleType: "knob", glassInsert: true },
  },

  // ─── Tall cabinets ──────────────────────────────────────────────
  {
    sku: "TC-600-LARDER",
    name: "Larder 600",
    category: "tall_cabinet",
    kind: "tall_cabinet",
    defaultDimensions: { width: 600, height: 2150, depth: 580 },
    dimensionRanges: { width: [400, 1000], height: [1800, 2400], depth: [500, 650] },
    defaultMaterials: { carcass: "matte-white", door: "matte-white", handle: "metal-stainless" },
    config: { doorCount: 2, handleType: "bar" },
  },

  // ─── Worktops ──────────────────────────────────────────────────
  {
    sku: "WT-QUARTZ-WHITE",
    name: "Quartz Worktop — White",
    category: "worktop",
    kind: "worktop",
    defaultDimensions: { width: 2400, height: 40, depth: 600 },
    dimensionRanges: { width: [600, 4000], height: [20, 60], depth: [500, 800] },
    defaultMaterials: { surface: "stone-quartz-white" },
  },
  {
    sku: "WT-OAK-BLOCK",
    name: "Oak Block Worktop",
    category: "worktop",
    kind: "worktop",
    defaultDimensions: { width: 2400, height: 40, depth: 600 },
    dimensionRanges: { width: [600, 4000], height: [30, 60], depth: [500, 800] },
    defaultMaterials: { surface: "wood-oak" },
  },

  // ─── Sink + tap ────────────────────────────────────────────────
  {
    sku: "SK-1B-DRAINER",
    name: "Inset Sink — 1 Bowl + Drainer",
    category: "sink",
    kind: "sink",
    defaultDimensions: { width: 900, height: 180, depth: 500 },
    dimensionRanges: { width: [500, 1200], height: [150, 220], depth: [400, 600] },
    defaultMaterials: { body: "metal-stainless" },
    config: { bowls: 1, drainer: true },
  },
  {
    sku: "SK-2B",
    name: "Undermount Sink — 2 Bowl",
    category: "sink",
    kind: "sink",
    defaultDimensions: { width: 800, height: 200, depth: 450 },
    dimensionRanges: { width: [600, 1000], height: [150, 220], depth: [400, 550] },
    defaultMaterials: { body: "metal-stainless" },
    config: { bowls: 2, drainer: false },
  },
  {
    sku: "TAP-SWAN",
    name: "Mixer Tap — Swan",
    category: "tap",
    kind: "tap",
    defaultDimensions: { width: 60, height: 320, depth: 220 },
    dimensionRanges: { width: [40, 80], height: [220, 420], depth: [150, 280] },
    defaultMaterials: { body: "metal-chrome" },
    config: { style: "swan" },
  },

  // ─── Hob / Oven ────────────────────────────────────────────────
  {
    sku: "HOB-INDUCTION-4",
    name: "Induction Hob — 4 Zone",
    category: "hob",
    kind: "hob",
    defaultDimensions: { width: 600, height: 50, depth: 520 },
    dimensionRanges: { width: [580, 900], height: [40, 60], depth: [490, 550] },
    defaultMaterials: { surface: "stone-granite-black" },
    config: { burners: 4, type: "induction" },
  },
  {
    sku: "HOB-GAS-5",
    name: "Gas Hob — 5 Burner",
    category: "hob",
    kind: "hob",
    defaultDimensions: { width: 750, height: 90, depth: 520 },
    dimensionRanges: { width: [580, 900], height: [60, 110], depth: [490, 550] },
    defaultMaterials: { surface: "stone-granite-black" },
    config: { burners: 5, type: "gas" },
  },
  {
    sku: "OVEN-600-SS",
    name: "Built-in Oven 600",
    category: "oven",
    kind: "oven",
    defaultDimensions: { width: 595, height: 595, depth: 560 },
    dimensionRanges: { width: [580, 600], height: [580, 600], depth: [550, 580] },
    defaultMaterials: { body: "metal-stainless", door: "matte-black", handle: "metal-stainless" },
  },

  // ─── Fridge / Dishwasher ───────────────────────────────────────
  {
    sku: "FRIDGE-FF-600",
    name: "Fridge Freezer 600",
    category: "fridge",
    kind: "fridge",
    defaultDimensions: { width: 600, height: 1850, depth: 650 },
    dimensionRanges: { width: [550, 900], height: [1500, 2000], depth: [600, 700] },
    defaultMaterials: { body: "metal-stainless", door: "metal-stainless", handle: "metal-stainless" },
    config: { layout: "fridge_freezer" },
  },
  {
    sku: "DW-600-INT",
    name: "Dishwasher 600 — Integrated",
    category: "dishwasher",
    kind: "dishwasher",
    defaultDimensions: { width: 600, height: 820, depth: 570 },
    dimensionRanges: { width: [450, 600], height: [800, 870], depth: [550, 600] },
    defaultMaterials: { body: "matte-black", door: "matte-white", handle: "metal-stainless" },
    config: { variant: "integrated" },
  },

  // ─── Wall / Window / Floor / Ceiling ───────────────────────────
  {
    sku: "WALL-PAINT",
    name: "Painted Wall",
    category: "wall",
    kind: "wall",
    defaultDimensions: { width: 3000, height: 2600, depth: 100 },
    dimensionRanges: { width: [500, 8000], height: [2200, 3200], depth: [70, 200] },
    defaultMaterials: { surface: "paint-warm-white" },
  },
  {
    sku: "WIN-1200",
    name: "Window 1200×1200",
    category: "window",
    kind: "window_unit",
    defaultDimensions: { width: 1200, height: 1200, depth: 80 },
    dimensionRanges: { width: [600, 2400], height: [600, 2200], depth: [60, 120] },
    defaultMaterials: { frame: "paint-warm-white" },
  },
  {
    sku: "FLOOR-PATCH",
    name: "Tiled Floor Patch",
    category: "floor",
    kind: "floor_patch",
    defaultDimensions: { width: 1500, height: 10, depth: 1500 },
    dimensionRanges: { width: [500, 6000], height: [5, 30], depth: [500, 6000] },
    defaultMaterials: { surface: "stone-marble" },
  },

  // ─── Lights ────────────────────────────────────────────────────
  {
    sku: "PEND-DOME-300",
    name: "Pendant — Dome 300",
    category: "light",
    kind: "pendant_light",
    defaultDimensions: { width: 300, height: 220, depth: 300 },
    dimensionRanges: { width: [150, 500], height: [100, 400], depth: [150, 500] },
    defaultMaterials: { shade: "matte-black" },
  },
  {
    sku: "DOWN-90",
    name: "Recessed Downlight 90mm",
    category: "light",
    kind: "spot_light",
    defaultDimensions: { width: 90, height: 60, depth: 90 },
    dimensionRanges: { width: [60, 120], height: [40, 100], depth: [60, 120] },
    defaultMaterials: { housing: "metal-stainless" },
  },
  {
    sku: "STRIP-UNDER",
    name: "Under-Cabinet LED Strip",
    category: "light",
    kind: "under_cabinet_strip",
    defaultDimensions: { width: 600, height: 12, depth: 30 },
    dimensionRanges: { width: [200, 1200], height: [8, 20], depth: [20, 50] },
    defaultMaterials: {},
  },
];

const CATALOG_BY_SKU: Record<SkuCode, CatalogEntry> = Object.fromEntries(
  CATALOG.map((e) => [e.sku, e]),
);

export function getCatalogEntry(sku: SkuCode): CatalogEntry | undefined {
  return CATALOG_BY_SKU[sku];
}
