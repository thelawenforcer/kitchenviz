import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useRenderMode } from "@/ui/renderMode";

const ACCUMULATE_MS = 1500;

/** When `useRenderMode.active` flips on, wait long enough for the
 * upgraded post FX (more SSAO samples, larger shadow map) to settle,
 * then snapshot the WebGL canvas to a PNG data URL.
 *
 * TODO: drop in three-gpu-pathtracer for a proper offline render. */
export function HighQualityCapture() {
  const requestId = useRenderMode((s) => s.requestId);
  const finish = useRenderMode((s) => s.finish);
  const cancel = useRenderMode((s) => s.cancel);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    if (requestId === 0) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        // Force one extra render so the latest postprocessing pass is in the buffer
        gl.render(scene, camera);
        const data = gl.domElement.toDataURL("image/png");
        finish(data);
      } catch (err) {
        console.error("[HighQualityCapture] failed", err);
        cancel();
      }
    }, ACCUMULATE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // intentionally only on requestId — gl/scene/camera are stable for the lifetime of the canvas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  return null;
}
