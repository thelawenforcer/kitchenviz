# kitchenviz

Browser-based 3D kitchen configurator. Drop parametric items (cabinets,
appliances, sinks, worktops, walls, windows, lights) into a scene,
adjust their dimensions and finishes, save to JSON, and export a
high-quality PNG render.

## Stack

React 18 + TypeScript (strict), Vite, React Three Fiber, drei,
@react-three/postprocessing, Zustand (+ zundo for history), Tailwind,
Zod for scene validation. Node 20+, pnpm.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck
pnpm build
```

## Keyboard

| Key                 | Action            |
| ------------------- | ----------------- |
| `G`                 | Move gizmo        |
| `R`                 | Rotate gizmo      |
| `S`                 | Toggle snap       |
| `Esc`               | Deselect          |
| `Del` / `Backspace` | Remove selected   |
| `⌘Z` / `⇧⌘Z`        | Undo / Redo       |
| `Enter`             | Trigger render    |

## Layout

- `src/types/` — shared types (Catalog, Scene, etc.)
- `src/catalog/` — hardcoded SKU catalog and material presets
- `src/scene/` — Zustand store, scene serialisation, item refs
- `src/rendering/` — `<Canvas>`, lighting, primitives, selection, capture
- `src/ui/` — top bar, catalog, inspector, lighting/room controls,
  render overlay, keyboard shortcuts

Scenes are JSON files matching the `Scene` schema in
`src/types/scene.ts` (validated on load with Zod).

## Out of scope today (TODOs in code)

- GLB asset loading (`assetUrl` field on `CatalogEntry` is reserved)
- `three-gpu-pathtracer` for true offline renders (marker in
  `HighQualityCapture.tsx`)
- Cabinet collision detection (snap-to-grid only)
- Mobile/touch interaction, VR/AR
