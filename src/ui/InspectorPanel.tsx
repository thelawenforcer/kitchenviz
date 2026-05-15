import { useMemo } from "react";
import { getCatalogEntry } from "@/catalog/entries";
import { MATERIAL_PRESETS } from "@/catalog/materials";
import { sceneSelectors, useScene } from "@/scene/store";
import type { Dimensions, MaterialId, MaterialPreset, PlacedItem } from "@/types";
import { LightingControls } from "./LightingControls";
import { RoomControls } from "./RoomControls";
import { Slider } from "./Slider";

export function InspectorPanel() {
  const item = useScene(sceneSelectors.selectedItem);

  return (
    <aside className="w-72 shrink-0 border-l border-line bg-panel flex flex-col overflow-y-auto">
      {item ? <ItemInspector item={item} /> : <SceneInspector />}
    </aside>
  );
}

function SceneInspector() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-sm font-semibold mb-1">Scene</h2>
        <p className="text-xs text-neutral-500">
          Nothing selected. Click an item in the viewport to edit it, or adjust
          the room and lighting below.
        </p>
      </div>
      <RoomControls />
      <LightingControls />
    </div>
  );
}

function ItemInspector({ item }: { item: PlacedItem }) {
  const entry = getCatalogEntry(item.sku);
  const removeItem = useScene((s) => s.removeItem);
  const setItemDimension = useScene((s) => s.setItemDimension);
  const setItemRotationY = useScene((s) => s.setItemRotationY);
  const setItemMaterial = useScene((s) => s.setItemMaterial);
  const setItemConfig = useScene((s) => s.setItemConfig);
  const setItemPosition = useScene((s) => s.setItemPosition);

  const dims = useMemo<Dimensions>(
    () => ({ ...(entry?.defaultDimensions ?? { width: 0, height: 0, depth: 0 }), ...(item.dimensionOverrides ?? {}) }),
    [entry, item.dimensionOverrides],
  );

  if (!entry) {
    return (
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-1">Unknown item</h2>
        <p className="text-xs text-neutral-500">
          SKU <code>{item.sku}</code> isn't in the catalog.
        </p>
      </div>
    );
  }

  const config: Record<string, unknown> = {
    ...(entry.config ?? {}),
    ...(item.configOverrides ?? {}),
  };

  return (
    <div className="p-4 space-y-5">
      <header>
        <h2 className="text-sm font-semibold leading-tight">{entry.name}</h2>
        <p className="text-[11px] text-neutral-500 mt-0.5">{entry.sku}</p>
      </header>

      {/* Dimensions */}
      <section className="space-y-3">
        <h3 className="text-[11px] uppercase tracking-wider text-neutral-500">Dimensions (mm)</h3>
        {(["width", "height", "depth"] as const).map((axis) => {
          const range = entry.dimensionRanges[axis];
          return (
            <Slider
              key={axis}
              label={axis}
              min={range[0]}
              max={range[1]}
              step={10}
              value={dims[axis]}
              onChange={(v) => setItemDimension(item.id, axis, v)}
              suffix="mm"
            />
          );
        })}
      </section>

      {/* Position + rotation */}
      <section className="space-y-3">
        <h3 className="text-[11px] uppercase tracking-wider text-neutral-500">Transform</h3>
        <div className="grid grid-cols-3 gap-2">
          {(["x", "y", "z"] as const).map((axis, i) => (
            <NumberField
              key={axis}
              label={axis}
              value={Math.round(item.position[i] ?? 0)}
              onChange={(v) => {
                const next: [number, number, number] = [...item.position];
                next[i] = v;
                setItemPosition(item.id, next);
              }}
            />
          ))}
        </div>
        <Slider
          label="rotation"
          min={-180}
          max={180}
          step={5}
          value={Math.round((item.rotationY * 180) / Math.PI)}
          onChange={(deg) => setItemRotationY(item.id, (deg * Math.PI) / 180)}
          suffix="°"
        />
      </section>

      {/* Materials */}
      {Object.keys(entry.defaultMaterials).length > 0 && (
        <section className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider text-neutral-500">Materials</h3>
          {Object.keys(entry.defaultMaterials).map((slot) => {
            const current =
              item.materialOverrides?.[slot] ?? entry.defaultMaterials[slot] ?? "";
            return (
              <MaterialPicker
                key={slot}
                label={slot}
                value={current}
                onChange={(id) => setItemMaterial(item.id, slot, id)}
              />
            );
          })}
        </section>
      )}

      {/* Config knobs */}
      {Object.keys(config).length > 0 && (
        <section className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider text-neutral-500">Options</h3>
          {Object.entries(config).map(([key, value]) =>
            renderConfigKnob(key, value, (v) => setItemConfig(item.id, key, v)),
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="w-full text-sm py-1.5 rounded border border-red-900/50 bg-red-900/20 hover:bg-red-900/40 text-red-200"
      >
        Delete item
      </button>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-[11px] text-neutral-400">
      <span className="capitalize">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
        className="mt-1 w-full bg-panelMuted border border-line rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-accent"
      />
    </label>
  );
}

function MaterialPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MaterialId;
  onChange: (id: MaterialId) => void;
}) {
  const grouped = useMemo<Record<string, MaterialPreset[]>>(() => {
    return MATERIAL_PRESETS.reduce<Record<string, MaterialPreset[]>>(
      (acc, m) => {
        const family = m.family;
        const arr = acc[family] ?? [];
        arr.push(m);
        acc[family] = arr;
        return acc;
      },
      {},
    );
  }, []);

  return (
    <label className="block text-[11px] text-neutral-400">
      <span className="capitalize">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-panelMuted border border-line rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-accent"
      >
        {Object.entries(grouped).map(([family, presets]) => (
          <optgroup key={family} label={family}>
            {presets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function renderConfigKnob(
  key: string,
  value: unknown,
  onChange: (v: unknown) => void,
) {
  if (typeof value === "boolean") {
    return (
      <label key={key} className="flex items-center justify-between text-[12px] text-neutral-300 py-1">
        <span className="capitalize">{key.replace(/_/g, " ")}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-accent"
        />
      </label>
    );
  }
  if (typeof value === "number") {
    return (
      <label key={key} className="block text-[11px] text-neutral-400">
        <span className="capitalize">{key.replace(/_/g, " ")}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(n);
          }}
          className="mt-1 w-full bg-panelMuted border border-line rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-accent"
        />
      </label>
    );
  }
  if (typeof value === "string") {
    const options = SUGGESTED_OPTIONS[key];
    if (options) {
      return (
        <label key={key} className="block text-[11px] text-neutral-400">
          <span className="capitalize">{key.replace(/_/g, " ")}</span>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full bg-panelMuted border border-line rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-accent"
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      );
    }
    return (
      <label key={key} className="block text-[11px] text-neutral-400">
        <span className="capitalize">{key.replace(/_/g, " ")}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full bg-panelMuted border border-line rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-accent"
        />
      </label>
    );
  }
  return null;
}

const SUGGESTED_OPTIONS: Record<string, string[]> = {
  frontStyle: ["doors", "drawers"],
  handleType: ["bar", "knob", "none"],
  type: ["induction", "gas"],
  layout: ["single", "fridge_freezer"],
  variant: ["integrated", "freestanding"],
  style: ["swan", "pillar"],
};
