import { axiosInstance } from '@/api/axiosInstance';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginationParams,
  PaginatedResponse,
  Prescription,
  CustomerLink,
} from '@/types';

export const customerApi = {
  getCustomers: async (params?: PaginationParams): Promise<PaginatedResponse<Customer>> => {
    const response = await axiosInstance.get<PaginatedResponse<Customer>>('/customers/', { params });
    return response.data;
  },

  createCustomer: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await axiosInstance.post<Customer>('/customers/', data);
    return response.data;
  },

  quickCreateCustomer: async (data: Partial<CreateCustomerRequest>): Promise<Customer> => {
    const response = await axiosInstance.post<Customer>('/customers/quick-create', data);
    return response.data;
  },

  getCustomerById: async (id: string | number): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  updateCustomer: async ({ id, data }: { id: string | number; data: UpdateCustomerRequest }): Promise<Customer> => {
    const response = await axiosInstance.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/customers/${id}`);
  },

  // Optical Prescriptions
  createPrescription: async (data: Partial<Prescription>): Promise<Prescription> => {
    const response = await axiosInstance.post<Prescription>('/prescriptions/', data);
    return response.data;
  },

  updatePrescription: async (id: string | number, data: Partial<Prescription>): Promise<Prescription> => {
    const response = await axiosInstance.put<Prescription>(`/prescriptions/${id}`, data);
    return response.data;
  },

  // Linked Family Members
  getLinkedMembers: async (customerId: string | number): Promise<CustomerLink[]> => {
    const response = await axiosInstance.get<CustomerLink[]>(`/customers/${customerId}/links`);
    return response.data;
  },

  createLinkedMember: async (customerId: string | number, payload: unknown): Promise<CustomerLink> => {
    const response = await axiosInstance.post<CustomerLink>(`/customers/${customerId}/links`, payload);
    return response.data;
  },

  removeLinkedMember: async (customerId: string | number, linkedId: string | number): Promise<void> => {
    await axiosInstance.delete(`/customers/${customerId}/links/${linkedId}`);
  },
};
