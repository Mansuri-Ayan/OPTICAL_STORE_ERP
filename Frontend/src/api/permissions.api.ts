import { axiosInstance } from '@/api/axiosInstance';

export interface MyPermissionsResponse {
  role: string;
  permissions: Record<string, boolean | { granted?: boolean; is_granted?: boolean }>;
}

export const permissionsApi = {
  getMyPermissions: async (): Promise<MyPermissionsResponse> => {
    const response = await axiosInstance.get<MyPermissionsResponse>('/permissions/me');
    return response.data;
  },

  getRoleDefaults: async (role: string) => {
    const response = await axiosInstance.get(`/permissions/defaults/${role}`);
    return response.data;
  },

  updateRoleDefault: async (payload: { roleType: string; permissionKey: string; isGranted: boolean }) => {
    const response = await axiosInstance.put('/permissions/defaults', payload);
    return response.data;
  },

  getStaffPermissions: async (staffId: string | number) => {
    const response = await axiosInstance.get(`/permissions/staff/${staffId}`);
    return response.data;
  },

  updateStaffPermission: async (payload: { staffId: string | number; permissionKey: string; isGranted: boolean }) => {
    const response = await axiosInstance.put('/permissions/staff', payload);
    return response.data;
  },
};
