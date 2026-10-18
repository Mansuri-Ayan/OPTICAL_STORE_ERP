/**
 * Quality Control (QC) & Damaged Stock Resolution Types
 */

export type QCStage = 'PRE_LAB' | 'POST_LAB';
export type QCOutcome = 'PASSED' | 'FITTING_FAILURE' | 'LAB_DAMAGE' | 'STOCK_DAMAGE';

export type DamageStatus =
  | 'OPEN'
  | 'PROMISED'
  | 'RESOLVED'
  | 'REOPENED'
  | 'FAILED'
  | 'WRITTEN_OFF';

export type SupplierResolutionType =
  | 'REPLACEMENT'
  | 'FULL_COMPENSATION'
  | 'PARTIAL_COMPENSATION'
  | 'NO_COMPENSATION'
  | 'MARK_AS_LOSS';

export type SupplierReplacementSubtype = 'SAME_ITEM' | 'ALT_ITEM';
export type FinancialCompensationMode = 'CREDIT_NOTE' | 'CASH_REFUND';

export interface DamagedItem {
  id: string | number;
  sale_item_id?: string | number;
  inventory_id?: string | number;
  product_id: string | number;
  product_name: string;
  sku?: string;
  barcode?: string;
  stage: QCStage;
  status: DamageStatus;
  warranty_status?: 'IN_WARRANTY' | 'OUT_OF_WARRANTY';
  store_id: string | number;
  store_name?: string;
  supplier_id?: string | number;
  supplier_name?: string;
  lab_id?: string | number;
  lab_name?: string;
  cost_price?: number;
  selling_price?: number;
  damage_reason?: string;
  resolution_type?: string;
  compensation_amount?: number;
  loss_amount?: number;
  loss_reason?: string;
  expected_resolution_date?: string;
  resolved_at?: string;
  notes?: string;
  created_at: string;
}

export interface SupplierResolutionPayload {
  resolution_type: SupplierResolutionType;
  replacement_subtype?: SupplierReplacementSubtype;
  new_product_id?: string | number;
  financial_mode?: FinancialCompensationMode;
  compensation_amount?: number;
  loss_amount?: number;
  loss_reason?: string;
  po_id?: string | number;
  is_promise?: boolean;
  expected_date?: string;
  resolution_notes?: string;
}

export interface LabResolutionPayload {
  resolution_type: 'LAB_REDO' | 'FINANCIAL_COMPENSATION' | 'STORE_LOSS';
  compensation_amount?: number;
  loss_amount?: number;
  loss_reason?: string;
  is_promise?: boolean;
  expected_date?: string;
  resolution_notes?: string;
}

export interface CustomerContactLog {
  id: string | number;
  damaged_item_id: string | number;
  channel: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  contacted_at: string;
  staff_name?: string;
  customer_choice?: string;
  summary_notes: string;
}
