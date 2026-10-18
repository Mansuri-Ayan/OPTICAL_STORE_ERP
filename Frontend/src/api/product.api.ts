import { axiosInstance } from '@/api/axiosInstance';
import { Product, ProductCreateRequest, ProductUpdateRequest, Category, CategoryCreateRequest, CategoryUpdateRequest, Brand, BrandCreateRequest, BrandUpdateRequest, PaginationParams, PaginatedResponse } from '@/types';

export const productApi = {
  getProducts: async (params?: PaginationParams): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },
  createProduct: async (data: ProductCreateRequest): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/products', data);
    return response.data;
  },
  getProductById: async (id: string | number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },
  updateProduct: async ({ id, data }: { id: string | number; data: ProductUpdateRequest }): Promise<Product> => {
    const response = await axiosInstance.put<Product>(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },

  getCategories: async (params?: PaginationParams): Promise<PaginatedResponse<Category>> => {
    const response = await axiosInstance.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },
  createCategory: async (data: CategoryCreateRequest): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/categories', data);
    return response.data;
  },
  updateCategory: async ({ id, data }: { id: string | number; data: CategoryUpdateRequest }): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },

  getBrands: async (params?: PaginationParams): Promise<PaginatedResponse<Brand>> => {
    const response = await axiosInstance.get<PaginatedResponse<Brand>>('/brands', { params });
    return response.data;
  },
  createBrand: async (data: BrandCreateRequest): Promise<Brand> => {
    const response = await axiosInstance.post<Brand>('/brands', data);
    return response.data;
  },
  updateBrand: async ({ id, data }: { id: string | number; data: BrandUpdateRequest }): Promise<Brand> => {
    const response = await axiosInstance.put<Brand>(`/brands/${id}`, data);
    return response.data;
  },
  deleteBrand: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/brands/${id}`);
  }
};
