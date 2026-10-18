import { create } from 'zustand';
import { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  storeId: number | string | null;
  activeStoreId?: number | string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  logout: () => void;
  setStoreId: (id: number | string | null) => void;
  setActiveStore: (id: number | string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  storeId: null,
  activeStoreId: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, token) =>
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false, storeId: null, activeStoreId: null, isLoading: false }),
  logout: () =>
    set({ user: null, accessToken: null, isAuthenticated: false, storeId: null, activeStoreId: null, isLoading: false }),
  setStoreId: (id) => set({ storeId: id, activeStoreId: id }),
  setActiveStore: (id) => set({ storeId: id, activeStoreId: id }),
  setLoading: (isLoading) => set({ isLoading }),
}));
