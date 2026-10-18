export interface Category {
  id: string | number;
  name: string;
  description?: string;
  is_active: boolean;
  admin_id: string | number;
}

export interface Brand {
  id: string | number;
  name: string;
  description?: string;
  is_active: boolean;
  admin_id: string | number;
}

export interface Product {
  id: string | number;
  name: string;
  description?: string;
  category_id: string | number;
  category_name?: string;
  brand_id: string | number;
  brand_name?: string;
  sku?: string;
  hsn_code?: string;
  gst_rate?: number;
  base_price?: number;
  selling_price?: number;
  is_active: boolean;
  admin_id: string | number;
  created_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category_id: string | number;
  brand_id: string | number;
  sku?: string;
  hsn_code?: string;
  gst_rate?: number;
  base_price?: number;
  selling_price?: number;
  is_active?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
