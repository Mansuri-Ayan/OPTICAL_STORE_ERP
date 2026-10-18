import { UserRole } from './auth.types';

export interface StaffMember {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  store_id: string | number;
  store_name?: string;
  created_at: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  store_id: string | number;
  is_active?: boolean;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {}

export interface Permission {
  id: string | number;
  name: string;
  description: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
}
