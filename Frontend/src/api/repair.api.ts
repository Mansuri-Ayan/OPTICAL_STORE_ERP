import { axiosInstance } from '@/api/axiosInstance';
import { Repair, RepairCreateRequest, RepairUpdateRequest, PaginationParams, PaginatedResponse } from '@/types';

export const repairApi = {
  getRepairs: async (params?: PaginationParams): Promise<PaginatedResponse<Repair>> => {
    const response = await axiosInstance.get<PaginatedResponse<Repair>>('/repairs', { params });
    return response.data;
  },
  createRepair: async (data: RepairCreateRequest): Promise<Repair> => {
    const response = await axiosInstance.post<Repair>('/repairs', data);
    return response.data;
  },
  updateRepair: async ({ id, data }: { id: string; data: RepairUpdateRequest }): Promise<Repair> => {
    const response = await axiosInstance.put<Repair>(`/repairs/${id}`, data);
    return response.data;
  }
};
