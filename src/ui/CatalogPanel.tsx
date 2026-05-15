import { useMemo, useState } from "react";
import { CATALOG } from "@/catalog/entries";
import { newItemId, useScene } from "@/scene/store";
import type { CatalogEntry, Category } from "@/types";

const CATEGORY_LABEL: Record<Category, string> = {
  base_cabinet: "Base cabinets",
  wall_cabinet: "Wall cabinets",
  tall_cabinet: "Tall cabinets",
  worktop: "Worktops",
  sink: "Sinks",
  tap: "Taps",
  hob: "Hobs",
  oven: "Ovens",
  fridge: "Fridges",
  dishwasher: "Dishwashers",
  wall: "Walls",
  window: "Windows",
  floor: "Floor patches",
  ceiling: "Ceilings",
  light: "Lights",
};

const CATEGORY_ORDER: Category[] = [
  "base_cabinet",
  "wall_cabinet",
  "tall_cabinet",
  "worktop",
  "sink",
  "tap",
  "hob",
  "oven",
  "fridge",
  "dishwasher",
  "wall",
  "window",
  "floor",
  "ceiling",
  "light",
];

export function CatalogPanel() {
  const [query, setQuery] = useState("");
  const addItem = useScene((s) => s.addItem);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? CATALOG.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.sku.toLowerCase().includes(q) ||
            e.category.includes(q),
        )
      : CATALOG;
    const map = new Map<Category, CatalogEntry[]>();
    for (const e of filtered) {
      const arr = map.get(e.category) ?? [];
      arr.push(e);
      map.set(e.category, arr);
    }
    return CATEGORY_ORDER.flatMap((cat) => {
      const entries = map.get(cat);
      return entries ? [{ category: cat, entries }] : [];
    });
  }, [query]);

  const handleAdd = (entry: CatalogEntry) => {
    addItem({
      id: newItemId(entry.sku),
      sku: entry.sku,
      position: defaultDropPosition(entry),
      rotationY: 0,
    });
  };

  return (
    <aside className="w-64 shrink-0 border-r border-line bg-panel flex flex-col">
      <div className="p-3 border-b border-line">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog…"
          className="w-full bg-panelMuted border border-line rounded px-2 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-accent"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {grouped.map(({ category, entries }) => (
          <section key={category}>
            <h3 className="text-[11px] uppercase tracking-wider text-neutral-500 px-2 mb-1">
              {CATEGORY_LABEL[category]}
            </h3>
            <ul className="space-y-1">
              {entries.map((e) => (
                <li key={e.sku}>
                  <button
                    type="button"
                    onClick={() => handleAdd(e)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-panelMuted text-sm flex items-center justify-between group"
                    title={`${e.sku} — click to add`}
                  >
                    <span className="truncate">{e.name}</span>
                    <span className="ml-2 text-[10px] text-neutral-500 group-hover:text-neutral-300">
                      {e.sku}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {grouped.length === 0 && (
          <p className="text-xs text-neutral-500 p-3">No matches.</p>
        )}
      </div>
    </aside>
  );
}

function defaultDropPosition(entry: CatalogEntry): [number, number, number] {
  // wall items hover at 1500mm by default; ceiling/lights go higher
  switch (entry.kind) {
    case "wall_cabinet":
      return [0, 1500, 0];
    case "window_unit":
      return [0, 1100, 0];
    case "pendant_light":
      return [0, 1700, 0];
    case "spot_light":
      return [0, 2400, 0];
    case "under_cabinet_strip":
      return [0, 1490, 0];
    case "ceiling_patch":
      return [0, 2500, 0];
    case "worktop":
      return [0, 870, 0];
    case "hob":
      return [0, 910, 0];
    case "tap":
      return [0, 910, -200];
    default:
      return [0, 0, 0];
  }
}
