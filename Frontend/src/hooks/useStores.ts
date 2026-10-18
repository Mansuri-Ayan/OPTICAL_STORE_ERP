import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storeApi } from '@/api/store.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...storeKeys.lists(), params] as const,
  selector: () => [...storeKeys.all, 'selector'] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...storeKeys.details(), String(id)] as const,
};

export const useStores = (params?: PaginationParams) => {
  return useQuery({
    queryKey: storeKeys.list(params || {}),
    queryFn: () => storeApi.getStores(params)
  });
};

export const useStoreSelector = () => {
  return useQuery({
    queryKey: storeKeys.selector(),
    queryFn: () => storeApi.getStoreSelector(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeApi.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.selector() });
      toast.success('Store created successfully');
    },
    onError: () => toast.error('Failed to create store')
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeApi.updateStore,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.selector() });
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(data.id) });
      toast.success('Store updated successfully');
    },
    onError: () => toast.error('Failed to update store')
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeApi.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.selector() });
      toast.success('Store deleted successfully');
    },
    onError: () => toast.error('Failed to delete store')
  });
};
