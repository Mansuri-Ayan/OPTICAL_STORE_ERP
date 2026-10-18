import { create } from 'zustand';
import { Store, StoreSelectorItem } from '@/types/store.types';

export type StoreItem = Store | StoreSelectorItem;

interface StoreState {
  stores: StoreItem[];
  selectedStore: StoreItem | null;
  setStores: (stores: StoreItem[]) => void;
  setSelectedStore: (store: StoreItem | null) => void;
  upsertStore: (store: StoreItem) => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  stores: [],
  selectedStore: null,

  setStores: (stores) =>
    set((state) => {
      const savedStoreId = typeof window !== 'undefined' ? localStorage.getItem('admin-selected-store-id') : null;
      let selected = state.selectedStore;

      if (!selected && savedStoreId) {
        selected = stores.find((s) => String(s.id) === String(savedStoreId)) || null;
      }
      if (!selected) {
        selected = stores[0] || null;
      }
      return { stores, selectedStore: selected };
    }),

  setSelectedStore: (store) => {
    if (typeof window !== 'undefined') {
      if (store) {
        localStorage.setItem('admin-selected-store-id', String(store.id));
      } else {
        localStorage.removeItem('admin-selected-store-id');
      }
    }
    set({ selectedStore: store });
  },

  upsertStore: (store) =>
    set((state) => {
      const exists = state.stores.some((s) => s.id === store.id);
      return {
        stores: exists
          ? state.stores.map((s) => (s.id === store.id ? store : s))
          : [store, ...state.stores],
        selectedStore:
          state.selectedStore?.id === store.id ? store : state.selectedStore,
      };
    }),
}));
