import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * 1:1 Pixel-Perfect Dedicated Skeleton for SuperAdminLoginPage
 * Matches SuperAdminLoginPage.tsx executive layout, dimensions, shadows, and spacing with zero pixel drift.
 */
export const SuperAdminLoginPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Decorative Ambient Background Rings (Strictly Clipped Inside Viewport) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-emerald-500/10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full border border-slate-200" />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 my-auto">
        {/* Top Branding */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mb-2.5 shadow-md shadow-emerald-600/20 ring-1 ring-white/30">
            <ShieldCheck className="w-5 h-5 text-white/90" />
          </div>
          <div className="h-7 sm:h-8 w-48 bg-slate-200/90 rounded-lg animate-pulse mx-auto mb-1.5" />
          <div className="h-4 w-72 bg-slate-200/60 rounded animate-pulse mx-auto" />
        </div>

        {/* Executive White Card Shell */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-200/60">
          <div className="space-y-4">
            {/* Admin Email */}
            <div>
              <div className="h-3.5 w-36 bg-slate-200/80 rounded animate-pulse mb-1" />
              <div className="w-full h-10.5 rounded-xl border border-slate-200 bg-slate-50/50 pl-3 flex items-center animate-pulse">
                <div className="w-4 h-4 rounded bg-slate-200/90 mr-2.5 shrink-0" />
                <div className="h-3 w-48 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Password */}
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

            {/* Action Button */}
            <div className="w-full h-11 rounded-xl bg-emerald-600/30 flex items-center justify-center gap-2 animate-pulse">
              <div className="h-4 w-40 bg-emerald-700/40 rounded" />
              <div className="w-4 h-4 rounded bg-emerald-700/40" />
            </div>
          </div>

          {/* Footer Return Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-32 bg-slate-200/70 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPageSkeleton;
