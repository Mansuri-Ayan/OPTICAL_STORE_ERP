import React from 'react';
import { cn } from '@/utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'optical' | 'button' | 'ring' | 'light';
  className?: string;
  label?: string;
}

/**
 * High-End Kinetic Optical Aperture Loader
 * Incorporates dual-ring concentric motion, lens core pulse, and responsive button micro-variants.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'optical',
  className,
  label,
  ...props
}) => {
  // If size is xs or sm, or variant is explicitly button/light, render the high-velocity micro kinetic aperture
  if (size === 'xs' || size === 'sm' || variant === 'button' || variant === 'light') {
    const microSizes = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    };

    const isLight = variant === 'button' || variant === 'light';

    return (
      <div
        className={cn('inline-flex items-center justify-center relative select-none', microSizes[size], className)}
        role="status"
        aria-label={label || 'Loading'}
        {...props}
      >
        <svg
          className="w-full h-full animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track Ring */}
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.5"
            className={isLight ? 'text-white/20' : 'text-emerald-500/15'}
          />
          {/* High-Velocity Kinetic Arc */}
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="32 60"
            className={isLight ? 'text-white' : 'text-emerald-600'}
          />
          {/* Inner Optical Highlight Core */}
          <circle
            cx="12"
            cy="12"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="14 30"
            className={isLight ? 'text-white/70' : 'text-teal-400'}
          />
        </svg>
      </div>
    );
  }

  // Full-Scale Kinetic Optical Aperture (for Panels, Cards, Data Fetches)
  const wrapperSizes = {
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const id = React.useId();
  const gradOuter = `aperture-grad-outer-${id}`;
  const gradInner = `aperture-grad-inner-${id}`;

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center gap-3 select-none', className)}
      role="status"
      aria-label={label || 'Loading'}
      {...props}
    >
      <div className={cn('relative flex items-center justify-center', wrapperSizes[size as 'md' | 'lg' | 'xl'] || 'w-12 h-12')}>
        {/* Soft Radial Optical Flare */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-md pointer-events-none" />

        {/* Outer Revolving Optical Aperture Chassis */}
        <svg
          className="w-full h-full animate-spin"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradOuter} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Track Ring */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#e2e8f0"
            strokeWidth="2.5"
            opacity="0.6"
          />
          {/* Main Revolving Arc with Taper */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={`url(#${gradOuter})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="68 60"
          />
        </svg>

        {/* Inner Counter-Revolving Optical Lens Diaphragm */}
        <div className="absolute inset-2 flex items-center justify-center">
          <svg
            className="w-full h-full animate-spin-reverse"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={gradInner} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke={`url(#${gradInner})`}
              strokeWidth="2"
              strokeDasharray="28 20"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Center Optical Lens Focus Core (Pulsing) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50 animate-optical-pulse" />
        </div>
      </div>

      {/* Optional Descriptive Label */}
      {label && (
        <span className="text-xs font-semibold text-slate-500 tracking-wide animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};
