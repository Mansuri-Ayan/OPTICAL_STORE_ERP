import { axiosInstance } from '@/api/axiosInstance';
import { Supplier, SupplierCreateRequest, SupplierUpdateRequest, PurchaseOrder, PurchaseOrderCreateRequest, PurchaseOrderUpdateRequest, PaginationParams, PaginatedResponse } from '@/types';

export const supplierApi = {
  getSuppliers: async (params?: PaginationParams): Promise<PaginatedResponse<Supplier>> => {
    const response = await axiosInstance.get<PaginatedResponse<Supplier>>('/suppliers', { params });
    return response.data;
  },
  createSupplier: async (data: SupplierCreateRequest): Promise<Supplier> => {
    const response = await axiosInstance.post<Supplier>('/suppliers', data);
    return response.data;
  },
  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await axiosInstance.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },
  updateSupplier: async ({ id, data }: { id: string; data: SupplierUpdateRequest }): Promise<Supplier> => {
    const response = await axiosInstance.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },
  deleteSupplier: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/suppliers/${id}`);
  },

  getPurchaseOrders: async (params?: PaginationParams): Promise<PaginatedResponse<PurchaseOrder>> => {
    const response = await axiosInstance.get<PaginatedResponse<PurchaseOrder>>('/purchase-orders', { params });
    return response.data;
  },
  createPurchaseOrder: async (data: PurchaseOrderCreateRequest): Promise<PurchaseOrder> => {
    const response = await axiosInstance.post<PurchaseOrder>('/purchase-orders', data);
    return response.data;
  },
  getPurchaseOrderById: async (id: string): Promise<PurchaseOrder> => {
    const response = await axiosInstance.get<PurchaseOrder>(`/purchase-orders/${id}`);
    return response.data;
  },
  updatePurchaseOrder: async ({ id, data }: { id: string; data: PurchaseOrderUpdateRequest }): Promise<PurchaseOrder> => {
    const response = await axiosInstance.put<PurchaseOrder>(`/purchase-orders/${id}`, data);
    return response.data;
  }
};
