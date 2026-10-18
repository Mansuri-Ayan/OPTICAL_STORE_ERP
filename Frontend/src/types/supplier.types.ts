export interface Supplier {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  gstin?: string;
  contact_person?: string;
  is_active: boolean;
  admin_id: string | number;
  created_at: string;
}

export interface PurchaseOrderItem {
  product_id: string | number;
  quantity: number;
  unit_price: number;
}

export interface PurchaseOrder {
  id: string | number;
  po_number: string;
  supplier_id: string | number;
  supplier_name?: string;
  store_id: string | number;
  items: PurchaseOrderItem[];
  total_amount: number;
  status: string;
  expected_delivery?: string;
  created_at: string;
}
