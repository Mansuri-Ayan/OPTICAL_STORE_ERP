import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  Building2,
  ShoppingBag,
  Glasses,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { loginSchema, LoginSchema } from '@/lib/zodSchemas/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { formatAuthError, FormattedError } from '@/utils/formatError';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

type RoleId = 'admin' | 'manager' | 'worker' | 'optician' | 'accountant';

interface RoleOption {
  id: RoleId;
  label: string;
  description: string;
  icon: typeof Store;
}

const OWNER_ROLE: RoleOption = {
  id: 'admin',
  label: 'Store Owner',
  description: 'Store administration & business management',
  icon: Store,
};

const STAFF_ROLES: RoleOption[] = [
  {
    id: 'manager',
    label: 'Store Manager',
    description: 'Daily operations & staff',
    icon: Building2,
  },
  {
    id: 'worker',
    label: 'Sales Staff',
    description: 'Billing & customer sales',
    icon: ShoppingBag,
  },
  {
    id: 'optician',
    label: 'Optometrist',
    description: 'Eye exams & prescriptions',
    icon: Glasses,
  },
  {
    id: 'accountant',
    label: 'Accountant',
    description: 'Accounts, dues & GST',
    icon: Calculator,
  },
];

const STORE_BENEFITS = [
  'Eye testing & prescriptions (OD/OS power, prism, PD)',
  'Fast billing with GST invoices and multiple payment modes',
  'Frame, lens, contact lens & sunglass stock with barcode labels',
  'Track optical lab jobs from fitting to customer delivery',
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<RoleId>('worker');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<FormattedError | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'worker',
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

  const handleRoleSelect = (roleId: RoleId) => {
    clearAuthError();
    setSelectedRole(roleId);
    setValue('role', roleId, { shouldValidate: true });
  };

  const onSubmit = (data: LoginSchema) => {
    if (cooldownSeconds > 0) return;
    clearAuthError();

    login(
      {
        email: data.email.trim(),
        password: data.password,
        role: selectedRole,
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
            Complete management for your optical store and clinic.
          </h2>

          <p className="mt-3 text-xs xl:text-sm text-slate-300 leading-relaxed">
            Everything you need to run your eyewear business — manage eye examinations and prescriptions,
            sell frames and lenses, generate GST invoices, and track lab orders effortlessly.
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

      {/* ── RIGHT AUTH PANEL (All Screens) ────────────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 lg:h-full flex flex-col justify-between p-6 sm:p-10 lg:p-10 xl:p-14 bg-white overflow-y-auto overflow-x-hidden">
        {/* Mobile Header (visible only on <lg screens) */}
        <div className="lg:hidden flex items-center gap-2.5 pb-4 mb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Glasses className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block leading-tight">
              TechSentinals Optical Store
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Staff Sign In
            </span>
          </div>
        </div>

        {/* Main Sign-In Container — Balanced Proportions */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          <div className="mb-4 sm:mb-5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Sign In
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Select your role and enter your store credentials.
            </p>
          </div>

          {/* Contextual Inline Error Alert Banner (Zero Toasters) */}
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
            {/* 1. DISTINCT BOXY ROLE SELECTION CARDS (Clear Selection & Zero Jumps) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Select Your Role
              </label>

              {/* Featured Store Owner Card (Full Width) */}
              <button
                type="button"
                onClick={() => handleRoleSelect(OWNER_ROLE.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors duration-150 cursor-pointer select-none',
                  selectedRole === OWNER_ROLE.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/70 hover:border-slate-300'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150',
                    selectedRole === OWNER_ROLE.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-500'
                  )}
                >
                  <OWNER_ROLE.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-900 leading-tight block">
                    {OWNER_ROLE.label}
                  </span>
                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                    {OWNER_ROLE.description}
                  </span>
                </div>
              </button>

              {/* Symmetrical 2x2 Grid for Staff Roles */}
              <div className="grid grid-cols-2 gap-2">
                {STAFF_ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className={cn(
                        'flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-colors duration-150 cursor-pointer select-none min-h-[50px]',
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600/30'
                          : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/70 hover:border-slate-300'
                      )}
                    >
                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150',
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-500'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block truncate">
                          {role.label}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight block truncate mt-0.5">
                          {role.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Email Address Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
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
                  placeholder="name@opticalstore.com"
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

            {/* 3. Password Field with Visibility Toggle */}
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

            {/* 4. Action Button (Rock-Solid Fixed Label to Avoid Jumps) */}
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
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Help Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Forgot password? Contact store owner.</span>
            <Link
              to="/register"
              onClick={() => {
                sessionStorage.removeItem('admin_register_step');
              }}
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Register Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
