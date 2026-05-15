import { useState } from "react";
import { useScene } from "@/scene/store";

const SHORTCUTS: [string, string][] = [
  ["G", "Move gizmo"],
  ["R", "Rotate gizmo"],
  ["S", "Toggle snap"],
  ["Esc", "Deselect"],
  ["Del", "Remove selected"],
  ["⌘Z / ⇧⌘Z", "Undo / Redo"],
  ["Enter", "Render"],
];

export function ShortcutHints() {
  const [open, setOpen] = useState(false);
  const itemCount = useScene((s) => s.scene.items.length);

  return (
    <>
      {/* Empty-state hint when nothing has been added yet */}
      {itemCount === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-center text-neutral-500 text-sm max-w-xs">
            <p className="mb-1 text-neutral-300 font-medium">Empty scene</p>
            <p>
              Pick an item from the catalog on the left to drop it into your
              kitchen. Click an item to edit it; right-click drag to orbit.
            </p>
          </div>
        </div>
      )}

      <div className="absolute left-3 bottom-3 select-none">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-2 py-1 text-[11px] rounded border border-line bg-panel/80 backdrop-blur-sm text-neutral-400 hover:text-neutral-100"
        >
          {open ? "hide shortcuts" : "shortcuts (?)"}
        </button>
        {open && (
          <div className="mt-1 p-2 rounded border border-line bg-panel/90 backdrop-blur-sm text-[11px] text-neutral-300 space-y-0.5 min-w-[200px]">
            {SHORTCUTS.map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <kbd className="font-mono text-neutral-100">{key}</kbd>
                <span className="text-neutral-400">{desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
