/**
 * Exchanges and Returns domain types
 */

export interface ReturnItemInput {
  sale_item_id: string | number;
  product_id: string | number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_credit: number;
  condition: 'GOOD' | 'DAMAGED';
  return_reason: string;
}

export interface ReplacementItemInput {
  inventory_id: string | number;
  product_id: string | number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_charge: number;
}

export interface CreateExchangePayload {
  original_sale_id: string | number;
  store_id: string | number;
  returned_items: ReturnItemInput[];
  replacement_items: ReplacementItemInput[];
  return_total: number;
  replacement_total: number;
  net_difference: number; // positive = customer owes, negative = refund/credit
  payment_method?: 'CASH' | 'UPI' | 'CARD' | 'STORE_CREDIT';
  notes?: string;
}

export interface ExchangeRecord {
  id: string | number;
  exchange_number: string;
  original_sale_id: string | number;
  original_invoice_number: string;
  customer_id: string | number;
  customer_name?: string;
  store_id: string | number;
  store_name?: string;
  return_total: number;
  replacement_total: number;
  net_difference: number;
  status: 'COMPLETED' | 'CANCELLED';
  returned_items: ReturnItemInput[];
  replacement_items: ReplacementItemInput[];
  created_at: string;
}
