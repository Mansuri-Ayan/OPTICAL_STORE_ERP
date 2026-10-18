import { axiosInstance } from '@/api/axiosInstance';

export interface BillSettings {
  id?: string | number;
  store_id: string | number;
  header_text: string;
  sub_header_text: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  gst_number?: string;
  logo?: string | null;
  qr_code?: string | null;
  show_prescription?: boolean;
  show_gst?: boolean;
  theme_color?: string;
  footer_text?: string;
}

export const billSettingsApi = {
  getSettings: async (storeId: string | number): Promise<BillSettings> => {
    const response = await axiosInstance.get<BillSettings>(`/bill-settings/${storeId}`);
    return response.data;
  },

  updateSettings: async (storeId: string | number, payload: Partial<BillSettings>): Promise<BillSettings> => {
    const response = await axiosInstance.put<BillSettings>(`/bill-settings/${storeId}`, payload);
    return response.data;
  },
};
