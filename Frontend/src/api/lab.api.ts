import { axiosInstance } from '@/api/axiosInstance';
import { LabOrder, LabOrderCreateRequest, LabOrderUpdateRequest, PaginationParams, PaginatedResponse } from '@/types';

export const labApi = {
  getLabOrders: async (params?: PaginationParams): Promise<PaginatedResponse<LabOrder>> => {
    const response = await axiosInstance.get<PaginatedResponse<LabOrder>>('/labs', { params });
    return response.data;
  },
  createLabOrder: async (data: LabOrderCreateRequest): Promise<LabOrder> => {
    const response = await axiosInstance.post<LabOrder>('/labs', data);
    return response.data;
  },
  updateLabOrder: async ({ id, data }: { id: string; data: LabOrderUpdateRequest }): Promise<LabOrder> => {
    const response = await axiosInstance.put<LabOrder>(`/labs/${id}`, data);
    return response.data;
  }
};
