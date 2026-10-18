export interface Store {
  id: string | number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  is_active: boolean;
  admin_id: string | number;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreRequest {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  is_active?: boolean;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {}

export interface StoreSelectorItem {
  id: number;
  name: string;
  store_name: string;
  city: string;
  is_active: boolean;
}

export interface StoreSelectorResponse {
  items: StoreSelectorItem[];
  total: number;
}

