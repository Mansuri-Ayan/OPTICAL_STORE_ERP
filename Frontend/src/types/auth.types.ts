export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WORKER = 'WORKER',
  OPTICIAN = 'OPTICIAN',
  ACCOUNTANT = 'ACCOUNTANT',
}

export interface User {
  id: string | number;
  email: string;
  full_name?: string;
  role: UserRole | string;
  store_id?: number | string | null;
  store_name?: string | null;
  name?: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  is_active?: boolean;
}

export interface LoginRequest {
  email: string;
  password?: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user?: User;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  business_name: string;
  phone?: string;
  verification_token?: string;
}

export interface RegisterAdminRequest {
  name?: string;
  full_name?: string;
  business_name: string;
  owner_first_name?: string;
  owner_last_name?: string;
  email: string;
  phone: string;
  password: string;
  verification_token?: string;
}

export interface OTPRequestPayload {
  email: string;
  phone?: string;
  force_new?: boolean;
}

export interface OTPResponse {
  message: string;
  email: string;
  expires_in_seconds?: number;
  cooldown_seconds?: number;
  already_sent?: boolean;
}

export interface OTPVerifyPayload {
  email: string;
  otp: string;
}

export interface OTPVerifyResponse {
  message: string;
  verification_token: string;
}

export interface OTPStatusResponse {
  active: boolean;
  email: string;
  expires_in_seconds: number;
  cooldown_seconds: number;
  attempts_left: number;
}
