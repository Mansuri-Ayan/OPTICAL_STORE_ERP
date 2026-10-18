import { axiosInstance } from '@/api/axiosInstance';
import { Expense, ExpenseCreateRequest, ExpenseUpdateRequest, ExpenseCategory, ExpenseCategoryCreateRequest, PaginationParams, PaginatedResponse } from '@/types';

export const expenseApi = {
  getExpenses: async (params?: PaginationParams & { store_id?: string | number }): Promise<PaginatedResponse<Expense>> => {
    const response = await axiosInstance.get<PaginatedResponse<Expense>>('/expenses', { params });
    return response.data;
  },
  createExpense: async (data: ExpenseCreateRequest): Promise<Expense> => {
    const response = await axiosInstance.post<Expense>('/expenses', data);
    return response.data;
  },
  updateExpense: async ({ id, data }: { id: string | number; data: ExpenseUpdateRequest }): Promise<Expense> => {
    const response = await axiosInstance.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/expenses/${id}`);
  },
  getExpenseCategories: async (params?: PaginationParams): Promise<PaginatedResponse<ExpenseCategory>> => {
    const response = await axiosInstance.get<PaginatedResponse<ExpenseCategory>>('/expenses/categories', { params });
    return response.data;
  },
  createExpenseCategory: async (data: ExpenseCategoryCreateRequest): Promise<ExpenseCategory> => {
    const response = await axiosInstance.post<ExpenseCategory>('/expenses/categories', data);
    return response.data;
  }
};
