import { axiosInstance } from '@/api/axiosInstance';
import {
  LoginCredentials,
  RegisterCredentials,
  RegisterAdminRequest,
  OTPRequestPayload,
  OTPResponse,
  OTPVerifyPayload,
  OTPVerifyResponse,
  OTPStatusResponse,
  AuthResponse,
  User,
} from '@/types';

export const authApi = {
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterCredentials): Promise<AuthResponse | User> => {
    const response = await axiosInstance.post<User>('/auth/register/admin', data);
    return response.data;
  },
  registerAdmin: async (data: RegisterAdminRequest): Promise<User> => {
    const response = await axiosInstance.post<User>('/auth/register/admin', data);
    return response.data;
  },
  sendOtp: async (data: OTPRequestPayload): Promise<OTPResponse> => {
    const response = await axiosInstance.post<OTPResponse>('/auth/otp/send', data);
    return response.data;
  },
  verifyOtp: async (data: OTPVerifyPayload): Promise<OTPVerifyResponse> => {
    const response = await axiosInstance.post<OTPVerifyResponse>('/auth/otp/verify', data);
    return response.data;
  },
  checkOtpStatus: async (data: { email: string }): Promise<OTPStatusResponse> => {
    const response = await axiosInstance.post<OTPStatusResponse>('/auth/otp/status', data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
  refresh: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh');
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  }
};
