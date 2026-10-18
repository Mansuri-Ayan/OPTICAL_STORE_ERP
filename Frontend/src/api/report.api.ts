import { axiosInstance } from '@/api/axiosInstance';
import { DashboardStats, SalesReport, StockReport, ExpenseReport } from '@/types';

export const reportApi = {
  getDashboardStats: async (params?: { store_id?: string }): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>('/reports/dashboard', { params });
    return response.data;
  },
  getSalesReport: async (params?: { start_date?: string; end_date?: string; store_id?: string }): Promise<SalesReport> => {
    const response = await axiosInstance.get<SalesReport>('/reports/sales', { params });
    return response.data;
  },
  getStockReport: async (params?: { store_id?: string }): Promise<StockReport> => {
    const response = await axiosInstance.get<StockReport>('/reports/stock', { params });
    return response.data;
  },
  getExpenseReport: async (params?: { start_date?: string; end_date?: string; store_id?: string }): Promise<ExpenseReport> => {
    const response = await axiosInstance.get<ExpenseReport>('/reports/expenses', { params });
    return response.data;
  }
};
