import { useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useItemRefs } from "@/scene/itemRefs";
import { useScene } from "@/scene/store";
import { mToMm } from "@/types";

/** Wraps drei's <TransformControls> and binds it to the currently
 * selected item's three.js group. Translate-only for the MVP — rotation
 * is set via the inspector slider, which keeps the Y-axis constraint
 * trivial to enforce. */
export function Selection() {
  const selectedId = useScene((s) => s.selectedId);
  const transformMode = useScene((s) => s.transformMode);
  const setItemPosition = useScene((s) => s.setItemPosition);
  const setItemRotationY = useScene((s) => s.setItemRotationY);
  const snapEnabled = useScene((s) => s.snapEnabled);
  const snapMm = useScene((s) => s.snapMm);
  const refs = useItemRefs((s) => s.refs);
  const orbit = useThree((s) => s.controls) as { enabled: boolean } | null;

  const target = selectedId ? refs.get(selectedId) : null;

  // Disable orbit while gizmo is being dragged
  useEffect(() => {
    if (!target) return;
  }, [target]);

  if (!target || !selectedId) return null;

  const snapMeters = snapEnabled ? snapMm / 1000 : null;

  return (
    <TransformControls
      object={target}
      mode={transformMode}
      showY={transformMode === "translate"}
      space="world"
      translationSnap={snapMeters}
      rotationSnap={snapEnabled ? Math.PI / 24 : null}
      onMouseDown={() => {
        if (orbit) orbit.enabled = false;
      }}
      onMouseUp={() => {
        if (orbit) orbit.enabled = true;
      }}
      onObjectChange={() => {
        if (transformMode === "translate") {
          const p = target.position;
          setItemPosition(selectedId, [
            mToMm(p.x),
            mToMm(p.y),
            mToMm(p.z),
          ]);
        } else {
          setItemRotationY(selectedId, target.rotation.y);
        }
      }}
    />
  );
}
