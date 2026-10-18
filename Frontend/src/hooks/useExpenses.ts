import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '@/api/expense.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (params: PaginationParams & { store_id?: string | number }) => [...expenseKeys.lists(), params] as const,
  
  categories: {
    all: ['expenseCategories'] as const,
    lists: () => [...expenseKeys.categories.all, 'list'] as const,
    list: (params: PaginationParams) => [...expenseKeys.categories.lists(), params] as const,
  }
};

export const useExpenses = (params?: PaginationParams & { store_id?: string | number }) => {
  return useQuery({
    queryKey: expenseKeys.list(params || {}),
    queryFn: () => expenseApi.getExpenses(params)
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseApi.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success('Expense recorded successfully');
    },
    onError: () => toast.error('Failed to record expense')
  });
};

export const useExpenseCategories = (params?: PaginationParams) => {
  return useQuery({
    queryKey: expenseKeys.categories.list(params || {}),
    queryFn: () => expenseApi.getExpenseCategories(params)
  });
};
