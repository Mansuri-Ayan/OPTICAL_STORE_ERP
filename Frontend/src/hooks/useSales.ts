import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '@/api/sales.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const saleKeys = {
  all: ['sales'] as const,
  lists: () => [...saleKeys.all, 'list'] as const,
  list: (params: PaginationParams & { store_id?: string | number; status?: string; hasDue?: boolean }) =>
    [...saleKeys.lists(), params] as const,
  details: () => [...saleKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...saleKeys.details(), String(id)] as const,
};

export const useSales = (
  params?: PaginationParams & { store_id?: string | number; status?: string; hasDue?: boolean }
) => {
  return useQuery({
    queryKey: saleKeys.list(params || {}),
    queryFn: () => salesApi.getSales(params),
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesApi.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      toast.success('Sale created successfully');
    },
    onError: () => toast.error('Failed to create sale'),
  });
};

export const useSaleById = (id: string | number) => {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: () => salesApi.getSaleById(id),
    enabled: !!id,
  });
};
