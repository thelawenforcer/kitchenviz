import { useEffect } from "react";
import { useScene } from "@/scene/store";
import { useRenderMode } from "./renderMode";

const isEditable = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

/** Blender-style shortcuts:
 *  - Delete / Backspace → remove selected
 *  - Esc → deselect
 *  - G → translate (move) gizmo
 *  - R → rotate gizmo
 *  - Ctrl/Cmd+Z → undo
 *  - Ctrl/Cmd+Shift+Z (or Ctrl+Y) → redo
 *  - S → toggle snap
 *  - Enter → trigger render */
export function useKeyboardShortcuts() {
  const select = useScene((s) => s.select);
  const removeItem = useScene((s) => s.removeItem);
  const setTransformMode = useScene((s) => s.setTransformMode);
  const toggleSnap = useScene((s) => s.toggleSnap);
  const triggerRender = useRenderMode((s) => s.request);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;

      const meta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      if (meta && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        const t = useScene.temporal.getState();
        if (shift) t.redo();
        else t.undo();
        return;
      }
      if (meta && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        useScene.temporal.getState().redo();
        return;
      }

      switch (e.key) {
        case "Escape":
          select(null);
          break;
        case "Delete":
        case "Backspace": {
          const id = useScene.getState().selectedId;
          if (id) {
            removeItem(id);
            e.preventDefault();
          }
          break;
        }
        case "g":
        case "G":
          setTransformMode("translate");
          break;
        case "r":
        case "R":
          setTransformMode("rotate");
          break;
        case "s":
        case "S":
          if (!meta) toggleSnap();
          break;
        case "Enter":
          triggerRender();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, removeItem, setTransformMode, toggleSnap, triggerRender]);
}
