import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Glasses,
  CheckCircle2,
  Check,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { registerSchema, RegisterSchema } from '@/lib/zodSchemas/auth.schema';
import { authApi } from '@/api/auth.api';
import { useSendOtp, useVerifyOtp, useRegisterAdmin } from '@/hooks/useAuth';
import { formatAuthError, FormattedError } from '@/utils/formatError';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

const STORE_BENEFITS = [
  'Instant POS Billing: multi-mode payments & GST compliant invoicing',
  'Multi-Store Ready: manage single or multi-branch optical chains',
  'Integrated Optical Lab: track lens edging & fitting job orders',
  'Automated Barcodes: 50x25mm labels, serial units & deadstock alerts',
];

export default function RegisterPage() {
  const navigate = useNavigate();

  // Restore saved registration form data from sessionStorage if user refreshes or returns
  const [formData, setFormData] = useState<RegisterSchema | null>(() => {
    try {
      const saved = sessionStorage.getItem('admin_register_formData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Multi-stage onboarding: 1: Details Form, 2: OTP Verification, 3: Success
  // Check explicit admin_register_step: only resume on Step 2 if user was actively on Step 2
  const [step, setStep] = useState<1 | 2 | 3>(() => {
    try {
      const savedStep = sessionStorage.getItem('admin_register_step');
      const savedData = sessionStorage.getItem('admin_register_formData');
      if (savedStep === '2' && savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed?.email) return 2;
      }
    } catch {}
    return 1;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<FormattedError | null>(null);

  // OTP State
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(600);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mutations
  const { mutateAsync: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();
  const { mutateAsync: registerAdmin, isPending: isRegistering } = useRegisterAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: formData || {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
    },
  });

  // Check Backend Active OTP Session on Mount to restore Step 2 if user refreshes or returns before OTP expires
  useEffect(() => {
    if (!formData?.email) return;

    let isMounted = true;
    authApi
      .checkOtpStatus({ email: formData.email.trim() })
      .then((res) => {
        if (!isMounted) return;
        if (res?.active) {
          setStep(2);
          setExpirySeconds(res.expires_in_seconds || 600);
          setCooldownSeconds(res.cooldown_seconds || 0);
        } else {
          sessionStorage.removeItem('admin_register_formData');
          setStep(1);
        }
      })
      .catch(() => {
        if (isMounted) {
          sessionStorage.removeItem('admin_register_formData');
          setStep(1);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Cooldown countdown timer (60s resend limit)
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Expiry countdown timer (10-minute expiry)
  useEffect(() => {
    if (step !== 2 || expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const clearAuthError = () => {
    if (authError) setAuthError(null);
  };

  // Step 1: Submit Details & Request OTP Code (Caches form data in sessionStorage)
  const onDetailsSubmit = async (data: RegisterSchema) => {
    clearAuthError();
    try {
      // 1. Pre-validate phone and email by passing both to sendOtp with force_new: true
      const res = await sendOtp({
        email: data.email.trim(),
        phone: data.phone.trim(),
        force_new: true,
      });

      // 2. If pre-validation succeeds, cache data and proceed to Step 2
      setFormData(data);
      sessionStorage.setItem('admin_register_formData', JSON.stringify(data));
      sessionStorage.setItem('admin_register_step', '2');
      setOtp(['', '', '', '', '', '']);
      setCooldownSeconds(res.cooldown_seconds || 60);
      setExpirySeconds(res.expires_in_seconds || 600);
      setStep(2);
      // Auto-focus first OTP input on step transition
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err: unknown) {
      const formatted = formatAuthError(err);
      setAuthError(formatted);
    }
  };

  // Resend OTP Code (Explicitly requests new OTP code)
  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || !formData?.email) return;
    clearAuthError();
    try {
      const res = await sendOtp({
        email: formData.email.trim(),
        phone: formData.phone?.trim(),
        force_new: true,
      });
      setCooldownSeconds(res.cooldown_seconds || 60);
      setExpirySeconds(res.expires_in_seconds || 600);
      setOtp(['', '', '', '', '', '']);
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } catch (err: unknown) {
      const formatted = formatAuthError(err);
      setAuthError(formatted);
    }
  };

  // Return to Step 1 & Pre-populate entered data so user doesn't retype
  const handleEditDetails = () => {
    clearAuthError();
    if (formData) {
      reset(formData);
    }
    setOtp(['', '', '', '', '', '']);
    sessionStorage.setItem('admin_register_step', '1');
    setStep(1);
  };

  // OTP Segmented Input Handlers
  const handleOtpChange = (index: number, value: string) => {
    clearAuthError();

    // Handle full paste
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      if (otpInputRefs.current[nextIndex]) {
        otpInputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance
    if (digit && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    clearAuthError();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    const focusIdx = Math.min(digits.length, 5);
    if (otpInputRefs.current[focusIdx]) {
      otpInputRefs.current[focusIdx]?.focus();
    }
  };

  // Step 2: Verify OTP & Create Store Admin Account
  const onVerifyAndRegister = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6 || !formData?.email || expirySeconds <= 0) return;

    clearAuthError();
    try {
      // 1. Verify OTP & obtain signed token
      const verifyRes = await verifyOtp({
        email: formData.email.trim(),
        otp: fullOtp,
      });

      // 2. Register Admin with verification token
      const nameParts = formData.name.trim().split(/\s+/);
      const owner_first_name = nameParts[0] || 'Admin';
      const owner_last_name = nameParts.slice(1).join(' ') || 'Owner';

      await registerAdmin({
        business_name: formData.business_name?.trim() || `${owner_first_name}'s Optical Store`,
        owner_first_name,
        owner_last_name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        verification_token: verifyRes.verification_token,
      });

      sessionStorage.removeItem('admin_register_formData');
      sessionStorage.removeItem('admin_register_step');
      setStep(3);
    } catch (err: unknown) {
      const formatted = formatAuthError(err);
      setAuthError(formatted);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex bg-slate-900 overflow-x-hidden">
      {/* ── LEFT SHOWCASE PANEL (Desktop 1024px+) ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 xl:p-12 2xl:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden border-r border-slate-800">
        {/* Subtle Lens Curvature Accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full border border-emerald-500/20 pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-[32rem] h-[32rem] rounded-full border border-emerald-500/10 pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                TechSentinals
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mt-1">
                Optical Store Management
              </span>
            </div>
          </div>
        </div>

        {/* Center Editorial Showcase */}
        <div className="relative z-10 my-auto py-4 xl:py-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Optical Store & Clinic Software
          </div>

          <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-black text-white tracking-tight leading-snug">
            Empower your eyewear retail with modern intelligence.
          </h2>

          <p className="mt-3 text-xs xl:text-sm text-slate-300 leading-relaxed">
            Register your optical store to automate prescriptions, billing, lab orders, inventory, and GST accounting from day one.
          </p>

          {/* Genuine Store Benefits */}
          <div className="mt-5 space-y-2.5">
            {STORE_BENEFITS.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs xl:text-sm text-slate-200">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>TechSentinals Optical Suite</span>
          <span>Fast &bull; Reliable &bull; GST Ready</span>
        </div>
      </div>

      {/* ── RIGHT REGISTRATION PANEL (All Screens) ──────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 lg:h-full flex flex-col justify-start px-6 sm:px-10 lg:px-10 xl:px-14 py-8 sm:py-10 pb-24 sm:pb-28 bg-white overflow-y-auto overflow-x-hidden">
        {/* Mobile Header (visible only on <lg screens) */}
        <div className="lg:hidden flex items-center gap-2.5 pb-4 mb-2 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Glasses className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block leading-tight">
              TechSentinals Optical Store
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Store Owner Registration
            </span>
          </div>
        </div>

        {/* Main Content Container — Fixed Height Budget & Top-Anchored Progress (Zero Jumps, No Top Clipping) */}
        <div className="w-full max-w-md mx-auto my-0 pt-2 sm:pt-4 pb-6 flex flex-col justify-between min-h-[540px] sm:min-h-[560px]">
          {/* Step Progress Bar — Anchored at Exact Top */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 shrink-0">
            {/* Step 1: Account Details */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200',
                  step >= 1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-200',
                  step === 1 && 'ring-2 ring-emerald-500/20'
                )}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span
                className={cn(
                  'text-xs font-bold transition-colors duration-200',
                  step === 1 ? 'text-slate-900' : 'text-slate-500'
                )}
              >
                Account Details
              </span>
            </div>

            {/* Connecting Progress Track */}
            <div className="h-1 flex-1 bg-slate-100 rounded-full mx-3 overflow-hidden">
              <div
                className={cn(
                  'h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300',
                  step >= 2 ? 'w-full' : 'w-0'
                )}
              />
            </div>

            {/* Step 2: Email OTP */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200',
                  step >= 2
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-200',
                  step === 2 && 'ring-2 ring-emerald-500/20'
                )}
              >
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span
                className={cn(
                  'text-xs font-bold transition-colors duration-200',
                  step === 2 ? 'text-slate-900' : 'text-slate-400'
                )}
              >
                Email OTP
              </span>
            </div>
          </div>

          {/* Contextual Inline Error Alert Banner */}
          {authError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200/90 text-red-900 text-xs animate-in fade-in duration-150 shrink-0"
            >
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-red-950 block text-[13px] leading-tight">
                  {authError.title}
                </span>
                <p className="mt-1 text-red-800 leading-relaxed text-xs">
                  {authError.message}
                </p>
                {authError.title === 'Account Already Exists' && (
                  <Link
                    to="/login"
                    onClick={() => {
                      sessionStorage.removeItem('admin_register_step');
                    }}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    <span>Sign In to your store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STAGE 1: STORE & OWNER DETAILS FORM
             ══════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-between">
              <form onSubmit={handleSubmit(onDetailsSubmit)} id="step1-register-form" className="space-y-3.5 sm:space-y-4">
                <div className="mb-3 sm:mb-4">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Register Your Store
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Set up your optical store and administrator account.
                  </p>
                </div>

                {/* 1. Owner Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Owner Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      {...register('name', { onChange: clearAuthError })}
                      disabled={isSendingOtp}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className={cn(
                        'block w-full h-10.5 pl-9 pr-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                        errors.name
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 focus:bg-white'
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* 2. Owner Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Owner Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      {...register('email', {
                        onChange: () => {
                          clearAuthError();
                          setOtp(['', '', '', '', '', '']);
                          sessionStorage.removeItem('admin_register_formData');
                        },
                      })}
                      onFocus={() => {
                        clearAuthError();
                        setOtp(['', '', '', '', '', '']);
                      }}
                      disabled={isSendingOtp}
                      placeholder="owner@opticalstore.com"
                      className={cn(
                        'block w-full h-10.5 pl-9 pr-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                        errors.email
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 focus:bg-white'
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* 4. Mobile Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative flex">
                    <div className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 select-none">
                      +91
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        {...register('phone', {
                          onChange: () => {
                            clearAuthError();
                            sessionStorage.removeItem('admin_register_formData');
                          },
                        })}
                        disabled={isSendingOtp}
                        placeholder="9876543210"
                        className={cn(
                          'block w-full h-10.5 pl-9 pr-3.5 rounded-r-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                          'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                          errors.phone
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 focus:bg-white'
                        )}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* 5. Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { onChange: clearAuthError })}
                      disabled={isSendingOtp}
                      placeholder="••••••••••••"
                      className={cn(
                        'block w-full h-10.5 pl-9 pr-10 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                        errors.password
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 focus:bg-white'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* 6. Confirm Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirm_password', { onChange: clearAuthError })}
                      disabled={isSendingOtp}
                      placeholder="••••••••••••"
                      className={cn(
                        'block w-full h-10.5 pl-9 pr-10 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                        errors.confirm_password
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 focus:bg-white'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors.confirm_password.message}</p>
                  )}
                </div>
              </form>

              {/* Submit Action Button & Footer — Anchored at Exact Bottom */}
              <div className="mt-auto pt-6 pb-2">
                <button
                  type="submit"
                  form="step1-register-form"
                  disabled={isSendingOtp}
                  className={cn(
                    'w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-colors duration-150 cursor-pointer mt-1',
                    isSendingOtp
                      ? 'bg-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] shadow-emerald-600/25 hover:shadow-emerald-600/35'
                  )}
                >
                  {isSendingOtp ? (
                    <>
                      <Spinner size="sm" variant="button" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Login Footer */}
                <div className="mt-5 pt-4 pb-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Already have an optical account?</span>
                  <Link
                    to="/login"
                    onClick={() => {
                      sessionStorage.removeItem('admin_register_step');
                    }}
                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline py-1"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STAGE 2: 6-DIGIT EMAIL OTP VERIFICATION
             ══════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="flex-1 flex flex-col justify-between text-center">
              <div>
                {/* Header Badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mb-3 shadow-md shadow-emerald-600/20 ring-1 ring-white/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Verify Your Email
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  We sent a 6-digit verification code to{' '}
                  <span className="font-semibold text-slate-800">{formData?.email}</span>
                </p>

                {/* Segmented 6-Digit OTP Boxes */}
                <div className="my-6">
                  {/* Expiry Countdown Header */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 max-w-xs mx-auto mb-2">
                    <span>Enter 6-digit code:</span>
                    <span
                      className={cn(
                        'font-mono',
                        expirySeconds <= 60
                          ? 'text-rose-600 animate-pulse font-bold'
                          : 'text-slate-700'
                      )}
                    >
                      {expirySeconds > 0 ? (
                        `Expires in: ${formatTimer(expirySeconds)}`
                      ) : (
                        <span className="text-rose-600 font-bold">Code expired</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        disabled={isVerifyingOtp || isRegistering}
                        className={cn(
                          'w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-extrabold rounded-xl border bg-slate-50/50 text-slate-900 transition-colors duration-150',
                          'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white',
                          digit ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200'
                        )}
                      />
                    ))}
                  </div>

                  {expirySeconds === 0 ? (
                    <p className="mt-2 text-xs font-semibold text-rose-600">
                      Verification code has expired. Please click Resend Code to request a new code.
                    </p>
                  ) : (
                    <p className="mt-2 text-[11px] text-slate-400 font-medium">
                      Select and paste code directly from your email inbox.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button & Footer Controls — Anchored at Exact Bottom */}
              <div className="mt-auto pt-6 pb-2">
                <button
                  type="button"
                  onClick={onVerifyAndRegister}
                  disabled={otp.join('').length !== 6 || isVerifyingOtp || isRegistering || expirySeconds <= 0}
                  className={cn(
                    'w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-colors duration-150 cursor-pointer mt-1',
                    otp.join('').length !== 6 || isVerifyingOtp || isRegistering || expirySeconds <= 0
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] shadow-emerald-600/25 hover:shadow-emerald-600/35'
                  )}
                >
                  {isVerifyingOtp || isRegistering ? (
                    <>
                      <Spinner size="sm" variant="button" />
                      <span>Creating Store Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Create Store</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend & Edit Email Controls */}
                <div className="mt-5 pt-4 pb-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={handleEditDetails}
                    className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>

                  {cooldownSeconds > 0 ? (
                    <span className="text-slate-400 py-1">Resend in {cooldownSeconds}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer py-1"
                    >
                      <RefreshCw className={cn('w-3 h-3', isSendingOtp && 'animate-spin')} />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STAGE 3: REGISTRATION SUCCESS (READY STATE)
             ══════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="flex-1 flex flex-col justify-between text-center py-2">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Store Created Successfully!
                </h2>
                <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                  Welcome to TechSentinals. Your optical store administrator account is now active and ready.
                </p>

                {/* Summary Card */}
                <div className="my-5 p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-left space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Administrator:</span>
                    <span className="font-bold text-slate-900">{formData?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Contact Phone:</span>
                    <span className="font-bold text-slate-900">+91 {formData?.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Login Email:</span>
                    <span className="font-bold text-emerald-700">{formData?.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Role Assigned:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Store Owner (Admin)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sign In CTA Button */}
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl text-sm font-bold text-white shadow-md bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] shadow-emerald-600/25 transition-colors cursor-pointer"
                >
                  <span>Sign In to Your Store</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
