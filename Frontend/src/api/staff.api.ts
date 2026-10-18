import { axiosInstance } from '@/api/axiosInstance';
import { Staff, StaffCreateRequest, StaffUpdateRequest, PaginationParams, PaginatedResponse } from '@/types';

export const staffApi = {
  getStaff: async (params?: PaginationParams & { role?: string }): Promise<PaginatedResponse<Staff>> => {
    const response = await axiosInstance.get<PaginatedResponse<Staff>>('/workers', { params });
    return response.data;
  },
  createStaff: async (data: StaffCreateRequest): Promise<Staff> => {
    const response = await axiosInstance.post<Staff>('/workers', data);
    return response.data;
  },
  updateStaff: async ({ id, data }: { id: string; data: StaffUpdateRequest }): Promise<Staff> => {
    const response = await axiosInstance.put<Staff>(`/workers/${id}`, data);
    return response.data;
  },
  deleteStaff: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/workers/${id}`);
  }
};
