import { create } from "zustand";

interface RenderModeState {
  active: boolean;
  /** Increments each time a render is requested so the viewport can react. */
  requestId: number;
  request: () => void;
  finish: () => void;
}

/** UI-side flag that the Viewport listens to. Live elsewhere from the
 * scene store so triggering a render doesn't write a history entry. */
export const useRenderMode = create<RenderModeState>((set) => ({
  active: false,
  requestId: 0,
  request: () => set((s) => ({ active: true, requestId: s.requestId + 1 })),
  finish: () => set({ active: false }),
}));

export const useRenderTrigger = () => useRenderMode((s) => s.request);
