import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Search,
  Sliders,
  Check,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useLogout } from '@/hooks/useAuth';
import { useSidebarCustomization } from '@/hooks/useSidebarCustomization';
import NavIcon from './NavIcon';
import { cn } from '@/utils/cn';

// Clean, short labels for mobile bottom bar that never truncate
const getTabLabel = (id: string, name: string): string => {
  const labelMap: Record<string, string> = {
    dashboard: 'Home',
    pos: 'Billing',
    sales: 'Sales',
    inventory: 'Stock',
    customers: 'Clients',
    products: 'Catalog',
    expenses: 'Expenses',
    reports: 'Reports',
    repairs: 'Repairs',
    labs: 'Labs',
  };
  return labelMap[id] || name.split(' ')[0] || id;
};

export const MobileBottomNav: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  // Read customizable navigation and user-chosen bottom bar tabs from cookie hook
  const {
    visibleItems,
    bottomBarItems,
    toggleBottomBar,
  } = useSidebarCustomization();

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
        setIsEditMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // SuperAdmin governance items appended if superadmin
  const fullDrawerList = useMemo(() => {
    const list = [...visibleItems];
    if (isSuperAdmin) {
      list.unshift(
        {
          id: 'sa-console',
          name: 'SuperAdmin Console',
          href: '/superadmin/dashboard',
          iconName: 'ShieldCheck',
          iconColor: 'text-emerald-600',
          iconBg: 'bg-emerald-50',
          category: 'Platform Governance',
          isVisible: true,
          isBottomBar: false,
          order: -4,
        },
        {
          id: 'sa-admins',
          name: 'Store Admins',
          href: '/superadmin/admins',
          iconName: 'Building',
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-50',
          category: 'Platform Governance',
          isVisible: true,
          isBottomBar: false,
          order: -3,
        },
        {
          id: 'sa-stores',
          name: 'All Network Stores',
          href: '/superadmin/stores',
          iconName: 'Globe',
          iconColor: 'text-indigo-600',
          iconBg: 'bg-indigo-50',
          category: 'Platform Governance',
          isVisible: true,
          isBottomBar: false,
          order: -2,
        },
        {
          id: 'sa-permissions',
          name: 'Master Permissions',
          href: '/superadmin/permissions',
          iconName: 'Lock',
          iconColor: 'text-slate-700',
          iconBg: 'bg-slate-100',
          category: 'Platform Governance',
          isVisible: true,
          isBottomBar: false,
          order: -1,
        }
      );
    }
    return list;
  }, [visibleItems, isSuperAdmin]);

  // Filter sections when user searches in the drawer
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return fullDrawerList;
    const q = searchQuery.toLowerCase();
    return fullDrawerList.filter((item) => item.name.toLowerCase().includes(q));
  }, [fullDrawerList, searchQuery]);

  const handleTabClick = (href: string) => {
    setIsDrawerOpen(false);
    navigate(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* 1. PERSISTENT MOBILE BOTTOM BAR (SYMMETRICALLY CENTERED FLEX DISTRIBUTION) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-center justify-around h-16 w-full max-w-lg mx-auto px-2">
          {/* User's Customizable Tabs (flex-1 ensures equal spacing and perfect centering) */}
          {bottomBarItems.map((tab) => {
            const isActive =
              location.pathname === tab.href ||
              (tab.href !== '/dashboard' && location.pathname.startsWith(tab.href));

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.href)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-1 gap-1 transition-all duration-150 focus:outline-none cursor-pointer relative min-w-0',
                  isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {isActive && (
                  <span className="absolute top-0 inset-x-3 h-0.5 bg-emerald-600 rounded-full" />
                )}
                <div className={cn('transition-transform', isActive ? 'scale-110 text-emerald-600' : 'text-slate-500')}>
                  <NavIcon name={tab.iconName} className="h-5 w-5 stroke-[2]" />
                </div>
                <span className="text-[10px] tracking-wide leading-none text-center truncate max-w-full px-1">
                  {getTabLabel(tab.id, tab.name)}
                </span>
              </button>
            );
          })}

          {/* Menu Drawer Tab: Always pinned at the right with equal flex-1 width */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 gap-1 transition-all duration-150 focus:outline-none cursor-pointer relative min-w-0',
              isDrawerOpen ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            )}
            aria-expanded={isDrawerOpen}
            aria-label="Open all sections menu"
          >
            {isDrawerOpen && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-emerald-600 rounded-full" />
            )}
            <Menu className="h-5 w-5 stroke-[1.8]" />
            <span className="text-[10px] tracking-wide leading-none">Menu</span>
          </button>
        </div>
      </nav>

      {/* 2. "ALL SECTIONS" SLIDE-UP DRAWER */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Dimmed Blur Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 animate-fade-in"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-Up White Container */}
          <div
            className="relative z-10 w-full bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Top Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header: "ALL SECTIONS" + Inline Customizer Toggle + Dismiss (X) */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2
                  id="drawer-title"
                  className="text-xs font-black tracking-widest text-slate-900 uppercase"
                >
                  All Sections
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer',
                    isEditMode
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'text-slate-500 hover:text-emerald-700 border-transparent hover:border-slate-200'
                  )}
                  title="Configure which tabs appear on your mobile bottom bar"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{isEditMode ? 'Done' : 'Configure Bar'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsEditMode(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                aria-label="Close all sections menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* In-Place Bottom Bar Edit Banner */}
            {isEditMode && (
              <div className="mx-5 my-2 p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-950 animate-fade-in flex-shrink-0">
                <div className="flex flex-col">
                  <span className="font-bold">Pick your bottom bar tabs</span>
                  <span className="text-[10px] text-emerald-800">
                    Currently selected: {bottomBarItems.length}/4
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

            {/* Quick Search Filter */}
            {!isEditMode && (
              <div className="px-5 pt-3 pb-1">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search section (e.g. Bill, Stock, Lab)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Continuous Unified Section List (Zero Category Headers) */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
              {filteredSections.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                const isPinned = item.isBottomBar;

                if (isEditMode) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBottomBar(item.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer',
                        isPinned
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs',
                            item.iconBg,
                            item.iconColor
                          )}
                        >
                          <NavIcon name={item.iconName} className="h-4 w-4 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-bold truncate">{item.name}</span>
                      </div>

                      <div
                        className={cn(
                          'px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1',
                          isPinned
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {isPinned && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{isPinned ? 'PINNED' : 'PIN TO BAR'}</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-150',
                      isActive
                        ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                        : 'text-slate-800 hover:bg-slate-50 active:bg-slate-100'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs',
                          item.iconBg,
                          item.iconColor
                        )}
                      >
                        <NavIcon name={item.iconName} className="h-4 w-4 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-bold truncate">{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* Drawer Footer: User Profile & Logout */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    {getInitials(user?.full_name || user?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.full_name || user?.name || 'Staff User'}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider truncate">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    logoutMutation.mutate();
                  }}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors focus:outline-none flex-shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{logoutMutation.isPending ? '...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;
