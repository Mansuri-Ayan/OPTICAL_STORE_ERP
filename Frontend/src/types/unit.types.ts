/**
 * Serialized Product Unit & Barcode Types
 */

export type UnitStatus =
  | 'AVAILABLE'
  | 'SOLD'
  | 'DAMAGED'
  | 'IN_REPAIR'
  | 'LOST'
  | 'RESERVED'
  | 'DEADSTOCK'
  | 'EXCHANGED';

export type UnitSource =
  | 'PURCHASE_ORDER'
  | 'MANUAL_ADD'
  | 'TRANSFER_IN'
  | 'RETURN'
  | 'EXCHANGE_IN';

export interface ProductUnit {
  id: string | number;
  product_id: string | number;
  product_name: string;
  brand_name?: string;
  category_name?: string;
  sku: string;
  barcode: string;
  store_id: string | number;
  store_name?: string;
  cost_price?: number;
  selling_price?: number;
  mrp?: number;
  status: UnitStatus;
  source: UnitSource;
  color?: string;
  size?: string;
  batch_number?: string;
  is_transferred?: boolean;
  transferred_to_store_name?: string;
  created_at: string;
}

export interface BarcodePdfRequest {
  unit_ids?: (string | number)[];
  product_id?: string | number;
  quantity?: number;
  label_format?: 'JEWELRY_TAG' | '50X25MM' | 'A4_SHEET';
  include_price?: boolean;
  include_mrp?: boolean;
}
