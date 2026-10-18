import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { LoginCredentials, User } from '@/types';
import toast from 'react-hot-toast';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // 1. Authenticate credentials
      const tokenPair = await authApi.login(credentials);

      // Temporarily store access token in memory so getMe has Authorization header
      useAuthStore.setState({ accessToken: tokenPair.access_token });

      // 2. Hydrate user profile from backend
      let userProfile: User;
      try {
        userProfile = await authApi.getMe();
      } catch {
        userProfile = {
          id: 'user',
          email: credentials.email,
          role: credentials.role || 'worker',
          name: credentials.email.split('@')[0],
          full_name: credentials.email.split('@')[0],
          is_active: true,
        };
      }

      return { tokenPair, userProfile };
    },
    onSuccess: ({ tokenPair, userProfile }) => {
      // 3. Commit state to Zustand
      setAuth(userProfile, tokenPair.access_token);
      queryClient.setQueryData(authKeys.me, userProfile);

      const displayName =
        userProfile.first_name ||
        userProfile.full_name ||
        userProfile.name ||
        userProfile.email.split('@')[0];
      toast.success(`Welcome back, ${displayName}!`);

      // 4. Role-based redirect
      const role = String(userProfile.role).toLowerCase();
      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'superadmin') {
        navigate('/super-admin/dashboard', { replace: true });
      } else if (role === 'accountant') {
        navigate('/accountant/sales-ledger', { replace: true });
      } else {
        // manager, worker, optician
        navigate('/pos', { replace: true });
      }
    },
    // No toast.error here — auth errors are presented contextually via inline UI banners
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    // Handled via inline UI banner
  });
};

export const useRegisterAdmin = () => {
  return useMutation({
    mutationFn: authApi.registerAdmin,
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: authApi.sendOtp,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authApi.verifyOtp,
  });
};

export const useCheckOtpStatus = () => {
  return useMutation({
    mutationFn: authApi.checkOtpStatus,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/super-admin')) {
        navigate('/super-admin/login', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
      toast.success('Logged out successfully');
    },
  });
};

export const useCurrentUser = (enabled = true) => {
  const userInStore = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.getMe,
    enabled: enabled && !userInStore,
    initialData: userInStore || undefined,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: false,
  });
};
