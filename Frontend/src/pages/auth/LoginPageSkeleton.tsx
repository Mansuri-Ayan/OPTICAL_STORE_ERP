import React from 'react';
import { Glasses, CheckCircle2 } from 'lucide-react';

const STORE_BENEFITS = [
  'Eye testing & prescriptions (OD/OS power, prism, PD)',
  'Fast billing with GST invoices and multiple payment modes',
  'Frame, lens, contact lens & sunglass stock with barcode labels',
  'Track optical lab jobs from fitting to customer delivery',
];

/**
 * 1:1 Pixel-Perfect Dedicated Skeleton for LoginPage
 * Matches LoginPage.tsx layout, geometry, responsive bounds, and spacing with zero pixel drift.
 */
export const LoginPageSkeleton: React.FC = () => {
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

        {/* Main Sign-In Container — Exact Proportions */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {/* Header Title Placeholder */}
          <div className="mb-4 sm:mb-5">
            <div className="h-8 w-28 bg-slate-200/90 rounded-lg animate-pulse mb-1.5" />
            <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
          </div>

          <div className="space-y-4">
            {/* 1. DISTINCT BOXY ROLE SELECTION CARDS SKELETON */}
            <div className="space-y-2">
              <div className="h-3.5 w-28 bg-slate-200/80 rounded animate-pulse mb-1" />

              {/* Featured Store Owner Card (Full Width) */}
              <div className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-200/90 shrink-0" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-56 bg-slate-100 rounded" />
                </div>
              </div>

              {/* Symmetrical 2x2 Grid for Staff Roles */}
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/50 min-h-[50px] animate-pulse"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-200/90 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="h-3.5 w-20 bg-slate-200 rounded" />
                      <div className="h-2.5 w-24 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Email Address Field Placeholder */}
            <div>
              <div className="h-3.5 w-24 bg-slate-200/80 rounded animate-pulse mb-1" />
              <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 pl-3 flex items-center animate-pulse">
                <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                <div className="h-3 w-40 bg-slate-100 rounded" />
              </div>
            </div>

            {/* 3. Password Field Placeholder */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="h-3.5 w-20 bg-slate-200/80 rounded animate-pulse" />
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

            {/* 4. Action Button Placeholder */}
            <div className="w-full h-11 rounded-xl bg-emerald-600/30 flex items-center justify-center gap-2 animate-pulse">
              <div className="h-4 w-16 bg-emerald-700/40 rounded" />
              <div className="w-4 h-4 rounded bg-emerald-700/40" />
            </div>
          </div>

          {/* Quick Help Footer Placeholder */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-emerald-500/25 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageSkeleton;
