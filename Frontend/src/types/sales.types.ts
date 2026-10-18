import { Prescription } from './optical.types';

export interface SalePayment {
  id?: string | number;
  sale_id?: string | number;
  payment_method: 'CASH' | 'UPI' | 'CARD' | 'NET_BANKING' | 'CHEQUE' | string;
  amount: number;
  reference_number?: string;
  created_at?: string;
}

export interface SaleItem {
  id: string | number;
  product_id: string | number;
  product_name?: string;
  sku?: string;
  barcode?: string;
  inventory_id?: string | number;
  quantity: number;
  unit_price: number;
  discount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total: number;
  color?: string;
  size?: string;
  brand_name?: string;
  category_name?: string;
}

export interface Sale {
  id: string | number;
  invoice_number: string;
  customer_id: string | number;
  customer_name?: string;
  customer_phone?: string;
  store_id: string | number;
  store_name?: string;
  items: SaleItem[];
  subtotal?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  discount_amount?: number;
  total_amount: number;
  net_amount: number;
  paid_amount?: number;
  remaining_amount?: number;
  balance_due?: number;
  payment_method: string;
  payments?: SalePayment[];
  status: 'Completed' | 'Cancelled' | 'Returned' | string;
  lab_status?: 'Confirmed' | 'Sent To Lab' | 'Ready For Pickup' | 'Delivered' | string;
  sent_to_lab_date?: string;
  expected_delivery_date?: string;
  prescription?: Prescription | null;
  notes?: string;
  created_at: string;
}

export interface CreateSaleRequest {
  customer_id: string | number;
  store_id: string | number;
  items: Array<{
    product_id: string | number;
    inventory_id?: string | number;
    quantity: number;
    unit_price: number;
    discount?: number;
    color?: string;
    size?: string;
  }>;
  subtotal?: number;
  cgst?: number;
  sgst?: number;
  discount_amount?: number;
  total_amount: number;
  net_amount: number;
  paid_amount?: number;
  remaining_amount?: number;
  payment_method: string;
  payments?: Array<{ payment_method: string; amount: number; reference_number?: string }>;
  status?: string;
  lab_status?: string;
  expected_delivery_date?: string;
  prescription?: Prescription | null;
  notes?: string;
}
