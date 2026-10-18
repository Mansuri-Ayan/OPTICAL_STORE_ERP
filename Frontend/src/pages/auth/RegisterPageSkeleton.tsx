import React from 'react';
import { Glasses, CheckCircle2, Check } from 'lucide-react';

const STORE_BENEFITS = [
  'Instant POS Billing: multi-mode payments & GST compliant invoicing',
  'Multi-Store Ready: manage single or multi-branch optical chains',
  'Integrated Optical Lab: track lens edging & fitting job orders',
  'Automated Barcodes: 50x25mm labels, serial units & deadstock alerts',
];

/**
 * 1:1 Pixel-Perfect Dedicated Skeleton for RegisterPage
 * Matches RegisterPage.tsx layout, geometry, responsive bounds, and spacing with zero pixel drift.
 */
export const RegisterPageSkeleton: React.FC = () => {
  // Check if user has an active OTP verification session in sessionStorage
  const isOtpStep = (() => {
    try {
      const savedStep = sessionStorage.getItem('admin_register_step');
      const saved = sessionStorage.getItem('admin_register_formData');
      if (savedStep === '2' && saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) return true;
      }
    } catch {}
    return false;
  })();

  return (
    <div className="min-h-screen lg:h-screen w-full flex bg-slate-900 overflow-x-hidden select-none">
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
              <Glasses className="w-5 h-5 text-white/90" />
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
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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

      {/* ── RIGHT AUTH PANEL (All Screens) ────────────────────────────── */}
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

        {/* Main Sign-In Container — Exact Proportions (540px/560px Height Budget) */}
        <div className="w-full max-w-md mx-auto my-0 pt-2 sm:pt-4 pb-6 flex flex-col justify-between min-h-[540px] sm:min-h-[560px]">
          {isOtpStep ? (
            /* ══════════════════════════════════════════════════════════════
               STEP 2 SKELETON: EMAIL OTP VERIFICATION
               ══════════════════════════════════════════════════════════════ */
            <>
              {/* Step Progress Bar Skeleton — Step 2 Active */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 shrink-0">
                {/* Step 1 Pill Skeleton (Completed) */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Account Details</span>
                </div>

                {/* Connecting Track (Filled) */}
                <div className="h-1 flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full mx-3" />

                {/* Step 2 Pill Skeleton (Active) */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs ring-2 ring-emerald-500/20">
                    2
                  </div>
                  <span className="text-xs font-bold text-slate-900">Email OTP</span>
                </div>
              </div>

              {/* Step 2 Body Skeleton */}
              <div className="flex-1 flex flex-col justify-between text-center py-1">
                <div>
                  {/* Shield Badge Shimmer */}
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 mx-auto mb-3 animate-pulse" />
                  {/* Title & Subtitle Shimmer */}
                  <div className="h-7 w-48 bg-slate-200/90 rounded-lg mx-auto mb-2 animate-pulse" />
                  <div className="h-4 w-64 bg-slate-100 rounded mx-auto animate-pulse" />

                  {/* Middle: Expiry timer & 6 OTP Box Skeletons */}
                  <div className="my-6">
                    <div className="flex justify-between items-center max-w-xs mx-auto mb-2.5">
                      <div className="h-3 w-28 bg-slate-200/70 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-slate-200/70 rounded animate-pulse" />
                    </div>
                    <div className="flex justify-center gap-2 sm:gap-2.5">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className="w-11 h-12 sm:w-12 sm:h-13 rounded-xl border border-slate-200 bg-slate-50/70 animate-pulse"
                        />
                      ))}
                    </div>
                    <div className="h-2.5 w-52 bg-slate-100 rounded mx-auto mt-3 animate-pulse" />
                  </div>
                </div>

                {/* Bottom: Action Button & Footer Skeleton */}
                <div className="mt-auto pt-6 pb-2">
                  <div className="w-full h-11 rounded-xl bg-emerald-600/30 flex items-center justify-center gap-2 animate-pulse mt-1">
                    <div className="h-4 w-40 bg-emerald-700/40 rounded" />
                  </div>

                  <div className="mt-5 pt-4 pb-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ══════════════════════════════════════════════════════════════
               STEP 1 SKELETON: STORE & OWNER DETAILS FORM
               ══════════════════════════════════════════════════════════════ */
            <>
              {/* Step Progress Bar Skeleton — Step 1 Active */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 shrink-0">
                {/* Step 1 Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600/40 animate-pulse flex items-center justify-center text-xs font-bold text-white">
                    1
                  </div>
                  <div className="h-3 w-24 bg-slate-200/80 rounded animate-pulse" />
                </div>

                {/* Connecting Track Skeleton */}
                <div className="h-1 flex-1 bg-slate-100 rounded-full mx-3" />

                {/* Step 2 Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 animate-pulse flex items-center justify-center text-xs font-bold text-slate-400">
                    2
                  </div>
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Header Title Placeholder */}
                  <div className="mb-4 sm:mb-5">
                    <div className="h-8 w-44 bg-slate-200/90 rounded-lg animate-pulse mb-1.5" />
                    <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
                  </div>

                  <div className="space-y-3.5 sm:space-y-4">
                    {/* 1. Full Name Field */}
                    <div>
                      <div className="h-3 w-28 bg-slate-200/80 rounded animate-pulse mb-1" />
                      <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 pl-3 flex items-center animate-pulse">
                        <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                        <div className="h-3 w-36 bg-slate-100 rounded" />
                      </div>
                    </div>

                    {/* 2. Email Field */}
                    <div>
                      <div className="h-3 w-24 bg-slate-200/80 rounded animate-pulse mb-1" />
                      <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 pl-3 flex items-center animate-pulse">
                        <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                        <div className="h-3 w-44 bg-slate-100 rounded" />
                      </div>
                    </div>

                    {/* 4. Phone Field */}
                    <div>
                      <div className="h-3 w-28 bg-slate-200/80 rounded animate-pulse mb-1" />
                      <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 pl-3 flex items-center animate-pulse">
                        <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                        <div className="h-3 w-32 bg-slate-100 rounded" />
                      </div>
                    </div>

                    {/* 5. Password Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="h-3 w-20 bg-slate-200/80 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                      </div>
                      <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 flex items-center justify-between animate-pulse">
                        <div className="flex items-center flex-1">
                          <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                          <div className="h-2.5 w-28 bg-slate-100 rounded" />
                        </div>
                        <div className="w-4 h-4 rounded bg-slate-200/90 shrink-0" />
                      </div>
                    </div>

                    {/* 6. Confirm Password Field */}
                    <div>
                      <div className="h-3 w-28 bg-slate-200/80 rounded animate-pulse mb-1" />
                      <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 flex items-center justify-between animate-pulse">
                        <div className="flex items-center flex-1">
                          <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                          <div className="h-2.5 w-28 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button & Footer Placeholder */}
                <div className="mt-auto pt-6 pb-2">
                  <div className="w-full h-11 rounded-xl bg-emerald-600/30 flex items-center justify-center gap-2 animate-pulse mt-1">
                    <div className="h-4 w-44 bg-emerald-700/40 rounded" />
                    <div className="w-4 h-4 rounded bg-emerald-700/40" />
                  </div>

                  <div className="mt-5 pt-4 pb-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-emerald-500/25 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPageSkeleton;
