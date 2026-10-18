import { axiosInstance } from '@/api/axiosInstance';
import { LoyaltyConfig, LoyaltyAdjustRequest } from '@/types';

export const loyaltyApi = {
  getLoyaltyConfig: async (): Promise<LoyaltyConfig> => {
    const response = await axiosInstance.get<LoyaltyConfig>('/loyalty/config');
    return response.data;
  },
  updateLoyaltyConfig: async (data: LoyaltyConfig): Promise<LoyaltyConfig> => {
    const response = await axiosInstance.put<LoyaltyConfig>('/loyalty/config', data);
    return response.data;
  },
  adjustPoints: async (data: LoyaltyAdjustRequest): Promise<void> => {
    await axiosInstance.post('/loyalty/adjust', data);
  }
};
