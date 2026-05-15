import { z } from "zod";
import type { Scene, SavedScene } from "@/types";

const Vec3Schema = z.tuple([z.number(), z.number(), z.number()]);
const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

const PlacedItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  position: Vec3Schema,
  rotationY: z.number(),
  dimensionOverrides: DimensionsSchema.partial().optional(),
  materialOverrides: z.record(z.string(), z.string()).optional(),
  configOverrides: z.record(z.string(), z.unknown()).optional(),
});

const RoomShellSchema = z.object({
  size: DimensionsSchema,
  wallMaterial: z.string(),
  floorMaterial: z.string(),
  ceilingMaterial: z.string(),
});

const LightingStateSchema = z.object({
  environmentPreset: z.enum(["studio", "apartment", "sunset", "dawn", "warehouse", "city"]),
  environmentIntensity: z.number(),
  sunIntensity: z.number(),
  sunAngle: z.tuple([z.number(), z.number()]),
  ambientIntensity: z.number(),
});

const CameraStateSchema = z.object({
  position: Vec3Schema,
  target: Vec3Schema,
});

export const SceneSchema = z.object({
  version: z.literal(1),
  room: RoomShellSchema,
  items: z.array(PlacedItemSchema),
  lighting: LightingStateSchema,
  camera: CameraStateSchema,
});

export const SavedSceneSchema = SceneSchema.extend({
  savedAt: z.string(),
});

export function downloadScene(scene: Scene, filename = "kitchen.json"): void {
  const payload: SavedScene = {
    ...scene,
    savedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readSceneFromFile(file: File): Promise<Scene> {
  const text = await file.text();
  const json: unknown = JSON.parse(text);
  const parsed = SavedSceneSchema.safeParse(json);
  if (!parsed.success) {
    // try without savedAt
    const fallback = SceneSchema.safeParse(json);
    if (!fallback.success) {
      throw new Error(`Invalid scene file: ${parsed.error.issues[0]?.message ?? "unknown"}`);
    }
    return fallback.data as Scene;
  }
  const { savedAt: _savedAt, ...scene } = parsed.data;
  return scene as Scene;
}
