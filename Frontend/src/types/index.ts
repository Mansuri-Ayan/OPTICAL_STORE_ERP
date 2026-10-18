export * from './common.types';
export * from './auth.types';
export * from './store.types';
export * from './staff.types';
export * from './product.types';
export * from './inventory.types';
export * from './sales.types';
export * from './customer.types';
export * from './supplier.types';
export * from './expense.types';
export * from './report.types';
export * from './optical.types';
export * from './qc.types';
export * from './exchange.types';
export * from './unit.types';

import { LoginRequest, LoginResponse, RegisterRequest } from './auth.types';
import { CreateStoreRequest, UpdateStoreRequest } from './store.types';
import { StaffMember, CreateStaffRequest, UpdateStaffRequest } from './staff.types';
import { CreateProductRequest, UpdateProductRequest } from './product.types';
import { InventoryItem, TransferRequest } from './inventory.types';
import { CreateSaleRequest } from './sales.types';
import { CreateCustomerRequest, UpdateCustomerRequest } from './customer.types';
import { PurchaseOrderItem } from './supplier.types';

// Pagination & Query Params
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: string | number;
  [key: string]: unknown;
}

// Auth Type Aliases
export type LoginCredentials = LoginRequest;
export type RegisterCredentials = RegisterRequest;
export type AuthResponse = LoginResponse;

// Store Type Aliases
export type StoreCreateRequest = CreateStoreRequest;
export type StoreUpdateRequest = UpdateStoreRequest;

// Staff Type Aliases
export type Staff = StaffMember;
export type StaffCreateRequest = CreateStaffRequest;
export type StaffUpdateRequest = UpdateStaffRequest;

// Product, Category & Brand Type Aliases
export type ProductCreateRequest = CreateProductRequest;
export type ProductUpdateRequest = UpdateProductRequest;
export interface CategoryCreateRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}
export type CategoryUpdateRequest = Partial<CategoryCreateRequest>;
export interface BrandCreateRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}
export type BrandUpdateRequest = Partial<BrandCreateRequest>;

// Inventory Type Aliases
export type Inventory = InventoryItem;
export interface InventoryCreateRequest {
  product_id: string | number;
  store_id: string | number;
  quantity: number;
  batch_number?: string;
  cost_price?: number;
  selling_price?: number;
  expiry_date?: string;
  barcode?: string;
  is_active?: boolean;
}
export type InventoryUpdateRequest = Partial<InventoryCreateRequest>;
export type StockTransferRequest = TransferRequest;

// Sales Type Aliases
export type SaleCreateRequest = CreateSaleRequest;

// Customer Type Aliases
export type CustomerCreateRequest = CreateCustomerRequest;
export type CustomerUpdateRequest = UpdateCustomerRequest;

// Supplier & Purchase Order Type Aliases
export interface SupplierCreateRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  gstin?: string;
  contact_person?: string;
  is_active?: boolean;
}
export type SupplierUpdateRequest = Partial<SupplierCreateRequest>;
export interface PurchaseOrderCreateRequest {
  supplier_id: string | number;
  store_id: string | number;
  items: PurchaseOrderItem[];
  total_amount?: number;
  status?: string;
  expected_delivery?: string;
}
export type PurchaseOrderUpdateRequest = Partial<PurchaseOrderCreateRequest>;

// Expense Type Aliases
export interface ExpenseCreateRequest {
  description: string;
  amount: number;
  category_id: string | number;
  store_id: string | number;
  date: string;
}
export type ExpenseUpdateRequest = Partial<ExpenseCreateRequest>;
export interface ExpenseCategoryCreateRequest {
  name: string;
}

// Repair Types
export interface Repair {
  id: string | number;
  customer_id?: string | number;
  customer_name?: string;
  device?: string;
  issue?: string;
  description?: string;
  cost?: number;
  status: string;
  date?: string;
  created_at: string;
}
export type RepairCreateRequest = Omit<Repair, 'id' | 'created_at'>;
export type RepairUpdateRequest = Partial<RepairCreateRequest>;

// Lab Order Types
export interface LabOrder {
  id: string | number;
  order_number?: string;
  customer_id?: string | number;
  customer_name?: string;
  prescription_details?: string;
  status: string;
  date?: string;
  notes?: string;
  created_at: string;
}
export type LabOrderCreateRequest = Omit<LabOrder, 'id' | 'created_at'>;
export type LabOrderUpdateRequest = Partial<LabOrderCreateRequest>;

// Loyalty Types
export interface LoyaltyConfig {
  points_per_rupee?: number;
  redemption_rate?: number;
  min_points_to_redeem?: number;
  [key: string]: unknown;
}
export interface LoyaltyAdjustRequest {
  customer_id: string | number;
  points: number;
  reason?: string;
}

// QC Types
export interface QCItem {
  id: string | number;
  product_id?: string | number;
  product_name?: string;
  inventory_id?: string | number;
  status: string;
  passed?: boolean;
  notes?: string;
  inspected_at?: string;
}
export type QCItemUpdateRequest = Partial<QCItem>;
