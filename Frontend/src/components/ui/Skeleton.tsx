import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  staggerIndex?: number;
}

/**
 * Base rectangular block with diagonal wave shimmer and staggered progressive delays
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  staggerIndex = 0,
  style,
  ...props
}) => {
  return (
    <div
      style={{
        animationDelay: `${staggerIndex * 70}ms`,
        ...style,
      }}
      className={cn('shimmer-wave rounded-lg', className)}
      {...props}
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
  baseDelay?: number;
}

/**
 * Multi-line paragraph placeholder with progressive wave delays
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
  lineClassName,
  baseDelay = 0,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          staggerIndex={baseDelay + idx}
          className={cn(
            'h-3.5 w-full',
            idx === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full',
            lineClassName
          )}
        />
      ))}
    </div>
  );
};

export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
  staggerIndex?: number;
}

/**
 * Avatar / Icon placeholder with staggered shimmer
 */
export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  shape = 'circle',
  className,
  staggerIndex = 0,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      staggerIndex={staggerIndex}
      className={cn(
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-xl',
        className
      )}
    />
  );
};

/**
 * Granular Skeleton: Store Switcher in Sidebar/Navbar
 * Resolves only when useStores resolves!
 */
export const StoreSwitcherSkeleton: React.FC<{ isCollapsed?: boolean }> = ({ isCollapsed }) => {
  if (isCollapsed) {
    return <Skeleton className="w-10 h-10 rounded-xl" staggerIndex={0} />;
  }
  return (
    <div className="flex items-center gap-2.5 w-full p-1.5 rounded-xl border border-slate-100 bg-white">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" staggerIndex={0} />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Skeleton className="h-2.5 w-16 rounded" staggerIndex={1} />
        <Skeleton className="h-3.5 w-28 rounded" staggerIndex={2} />
      </div>
    </div>
  );
};

/**
 * Granular Skeleton: User Profile Footer in Sidebar
 * Resolves only when useCurrentUser resolves!
 */
export const UserProfileSkeleton: React.FC<{ isCollapsed?: boolean }> = ({ isCollapsed }) => {
  if (isCollapsed) {
    return <Skeleton className="w-8 h-8 rounded-full" staggerIndex={3} />;
  }
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" staggerIndex={2} />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Skeleton className="h-3 w-24 rounded" staggerIndex={3} />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-2.5 w-12 rounded" staggerIndex={4} />
          <Skeleton className="h-2 w-20 rounded" staggerIndex={5} />
        </div>
      </div>
    </div>
  );
};

/**
 * Granular Skeleton: Nav Group with staggered progressive delay
 */
export const NavItemsSkeleton: React.FC<{ count?: number; isCollapsed?: boolean }> = ({
  count = 6,
  isCollapsed,
}) => {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl',
            isCollapsed && 'justify-center !px-2'
          )}
        >
          <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" staggerIndex={i} />
          {!isCollapsed && <Skeleton className="h-3.5 flex-1 rounded" staggerIndex={i + 1} />}
        </div>
      ))}
    </div>
  );
};

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Full tabular skeleton placeholder with header row and staggered body cells
 */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 5,
  className,
}) => {
  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className="border-b border-slate-200 bg-slate-50/70 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} staggerIndex={i} className="h-4 w-3/4 rounded" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100 p-4 space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-4 pt-4 first:pt-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                staggerIndex={r * columns + c}
                className={cn('h-4 rounded', c === 0 ? 'w-4/5' : 'w-2/3')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Content-Area Skeleton for In-App Route Suspense (used inside AppShell Outlet)
 * Neutral and elegant - does NOT flash fake 4 metric cards on non-dashboard pages!
 */
export const AppContentSkeleton: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-52 rounded-lg" staggerIndex={0} />
          <Skeleton className="h-3.5 w-72 rounded-md" staggerIndex={1} />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl bg-emerald-500/15" staggerIndex={2} />
      </div>

      {/* Main Content Card Placeholder */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <Skeleton className="h-5 w-40 rounded-md" staggerIndex={3} />
        <Skeleton className="h-48 w-full rounded-xl" staggerIndex={4} />
      </div>
    </div>
  );
};

/**
 * Strict 1:1 Geometric Replica of Desktop Sidebar (Sidebar.tsx)
 * Ensures 0px Cumulative Layout Shift (CLS = 0)
 */
export const SidebarSkeleton: React.FC = () => {
  // Read saved width to match live Sidebar exactly
  const savedWidth = typeof window !== 'undefined'
    ? (() => {
        const saved = localStorage.getItem('admin-sidebar-width');
        return saved ? Math.max(220, Math.min(420, parseInt(saved, 10))) : 280;
      })()
    : 280;

  return (
    <aside
      aria-label="Desktop Sidebar Navigation Loading"
      style={{ width: savedWidth }}
      className="relative hidden lg:flex flex-col h-screen bg-white border-r border-slate-200/90 shadow-[4px_0_24px_rgba(0,0,0,0.02)] select-none flex-shrink-0 z-30"
    >
      {/* 1. Branch Header: matches h-16 px-3 border-b border-slate-100 */}
      <div className="h-16 px-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0 relative">
        <div className="flex items-center gap-2.5 w-full p-1.5 rounded-xl border border-slate-100 bg-white">
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" staggerIndex={0} />
          <div className="flex-1 space-y-1.5 min-w-0">
            <Skeleton className="h-2.5 w-20 rounded" staggerIndex={1} />
            <Skeleton className="h-3.5 w-28 rounded" staggerIndex={2} />
          </div>
        </div>
        <Skeleton className="w-7 h-7 rounded-lg ml-1 flex-shrink-0" staggerIndex={3} />
      </div>

      {/* 2. Action Button: matches px-3 pt-3 pb-2 */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <Skeleton className="h-10 w-full rounded-xl bg-emerald-500/15" staggerIndex={4} />
      </div>

      {/* 3. Navigation Rows: matches flex-1 overflow-y-auto py-3 px-3 space-y-1 */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
          >
            <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" staggerIndex={i + 5} />
            <Skeleton className="h-3.5 flex-1 rounded" staggerIndex={i + 6} />
          </div>
        ))}
      </div>

      {/* 4. Footer: matches p-3 border-t border-slate-100 bg-slate-50/60 */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" staggerIndex={15} />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3 w-24 rounded" staggerIndex={16} />
            <Skeleton className="h-2.5 w-16 rounded" staggerIndex={17} />
          </div>
          <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" staggerIndex={18} />
        </div>
      </div>
    </aside>
  );
};

/**
 * Strict 1:1 Geometric Replica of Mobile Top Navbar (Navbar.tsx)
 * Matches h-13 border-b px-3.5 flex items-center justify-between
 */
export const MobileTopNavSkeleton: React.FC = () => {
  return (
    <header className="lg:hidden sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-13 flex items-center justify-between px-3.5 shadow-2xs">
      <div className="flex items-center gap-2 min-w-0">
        <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" staggerIndex={0} />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24 rounded" staggerIndex={1} />
          <Skeleton className="h-2 w-16 rounded" staggerIndex={2} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" staggerIndex={3} />
        <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" staggerIndex={4} />
      </div>
    </header>
  );
};

/**
 * Strict 1:1 Geometric Replica of Mobile Bottom Navigation Bar (MobileBottomNav.tsx)
 * Matches fixed bottom-0 h-16 w-full flex items-center justify-around
 */
export const MobileBottomNavSkeleton: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around h-16 w-full max-w-lg mx-auto px-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-center py-1 gap-1">
            <Skeleton className="w-5 h-5 rounded-md" staggerIndex={i} />
            <Skeleton className="h-2 w-8 rounded" staggerIndex={i + 1} />
          </div>
        ))}
      </div>
    </nav>
  );
};

/**
 * App Shell Skeleton matching actual layout with 1:1 desktop & mobile parity
 * Prevents layout shift when auth session is bootstrapping!
 */
export const AppShellSkeleton: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-slate-50/80 text-slate-900 overflow-hidden animate-fade-in">
      {/* Desktop 1:1 Left Sidebar Replica */}
      <SidebarSkeleton />

      {/* Primary Layout Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile 1:1 Top Header Replica */}
        <MobileTopNavSkeleton />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto min-w-0 pb-20 lg:pb-6 custom-scrollbar">
          <AppContentSkeleton />
        </main>
      </div>

      {/* Mobile 1:1 Bottom Navigation Bar Replica */}
      <MobileBottomNavSkeleton />
    </div>
  );
};

/**
 * Auth Page Skeleton for Login / SuperAdmin / Register
 */
export const AuthPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center py-6 sm:py-8 px-4 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto relative z-10 my-auto">
        <div className="flex flex-col items-center mb-5">
          <Skeleton className="w-12 h-12 rounded-2xl mb-3" staggerIndex={0} />
          <Skeleton className="h-7 w-48 mb-2" staggerIndex={1} />
          <Skeleton className="h-4 w-64" staggerIndex={2} />
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" staggerIndex={3} />
            <Skeleton className="h-12 w-full rounded-xl" staggerIndex={4} />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28" staggerIndex={5} />
            <Skeleton className="h-10.5 w-full rounded-xl" staggerIndex={6} />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" staggerIndex={7} />
            <Skeleton className="h-10.5 w-full rounded-xl" staggerIndex={8} />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" staggerIndex={9} />
        </div>
      </div>
    </div>
  );
};

/**
 * App Layout Skeleton for route bootstrap
 */
export const AppPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
      <div className="h-16 w-full border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" staggerIndex={0} />
          <Skeleton className="h-5 w-32" staggerIndex={1} />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" staggerIndex={2} />
          <Skeleton className="w-8 h-8 rounded-full" staggerIndex={3} />
        </div>
      </div>
      <AppContentSkeleton />
    </div>
  );
};

export default Skeleton;
