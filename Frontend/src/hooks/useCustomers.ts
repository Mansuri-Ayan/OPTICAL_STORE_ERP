import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/api/customer.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...customerKeys.details(), id] as const,
};

export const useCustomers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: customerKeys.list(params || {}),
    queryFn: () => customerApi.getCustomers(params)
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer created successfully');
    },
    onError: () => toast.error('Failed to create customer')
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.updateCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.id) });
      toast.success('Customer updated successfully');
    },
    onError: () => toast.error('Failed to update customer')
  });
};
