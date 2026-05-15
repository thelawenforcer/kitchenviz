import type {
  Dimensions,
  ItemId,
  MaterialId,
  SkuCode,
} from "./catalog";
import type { Vec3 } from "./units";

export interface PlacedItem {
  id: ItemId;
  sku: SkuCode;
  /** World position in millimetres. */
  position: Vec3;
  /** Y-axis only for kitchen items. Radians. */
  rotationY: number;
  dimensionOverrides?: Partial<Dimensions>;
  materialOverrides?: Record<string, MaterialId>;
  configOverrides?: Record<string, unknown>;
}

export interface RoomShell {
  size: Dimensions;
  wallMaterial: MaterialId;
  floorMaterial: MaterialId;
  ceilingMaterial: MaterialId;
}

export type EnvironmentPreset =
  | "studio"
  | "apartment"
  | "sunset"
  | "dawn"
  | "warehouse"
  | "city";

export interface LightingState {
  environmentPreset: EnvironmentPreset;
  environmentIntensity: number;
  sunIntensity: number;
  /** [azimuth radians, elevation radians] */
  sunAngle: [number, number];
  ambientIntensity: number;
}

export interface CameraState {
  position: Vec3;
  target: Vec3;
}

export interface Scene {
  version: 1;
  room: RoomShell;
  items: PlacedItem[];
  lighting: LightingState;
  camera: CameraState;
}

/** What we serialise to disk — Scene plus a wall-clock timestamp. */
export interface SavedScene extends Scene {
  savedAt: string;
}
