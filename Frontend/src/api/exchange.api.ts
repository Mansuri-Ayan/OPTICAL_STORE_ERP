import { axiosInstance } from '@/api/axiosInstance';
import { ExchangeRecord, CreateExchangePayload, PaginationParams, PaginatedResponse } from '@/types';

export const exchangeApi = {
  getExchanges: async (
    params?: PaginationParams & { store_id?: string | number; status?: string; dateFrom?: string; dateTo?: string }
  ): Promise<PaginatedResponse<ExchangeRecord>> => {
    const response = await axiosInstance.get<PaginatedResponse<ExchangeRecord>>('/exchanges/', { params });
    return response.data;
  },

  getExchangeById: async (id: string | number): Promise<ExchangeRecord> => {
    const response = await axiosInstance.get<ExchangeRecord>(`/exchanges/${id}`);
    return response.data;
  },

  createExchange: async (data: CreateExchangePayload): Promise<ExchangeRecord> => {
    const response = await axiosInstance.post<ExchangeRecord>('/exchanges/', data);
    return response.data;
  },

  getExchangeReceiptHtml: async (id: string | number): Promise<string> => {
    const response = await axiosInstance.get<string>(`/exchanges/${id}/receipt`);
    return response.data;
  },

  cancelExchange: async (id: string | number): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post<{ success: boolean; message: string }>(`/exchanges/${id}/cancel`);
    return response.data;
  },
};
