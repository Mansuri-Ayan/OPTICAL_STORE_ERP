import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { loginSchema, LoginSchema } from '@/lib/zodSchemas/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { formatAuthError, FormattedError } from '@/utils/formatError';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

export default function SuperAdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<FormattedError | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'superadmin',
      email: '',
      password: '',
    },
  });

  // Countdown timer for 429 rate limits
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

  const clearAuthError = () => {
    if (authError) setAuthError(null);
  };

  const onSubmit = (data: LoginSchema) => {
    if (cooldownSeconds > 0) return;
    clearAuthError();

    login(
      {
        email: data.email.trim(),
        password: data.password,
        role: 'superadmin',
      },
      {
        onError: (err) => {
          const formatted = formatAuthError(err);
          setAuthError(formatted);
          if (formatted.isRateLimit && formatted.retryAfterSeconds) {
            setCooldownSeconds(formatted.retryAfterSeconds);
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Ambient Background Rings (Strictly Clipped Inside Viewport) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-emerald-500/10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full border border-slate-200" />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 my-auto">
        {/* Top Branding (Properly Proportioned to Prevent Top-Edge Clipping) */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mb-2.5 shadow-md shadow-emerald-600/20 ring-1 ring-white/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Super Admin Portal
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Platform administration & global system controls
          </p>
        </div>

        {/* Executive White Card Shell */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-200/60">
          {/* Inline Error Alert Banner */}
          {authError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200/90 text-red-900 text-xs animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-red-950 block text-[13px] leading-tight">
                  {authError.title}
                </span>
                <p className="mt-1 text-red-800 leading-relaxed text-xs">
                  {authError.message}
                </p>
                {cooldownSeconds > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-800 font-semibold text-[11px]">
                    <span>Please wait {cooldownSeconds}s before retrying</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Admin Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    onChange: clearAuthError,
                  })}
                  disabled={isPending || cooldownSeconds > 0}
                  placeholder="superadmin@techsentinals.com"
                  className={cn(
                    'block w-full h-10.5 pl-9 pr-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                    errors.email || authError
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 focus:bg-white'
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
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
                  {...register('password', {
                    onChange: clearAuthError,
                  })}
                  disabled={isPending || cooldownSeconds > 0}
                  placeholder="••••••••••••"
                  className={cn(
                    'block w-full h-10.5 pl-9 pr-10 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
                    errors.password || authError
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

            {/* Action Button */}
            <button
              type="submit"
              disabled={isPending || cooldownSeconds > 0}
              className={cn(
                'w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-colors duration-150 cursor-pointer',
                isPending || cooldownSeconds > 0
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] shadow-emerald-600/25 hover:shadow-emerald-600/35'
              )}
            >
              {isPending ? (
                <>
                  <Spinner size="sm" variant="button" />
                  <span>Signing in...</span>
                </>
              ) : cooldownSeconds > 0 ? (
                <span>Please wait ({cooldownSeconds}s)</span>
              ) : (
                <>
                  <span>Sign In to Super Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Return Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
