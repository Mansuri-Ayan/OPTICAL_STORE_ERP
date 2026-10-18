import { axiosInstance } from '@/api/axiosInstance';
import { Sale, CreateSaleRequest, PaginationParams, PaginatedResponse, SalePayment } from '@/types';

export const salesApi = {
  getSales: async (
    params?: PaginationParams & {
      store_id?: string | number;
      status?: string;
      hasDue?: boolean;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginatedResponse<Sale>> => {
    const response = await axiosInstance.get<PaginatedResponse<Sale>>('/sales/', { params });
    return response.data;
  },

  createSale: async (data: CreateSaleRequest): Promise<Sale> => {
    const response = await axiosInstance.post<Sale>('/sales/', data);
    return response.data;
  },

  getSaleById: async (id: string | number): Promise<Sale> => {
    const response = await axiosInstance.get<Sale>(`/sales/${id}`);
    return response.data;
  },

  getSaleBillHtml: async (id: string | number): Promise<string> => {
    const response = await axiosInstance.get<string>(`/sales/${id}/bill`);
    return response.data;
  },

  cancelSale: async (id: string | number): Promise<{ message: string; success: boolean }> => {
    const response = await axiosInstance.post<{ message: string; success: boolean }>(`/sales/${id}/cancel`);
    return response.data;
  },

  deleteSale: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/sales/${id}`);
  },

  addSalePayment: async (
    saleId: string | number,
    payload: { amount: number; payment_method: string; reference_number?: string; remarks?: string }
  ): Promise<SalePayment> => {
    const response = await axiosInstance.post<SalePayment>(`/sales/${saleId}/payments`, payload);
    return response.data;
  },

  addPayment: async (
    saleId: string | number,
    payload: { amount: number; payment_method: string; reference_number?: string; remarks?: string }
  ): Promise<SalePayment> => {
    const response = await axiosInstance.post<SalePayment>(`/sales/${saleId}/payments`, payload);
    return response.data;
  },

  updateSaleStatus: async (
    saleId: string | number,
    payload: { status?: string; lab_status?: string; notes?: string; sent_to_lab_date?: string; expected_delivery_date?: string }
  ): Promise<Sale> => {
    const response = await axiosInstance.put<Sale>(`/sales/${saleId}`, payload);
    return response.data;
  },
};
