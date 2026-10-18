export interface InventoryItem {
  id: string | number;
  product_id: string | number;
  product_name?: string;
  store_id: string | number;
  store_name?: string;
  batch_number?: string;
  quantity: number;
  cost_price?: number;
  selling_price?: number;
  expiry_date?: string;
  barcode?: string;
  is_active: boolean;
  created_at: string;
}

export interface TransferRequest {
  source_store_id: string | number;
  target_store_id: string | number;
  items: {
    product_id: string | number;
    quantity: number;
    batch_number?: string;
  }[];
  reason?: string;
}

export interface AgingConfig {
  threshold_days: number;
  status_label: string;
}
