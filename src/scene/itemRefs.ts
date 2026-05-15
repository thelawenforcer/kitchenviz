import { create } from "zustand";
import type { Group } from "three";
import type { ItemId } from "@/types";

interface ItemRefsState {
  /** Live three.js Group for each placed item, populated on mount and
   * cleared on unmount. Kept off the scene store so registering a ref
   * doesn't write a history entry. */
  refs: Map<ItemId, Group>;
  register: (id: ItemId, group: Group) => void;
  unregister: (id: ItemId) => void;
}

export const useItemRefs = create<ItemRefsState>((set, get) => ({
  refs: new Map(),
  register: (id, group) => {
    const next = new Map(get().refs);
    next.set(id, group);
    set({ refs: next });
  },
  unregister: (id) => {
    const next = new Map(get().refs);
    next.delete(id);
    set({ refs: next });
  },
}));
