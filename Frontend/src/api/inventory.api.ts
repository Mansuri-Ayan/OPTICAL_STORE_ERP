import { axiosInstance } from '@/api/axiosInstance';
import {
  Inventory,
  InventoryCreateRequest,
  InventoryUpdateRequest,
  StockTransferRequest,
  AgingConfig,
  PaginationParams,
  PaginatedResponse,
  ProductUnit,
  BarcodePdfRequest,
} from '@/types';

export const inventoryApi = {
  getInventory: async (params?: PaginationParams & { store_id?: string | number }): Promise<PaginatedResponse<Inventory>> => {
    const response = await axiosInstance.get<PaginatedResponse<Inventory>>('/inventory/', { params });
    return response.data;
  },

  createInventory: async (data: InventoryCreateRequest): Promise<Inventory> => {
    const response = await axiosInstance.post<Inventory>('/inventory/', data);
    return response.data;
  },

  getInventoryById: async (id: string | number): Promise<Inventory> => {
    const response = await axiosInstance.get<Inventory>(`/inventory/${id}`);
    return response.data;
  },

  updateInventory: async ({ id, data }: { id: string | number; data: InventoryUpdateRequest }): Promise<Inventory> => {
    const response = await axiosInstance.put<Inventory>(`/inventory/${id}`, data);
    return response.data;
  },

  transferStock: async (data: StockTransferRequest): Promise<void> => {
    await axiosInstance.post('/inventory/transfer', data);
  },

  // Serialized Product Units & Barcodes
  getProductUnits: async (params?: PaginationParams & { product_id?: string | number; store_id?: string | number; status?: string }): Promise<PaginatedResponse<ProductUnit>> => {
    const response = await axiosInstance.get<PaginatedResponse<ProductUnit>>('/inventory/product-units/', { params });
    return response.data;
  },

  lookupProductUnit: async (unitSku: string): Promise<ProductUnit> => {
    const response = await axiosInstance.get<ProductUnit>(`/inventory/product-units/lookup/${unitSku}`);
    return response.data;
  },

  downloadBarcodePdf: async (payload: BarcodePdfRequest): Promise<Blob> => {
    const response = await axiosInstance.post('/inventory/product-units/barcode-pdf', payload, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Aging & Deadstock
  getAgingConfig: async (): Promise<AgingConfig> => {
    const response = await axiosInstance.get<AgingConfig>('/inventory-config/');
    return response.data;
  },

  getAgingSummary: async (): Promise<Record<string, number>> => {
    const response = await axiosInstance.get<Record<string, number>>('/inventory-config/aging-summary');
    return response.data;
  },

  runAgingEvaluation: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/inventory-config/run-aging');
    return response.data;
  },
};
