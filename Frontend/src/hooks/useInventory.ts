import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (params: PaginationParams & { store_id?: string | number }) => [...inventoryKeys.lists(), params] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...inventoryKeys.details(), String(id)] as const,
};

export const useInventory = (params?: PaginationParams & { store_id?: string | number }) => {
  return useQuery({
    queryKey: inventoryKeys.list(params || {}),
    queryFn: () => inventoryApi.getInventory(params)
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      toast.success('Inventory item added successfully');
    },
    onError: () => toast.error('Failed to add inventory item')
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.updateInventory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(data.id) });
      toast.success('Inventory updated successfully');
    },
    onError: () => toast.error('Failed to update inventory')
  });
};

export const useTransferStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.transferStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      toast.success('Stock transferred successfully');
    },
    onError: () => toast.error('Failed to transfer stock')
  });
};
