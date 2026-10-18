import { Prescription } from './optical.types';

export interface CustomerHistoryItem {
  date: string;
  event: string;
  description: string;
}

export interface CustomerOrderSummary {
  id: string | number;
  frameName?: string;
  productName?: string;
  lensType?: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export interface CustomerLink {
  id: string | number;
  customer_id_1: string | number;
  customer_id_2: string | number;
  relationship?: string;
  linked_customer?: {
    id: string | number;
    name: string;
    phone: string;
    email?: string;
  };
}

export interface Customer {
  id: string | number;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  date_of_birth?: string;
  loyalty_points?: number;
  loyalty_tier?: 'Silver' | 'Gold' | 'Platinum' | string;
  store_id?: string | number;
  status?: 'Active' | 'Inactive' | 'VIP' | string;
  customerSince?: string;
  lastVisit?: string;
  remark?: string;
  totalOrders?: number;
  totalAmount?: number;
  outstandingBalance?: number;
  prescription?: Prescription | null;
  prescriptions?: Prescription[];
  orders?: CustomerOrderSummary[];
  history?: CustomerHistoryItem[];
  linkedMembers?: CustomerLink[];
  created_at: string;
}

export interface CreateCustomerRequest {
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gender?: string;
  date_of_birth?: string;
  store_id?: string | number;
  remark?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}
