import { useEffect } from "react";
import { useRenderMode } from "./renderMode";

export function RenderOverlay() {
  const active = useRenderMode((s) => s.active);
  const lastCapture = useRenderMode((s) => s.lastCapture);
  const clearCapture = useRenderMode((s) => s.clearCapture);

  // auto-dismiss the success card after 30s
  useEffect(() => {
    if (!lastCapture) return;
    const t = setTimeout(clearCapture, 30_000);
    return () => clearTimeout(t);
  }, [lastCapture, clearCapture]);

  return (
    <>
      {active && (
        <div className="absolute inset-0 pointer-events-none flex items-start justify-center pt-6">
          <div className="px-3 py-1.5 rounded-md bg-black/70 border border-line text-xs text-neutral-100 backdrop-blur-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
            Rendering…
          </div>
        </div>
      )}
      {!active && lastCapture && (
        <div className="absolute right-4 bottom-4 w-64 bg-panel border border-line rounded-lg shadow-xl overflow-hidden">
          <img src={lastCapture} alt="Rendered preview" className="w-full h-32 object-cover" />
          <div className="p-2 flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400">Render ready</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={clearCapture}
                className="px-2 py-1 text-[11px] rounded border border-line text-neutral-300 hover:bg-panelMuted"
              >
                Dismiss
              </button>
              <a
                href={lastCapture}
                download={`kitchenviz-${Date.now()}.png`}
                className="px-2 py-1 text-[11px] rounded border border-accent/60 bg-accent/20 text-white hover:bg-accent/40"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
