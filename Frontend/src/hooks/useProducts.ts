import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/product.api';
import { PaginationParams } from '@/types';
import toast from 'react-hot-toast';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...productKeys.details(), String(id)] as const,
  
  categories: {
    all: ['categories'] as const,
    lists: () => [...productKeys.categories.all, 'list'] as const,
    list: (params: PaginationParams) => [...productKeys.categories.lists(), params] as const,
  },
  
  brands: {
    all: ['brands'] as const,
    lists: () => [...productKeys.brands.all, 'list'] as const,
    list: (params: PaginationParams) => [...productKeys.brands.lists(), params] as const,
  }
};

export const useProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productApi.getProducts(params)
  });
};

export const useProductById = (id: string | number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: () => toast.error('Failed to create product')
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      toast.success('Product updated successfully');
    },
    onError: () => toast.error('Failed to update product')
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully');
    },
    onError: () => toast.error('Failed to delete product')
  });
};

export const useCategories = (params?: PaginationParams) => {
  return useQuery({
    queryKey: productKeys.categories.list(params || {}),
    queryFn: () => productApi.getCategories(params)
  });
};

export const useBrands = (params?: PaginationParams) => {
  return useQuery({
    queryKey: productKeys.brands.list(params || {}),
    queryFn: () => productApi.getBrands(params)
  });
};
