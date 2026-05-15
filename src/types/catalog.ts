export type SkuCode = string;
export type MaterialId = string;
export type ItemId = string;

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface DimensionRanges {
  width: [min: number, max: number];
  height: [min: number, max: number];
  depth: [min: number, max: number];
}

export type Category =
  | "base_cabinet"
  | "wall_cabinet"
  | "tall_cabinet"
  | "worktop"
  | "sink"
  | "tap"
  | "hob"
  | "oven"
  | "fridge"
  | "dishwasher"
  | "wall"
  | "window"
  | "floor"
  | "ceiling"
  | "light";

/** The discriminator that decides which parametric primitive renders an
 * item. Keep this in sync with the components in
 * `src/rendering/primitives/`. */
export type ItemKind =
  | "base_cabinet"
  | "wall_cabinet"
  | "tall_cabinet"
  | "worktop"
  | "sink"
  | "tap"
  | "hob"
  | "oven"
  | "fridge"
  | "dishwasher"
  | "wall"
  | "window_unit"
  | "floor_patch"
  | "ceiling_patch"
  | "pendant_light"
  | "spot_light"
  | "under_cabinet_strip";

/** Per-kind config knobs. Anything that changes geometry but isn't a
 * dimension lives here. */
export type ItemConfig =
  | { doorCount?: 1 | 2; drawerCount?: 0 | 2 | 3 | 4; handleType?: "bar" | "knob" | "none" }
  | Record<string, never>;

export interface CatalogEntry {
  sku: SkuCode;
  name: string;
  category: Category;
  kind: ItemKind;
  defaultDimensions: Dimensions;
  dimensionRanges: DimensionRanges;
  /** Maps slot name (e.g. "carcass", "door") to a MaterialId. */
  defaultMaterials: Record<string, MaterialId>;
  config?: Record<string, unknown>;
  /** Reserved for future GLB swap-in. */
  assetUrl?: string;
}

export interface MaterialPreset {
  id: MaterialId;
  name: string;
  baseColor: string;
  roughness: number;
  metalness: number;
  /** 0..1 — used as <meshStandardMaterial normalScale={[v,v]} /> when a
   * normal map is attached. Plain colour materials ignore it. */
  normalScale?: number;
  textureUrl?: string;
  /** A short tag used to group materials in the picker. */
  family:
    | "laminate"
    | "wood"
    | "stone"
    | "metal"
    | "paint"
    | "glass"
    | "wall"
    | "floor";
}
