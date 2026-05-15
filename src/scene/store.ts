import { create } from "zustand";
import { temporal } from "zundo";
import type {
  CameraState,
  EnvironmentPreset,
  ItemId,
  LightingState,
  MaterialId,
  PlacedItem,
  RoomShell,
  Scene,
  Vec3,
} from "@/types";

type TransformMode = "translate" | "rotate";

export interface SceneState {
  scene: Scene;
  selectedId: ItemId | null;
  transformMode: TransformMode;
  snapMm: number;
  snapEnabled: boolean;

  // selection
  select: (id: ItemId | null) => void;
  setTransformMode: (mode: TransformMode) => void;
  toggleSnap: () => void;
  setSnapMm: (mm: number) => void;

  // items
  addItem: (item: PlacedItem) => void;
  removeItem: (id: ItemId) => void;
  updateItem: (id: ItemId, patch: Partial<PlacedItem>) => void;
  setItemPosition: (id: ItemId, position: Vec3) => void;
  setItemRotationY: (id: ItemId, rotationY: number) => void;
  setItemMaterial: (id: ItemId, slot: string, materialId: MaterialId) => void;
  setItemDimension: (
    id: ItemId,
    axis: "width" | "height" | "depth",
    value: number,
  ) => void;
  setItemConfig: (id: ItemId, key: string, value: unknown) => void;

  // room + lighting
  setRoom: (patch: Partial<RoomShell>) => void;
  setLighting: (patch: Partial<LightingState>) => void;
  setEnvironmentPreset: (preset: EnvironmentPreset) => void;

  // camera
  setCamera: (camera: CameraState) => void;

  // scene-wide
  loadScene: (scene: Scene) => void;
  resetScene: () => void;
}

export const DEFAULT_ROOM: RoomShell = {
  size: { width: 4500, height: 2600, depth: 3500 },
  wallMaterial: "paint-warm-white",
  floorMaterial: "wood-oak",
  ceilingMaterial: "paint-warm-white",
};

export const DEFAULT_LIGHTING: LightingState = {
  environmentPreset: "apartment",
  environmentIntensity: 0.6,
  sunIntensity: 2.4,
  sunAngle: [Math.PI * 0.25, Math.PI * 0.32],
  ambientIntensity: 0.15,
};

export const DEFAULT_CAMERA: CameraState = {
  position: [4500, 2200, 4500],
  target: [0, 900, 0],
};

export const seedScene = (): Scene => ({
  version: 1,
  room: { ...DEFAULT_ROOM },
  items: [],
  lighting: { ...DEFAULT_LIGHTING },
  camera: {
    position: [...DEFAULT_CAMERA.position] as Vec3,
    target: [...DEFAULT_CAMERA.target] as Vec3,
  },
});

let nextItemSerial = 1;
export const newItemId = (sku: string): ItemId =>
  `${sku}-${Date.now().toString(36)}-${(nextItemSerial++).toString(36)}`;

const replaceItem = (
  items: PlacedItem[],
  id: ItemId,
  fn: (item: PlacedItem) => PlacedItem,
): PlacedItem[] => items.map((it) => (it.id === id ? fn(it) : it));

export const useScene = create<SceneState>()(
  temporal(
    (set) => ({
      scene: seedScene(),
      selectedId: null,
      transformMode: "translate",
      snapMm: 10,
      snapEnabled: true,

      select: (id) => set({ selectedId: id }),
      setTransformMode: (mode) => set({ transformMode: mode }),
      toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
      setSnapMm: (mm) => set({ snapMm: Math.max(1, Math.round(mm)) }),

      addItem: (item) =>
        set((s) => ({
          scene: { ...s.scene, items: [...s.scene.items, item] },
          selectedId: item.id,
        })),

      removeItem: (id) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: s.scene.items.filter((it) => it.id !== id),
          },
          selectedId: s.selectedId === id ? null : s.selectedId,
        })),

      updateItem: (id, patch) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: replaceItem(s.scene.items, id, (it) => ({ ...it, ...patch })),
          },
        })),

      setItemPosition: (id, position) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: replaceItem(s.scene.items, id, (it) => ({ ...it, position })),
          },
        })),

      setItemRotationY: (id, rotationY) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: replaceItem(s.scene.items, id, (it) => ({ ...it, rotationY })),
          },
        })),

      setItemMaterial: (id, slot, materialId) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: replaceItem(s.scene.items, id, (it) => ({
              ...it,
              materialOverrides: { ...(it.materialOverrides ?? {}), [slot]: materialId },
            })),
          },
        })),

      setItemDimension: (id, axis, value) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: replaceItem(s.scene.items, id, (it) => ({
              ...it,
              dimensionOverrides: {
                ...(it.dimensionOverrides ?? {}),
                [axis]: value,
              },
            })),
          },
        })),

      setItemConfig: (id, key, value) =>
        set((s) => ({
          scene: {
            ...s.scene,
            items: replaceItem(s.scene.items, id, (it) => ({
              ...it,
              configOverrides: { ...(it.configOverrides ?? {}), [key]: value },
            })),
          },
        })),

      setRoom: (patch) =>
        set((s) => ({
          scene: { ...s.scene, room: { ...s.scene.room, ...patch } },
        })),

      setLighting: (patch) =>
        set((s) => ({
          scene: { ...s.scene, lighting: { ...s.scene.lighting, ...patch } },
        })),

      setEnvironmentPreset: (preset) =>
        set((s) => ({
          scene: {
            ...s.scene,
            lighting: { ...s.scene.lighting, environmentPreset: preset },
          },
        })),

      setCamera: (camera) =>
        set((s) => ({ scene: { ...s.scene, camera } })),

      loadScene: (scene) => set({ scene, selectedId: null }),
      resetScene: () => set({ scene: seedScene(), selectedId: null }),
    }),
    {
      // only history-track the scene itself; UI flags shouldn't be undoable
      partialize: (state) => ({ scene: state.scene }),
      limit: 100,
      // coalesce rapid edits (e.g. drag-gizmo) into a single history entry
      handleSet: (handleSet) => {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        return (state) => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => handleSet(state), 250);
        };
      },
    },
  ),
);

export const sceneSelectors = {
  selectedItem: (s: SceneState): PlacedItem | null => {
    if (!s.selectedId) return null;
    return s.scene.items.find((it) => it.id === s.selectedId) ?? null;
  },
};
