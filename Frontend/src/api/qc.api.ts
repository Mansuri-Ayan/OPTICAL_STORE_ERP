import { axiosInstance } from '@/api/axiosInstance';
import {
  DamagedItem,
  SupplierResolutionPayload,
  LabResolutionPayload,
  PaginationParams,
  PaginatedResponse,
} from '@/types';

export const qcApi = {
  // Pre-Lab and Post-Lab Evaluations
  submitPreLabQC: async (saleItemId: string | number, data: { passed: boolean; notes?: string }) => {
    const response = await axiosInstance.post(`/qc/items/${saleItemId}/pre-lab`, data);
    return response.data;
  },

  submitPostLabQC: async (
    saleItemId: string | number,
    data: { outcome: 'PASSED' | 'FITTING_FAILURE' | 'LAB_DAMAGE' | 'STOCK_DAMAGE'; notes?: string }
  ) => {
    const response = await axiosInstance.post(`/qc/items/${saleItemId}/post-lab`, data);
    return response.data;
  },

  getItemReplacementOptions: async (saleItemId: string | number) => {
    const response = await axiosInstance.get(`/qc/items/${saleItemId}/replacement-options`);
    return response.data;
  },

  resolveSaleItemDamage: async (saleItemId: string | number, data: unknown) => {
    const response = await axiosInstance.post(`/qc/items/${saleItemId}/resolve-damage`, data);
    return response.data;
  },

  // Damaged Stock Directory & Claims
  getDamagedItems: async (
    params?: PaginationParams & {
      store_id?: string | number;
      stage?: string;
      status?: string;
      warranty_status?: string;
    }
  ): Promise<PaginatedResponse<DamagedItem>> => {
    const response = await axiosInstance.get<PaginatedResponse<DamagedItem>>('/qc/damaged-items', { params });
    return response.data;
  },

  resolveSupplierDamage: async (damagedItemId: string | number, data: SupplierResolutionPayload) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/supplier-resolution`, data);
    return response.data;
  },

  resolveLabDamage: async (damagedItemId: string | number, data: LabResolutionPayload) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/lab-resolution`, data);
    return response.data;
  },

  markDamagedItemAsLoss: async (
    damagedItemId: string | number,
    data: { loss_reason: string; loss_amount?: number; resolution_notes?: string }
  ) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/mark-as-loss`, data);
    return response.data;
  },

  verifyCompleteDamage: async (
    damagedItemId: string | number,
    data?: { verified_notes?: string; received_quantity?: number }
  ) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/verify-complete`, data);
    return response.data;
  },

  markFailedDamage: async (damagedItemId: string | number, data: { failure_reason: string; notes?: string }) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/mark-failed`, data);
    return response.data;
  },

  reopenDamagedItem: async (damagedItemId: string | number, data: { reason: string; notes?: string }) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/reopen`, data);
    return response.data;
  },

  changeDamageResolution: async (damagedItemId: string | number, data: unknown) => {
    const response = await axiosInstance.post(`/qc/damaged-items/${damagedItemId}/change-resolution`, data);
    return response.data;
  },

  getDamagedItemHistory: async (damagedItemId: string | number) => {
    const response = await axiosInstance.get(`/qc/damaged-items/${damagedItemId}/history`);
    return response.data;
  },
};
