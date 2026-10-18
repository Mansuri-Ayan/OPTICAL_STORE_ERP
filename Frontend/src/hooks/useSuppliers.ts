import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/api/supplier.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...supplierKeys.lists(), params] as const,
  
  po: {
    all: ['purchaseOrders'] as const,
    lists: () => [...supplierKeys.po.all, 'list'] as const,
    list: (params: PaginationParams) => [...supplierKeys.po.lists(), params] as const,
  }
};

export const useSuppliers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: supplierKeys.list(params || {}),
    queryFn: () => supplierApi.getSuppliers(params)
  });
};

export const usePurchaseOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: supplierKeys.po.list(params || {}),
    queryFn: () => supplierApi.getPurchaseOrders(params)
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplierApi.createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.po.lists() });
      toast.success('Purchase order created successfully');
    },
    onError: () => toast.error('Failed to create purchase order')
  });
};
