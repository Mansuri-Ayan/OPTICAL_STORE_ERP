import { axiosInstance } from '@/api/axiosInstance';
import { Store, StoreCreateRequest, StoreUpdateRequest, PaginationParams, PaginatedResponse, StoreSelectorResponse } from '@/types';

export const storeApi = {
  getStores: async (params?: PaginationParams): Promise<PaginatedResponse<Store>> => {
    const response = await axiosInstance.get<PaginatedResponse<Store>>('/stores/', { params });
    return response.data;
  },
  getStoreSelector: async (): Promise<StoreSelectorResponse> => {
    const response = await axiosInstance.get<StoreSelectorResponse>('/stores/selector');
    return response.data;
  },
  createStore: async (data: StoreCreateRequest): Promise<Store> => {
    const response = await axiosInstance.post<Store>('/stores/', data);
    return response.data;
  },
  getStoreById: async (id: string | number): Promise<Store> => {
    const response = await axiosInstance.get<Store>(`/stores/${id}`);
    return response.data;
  },
  updateStore: async ({ id, data }: { id: string | number; data: StoreUpdateRequest }): Promise<Store> => {
    const response = await axiosInstance.put<Store>(`/stores/${id}`, data);
    return response.data;
  },
  deleteStore: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/stores/${id}`);
  }
};
