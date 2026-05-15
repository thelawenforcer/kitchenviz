import { create } from "zustand";

interface RenderModeState {
  active: boolean;
  /** Increments each time a render is requested so the viewport can react. */
  requestId: number;
  /** PNG data URL of the most recent capture, ready for download. */
  lastCapture: string | null;
  request: () => void;
  finish: (capture: string) => void;
  cancel: () => void;
  clearCapture: () => void;
}

export const useRenderMode = create<RenderModeState>((set) => ({
  active: false,
  requestId: 0,
  lastCapture: null,
  request: () =>
    set((s) => ({ active: true, requestId: s.requestId + 1, lastCapture: null })),
  finish: (capture) => set({ active: false, lastCapture: capture }),
  cancel: () => set({ active: false }),
  clearCapture: () => set({ lastCapture: null }),
}));

export const useRenderTrigger = () => useRenderMode((s) => s.request);
