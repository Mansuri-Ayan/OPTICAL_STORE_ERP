import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  PlusCircle,
  GripVertical,
  ShieldCheck,
  Building,
  Globe,
  Lock,
  RotateCcw,
  Sliders,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useAuthStore } from '@/store/auth';
import { useStoreStore } from '@/store/store.store';
import { useStoreSelector } from '@/hooks/useStores';
import { useLogout } from '@/hooks/useAuth';
import { useSidebarCustomization } from '@/hooks/useSidebarCustomization';
import { StoreSwitcherSkeleton, UserProfileSkeleton } from '@/components/ui/Skeleton';
import NavIcon from './NavIcon';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { user, storeId, setStoreId } = useAuthStore();
  const { selectedStore, setSelectedStore, setStores } = useStoreStore();
  const { data: storesResponse, isLoading: isLoadingStores } = useStoreSelector();
  const isLoadingUser = !user;
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  // 1. Sidebar Customization via Cookie Hook
  const {
    visibleItems,
    reorderDragDrop,
    moveItem,
    resetToDefault,
  } = useSidebarCustomization();

  const [isEditMode, setIsEditMode] = useState(false);

  // Bulletproof Drag & Drop Reordering (Zero Native Drag, Zero Lockups, Instant Live Reorder)
  const dragStartRef = useRef<{ x: number; y: number; id: string } | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const wasDraggingRef = useRef<boolean>(false);
  const activeDragIdRef = useRef<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const updateActiveDragId = useCallback((id: string | null) => {
    activeDragIdRef.current = id;
    setActiveDragId(id);
    if (id) {
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, []);

  const cancelDrag = useCallback(() => {
    dragStartRef.current = null;
    isDraggingRef.current = false;
    updateActiveDragId(null);
  }, [updateActiveDragId]);

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Check distance threshold (6px) before activating drag mode
      if (!isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        if (Math.hypot(dx, dy) < 6) {
          return; // Still within click/double-click tolerance
        }
        isDraggingRef.current = true;
        updateActiveDragId(dragStartRef.current.id);
      }

      // Find element directly under pointer
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const row = el?.closest('[data-nav-id]');
      if (!row) return;

      const targetId = row.getAttribute('data-nav-id');
      const currentDraggedId = activeDragIdRef.current;

      // Live reorder when moving over a different nav row
      if (targetId && currentDraggedId && targetId !== currentDraggedId) {
        reorderDragDrop(currentDraggedId, targetId);
      }
    },
    [reorderDragDrop, updateActiveDragId]
  );

  const handleWindowMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      wasDraggingRef.current = true;
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 150);
    }

    dragStartRef.current = null;
    isDraggingRef.current = false;
    updateActiveDragId(null);
  }, [updateActiveDragId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelDrag();
    };
    const handleBlur = () => {
      cancelDrag();
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [handleWindowMouseMove, handleWindowMouseUp, cancelDrag]);

  // 2. Width Resizability with Window Event Listeners (Zero Lockup)
  const [width, setWidth] = useState<number>(() => {
    const saved = localStorage.getItem('admin-sidebar-width');
    return saved ? Math.max(220, Math.min(420, parseInt(saved, 10))) : 280;
  });
  const [isResizing, setIsResizing] = useState(false);

  const handleResizerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(220, Math.min(420, e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      localStorage.setItem('admin-sidebar-width', String(width));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, width]);

  // 3. Modern Branch Card Switcher Popover
  const [isBranchCardOpen, setIsBranchCardOpen] = useState(false);
  const branchPopoverRef = useRef<HTMLDivElement>(null);

  const storeList = Array.isArray(storesResponse)
    ? storesResponse
    : (storesResponse as { items?: any[] })?.items || [];

  useEffect(() => {
    if (storeList.length > 0) {
      setStores(storeList);
      if (!selectedStore && !storeId) {
        setSelectedStore(storeList[0]);
        setStoreId(storeList[0].id);
      }
    }
  }, [storeList, selectedStore, storeId, setStores, setSelectedStore, setStoreId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchPopoverRef.current && !branchPopoverRef.current.contains(e.target as Node)) {
        setIsBranchCardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStoreSelect = (store: any) => {
    setIsBranchCardOpen(false);
    if (String(store.id) === String(selectedStore?.id || storeId)) {
      return;
    }
    setSelectedStore(store);
    setStoreId(store.id);
    queryClient.invalidateQueries({
      predicate: (query) => {
        const topKey = query.queryKey[0];
        return topKey !== 'stores' && topKey !== 'auth';
      },
    });
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const currentStoreName =
    selectedStore?.name || (selectedStore as any)?.store_name || storeList[0]?.name || 'Main Branch';

  const currentStoreCity =
    selectedStore?.city || (selectedStore as any)?.city || 'Store Location';

  return (
    <>
      {/* Resize Overlay active ONLY while resizing */}
      {isResizing && (
        <div
          className="fixed inset-0 z-[9999] cursor-col-resize select-none"
          style={{ userSelect: 'none' }}
        />
      )}

      <aside
        aria-label="Desktop Sidebar Navigation"
        onDragStart={(e) => {
          e.preventDefault();
          return false;
        }}
        style={{ width: sidebarCollapsed ? 80 : width }}
        className={cn(
          'relative hidden lg:flex flex-col h-screen bg-white border-r border-slate-200/90 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 z-30 transition-[width] duration-150 ease-out select-none'
        )}
      >
        {/* 1. MODERN EXECUTIVE BRANCH SWITCHER HEADER */}
        <div className="h-16 px-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0 relative">
          {isLoadingStores ? (
            <StoreSwitcherSkeleton isCollapsed={sidebarCollapsed} />
          ) : !sidebarCollapsed ? (
            <div className="relative flex-1 min-w-0" ref={branchPopoverRef}>
              {/* Modern Branch Card Trigger */}
              <button
                type="button"
                onClick={() => setIsBranchCardOpen(!isBranchCardOpen)}
                className="flex items-center gap-2.5 w-full text-left p-1.5 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer group"
                title="Click to switch store branch"
              >
                {/* Branch Monogram Badge */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs flex-shrink-0 tracking-tight">
                  {getInitials(currentStoreName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-black text-emerald-700 uppercase tracking-wider leading-none truncate">
                      {currentStoreCity || 'Store Branch'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="font-extrabold text-xs text-slate-900 truncate">
                      {currentStoreName}
                    </span>
                    <ChevronRight
                      className={cn(
                        'w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform flex-shrink-0',
                        isBranchCardOpen && 'translate-x-0.5 text-emerald-600'
                      )}
                    />
                  </div>
                </div>
              </button>

              {/* Windows-Style Right-Cascading Flyout Submenu */}
              {isBranchCardOpen && (
                <div className="absolute left-[calc(100%+10px)] top-0 w-80 bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in p-2.5 space-y-1.5 max-h-[85vh] overflow-y-auto custom-scrollbar">
                  <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    <span>Store Branches</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{storeList.length} Total</span>
                  </div>

                  {storeList.map((st: any) => {
                    const isSelected = String(st.id) === String(selectedStore?.id || storeId);
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStoreSelect(st)}
                        className={cn(
                          'w-full text-left p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer',
                          isSelected
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-2xs'
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 text-slate-800'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0',
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {getInitials(st.name || st.store_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">
                            {st.name || st.store_name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {st.city || 'Store Branch'}
                          </p>
                        </div>
                      </div>

                      {isSelected ? null : (
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-600 flex-shrink-0">
                          Switch
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div
            className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs cursor-pointer"
            onClick={toggleSidebarCollapsed}
            title={`${currentStoreName} (Click to expand)`}
          >
            {getInitials(currentStoreName)}
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          className={cn(
            'p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none flex-shrink-0 cursor-pointer',
            sidebarCollapsed ? 'hidden' : 'ml-1'
          )}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. PRIMARY ACTION BUTTON: "+ NEW BILL / SALE (POS)" */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate('/pos')}
          className={cn(
            'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-sm shadow-emerald-600/20 transition-all duration-150 active:scale-[0.98] focus:outline-none cursor-pointer',
            sidebarCollapsed ? 'h-10 px-0' : 'py-2.5 px-3 text-xs'
          )}
          title="Create New Optical POS Bill / Sale"
        >
          <PlusCircle className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && <span className="tracking-wide">New Bill / Sale (POS)</span>}
        </button>
      </div>

      {/* 3. SUPERADMIN PLATFORM SHORTCUTS (IF SUPERADMIN) */}
      {isSuperAdmin && (
        <div className="px-3 pt-1 space-y-0.5 flex-shrink-0 border-b border-slate-100 pb-2 select-none">
          {[
            { name: 'SuperAdmin Console', href: '/superadmin/dashboard', icon: ShieldCheck, color: 'text-emerald-600' },
            { name: 'Store Admins', href: '/superadmin/admins', icon: Building, color: 'text-blue-600' },
            { name: 'All Network Stores', href: '/superadmin/stores', icon: Globe, color: 'text-indigo-600' },
            { name: 'Master Permissions', href: '/superadmin/permissions', icon: Lock, color: 'text-slate-700' },
          ].map((adm) => {
            const isActive = location.pathname.startsWith(adm.href);
            return (
              <NavLink
                key={adm.name}
                to={adm.href}
                draggable={false}
                onDragStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                title={sidebarCollapsed ? adm.name : undefined}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 select-none cursor-pointer',
                  isActive
                    ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  sidebarCollapsed && 'justify-center !px-2'
                )}
              >
                <adm.icon className={cn('w-4 h-4 flex-shrink-0 pointer-events-none', isActive ? 'text-emerald-700 stroke-[2.3]' : adm.color)} />
                {!sidebarCollapsed && <span className="flex-1 truncate pointer-events-none">{adm.name}</span>}
              </NavLink>
            );
          })}
        </div>
      )}

      {/* 4. UNIFIED CONTINUOUS NAVIGATION LIST (NO CATEGORY HEADERS) */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar select-none">
        {visibleItems.map((item, index) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

          const isCurrentlyDragging = activeDragId === item.id;

          return (
            <div
              key={item.id}
              data-nav-id={item.id}
              onMouseDown={(e) => {
                if (sidebarCollapsed || e.button !== 0) return;
                if ((e.target as HTMLElement).closest('button')) return;
                dragStartRef.current = { x: e.clientX, y: e.clientY, id: item.id };
                isDraggingRef.current = false;
              }}
              className={cn(
                'group/item relative transition-all duration-150 rounded-xl select-none',
                isCurrentlyDragging
                  ? 'bg-emerald-50 shadow-md ring-2 ring-emerald-500 scale-[1.01] z-20 opacity-95'
                  : 'hover:bg-slate-50/80'
              )}
            >
              <div className="flex items-center w-full">
                {/* Grip Handle: Visual indicator and drag grip */}
                {!sidebarCollapsed && (
                  <div
                    className={cn(
                      'p-1.5 -mr-1 text-slate-400 group-hover/item:text-slate-700 transition-opacity flex-shrink-0 select-none pointer-events-none',
                      isCurrentlyDragging || isEditMode
                        ? 'opacity-100 text-slate-500'
                        : 'opacity-0 group-hover/item:opacity-60'
                    )}
                    aria-hidden="true"
                  >
                    <GripVertical className="w-3.5 h-3.5 pointer-events-none" />
                  </div>
                )}

                {/* NavLink: Native anchor with click protection */}
                <NavLink
                  to={item.href}
                  draggable={false}
                  onDragStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }}
                  onClick={(e) => {
                    if (isEditMode || wasDraggingRef.current || isDraggingRef.current) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                  }}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex-1 min-w-0 cursor-pointer select-none',
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900',
                    sidebarCollapsed && 'justify-center !px-2'
                  )}
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 pointer-events-none',
                      isActive ? 'bg-emerald-600 text-white' : cn(item.iconBg, item.iconColor)
                    )}
                  >
                    <NavIcon name={item.iconName} className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>

                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate tracking-tight pointer-events-none">{item.name}</span>
                  )}

                  {/* Up / Down Move Buttons (Appear when Configure Bar is clicked) */}
                  {isEditMode && !sidebarCollapsed && (
                    <div
                      className="flex items-center gap-0.5 ml-auto pl-1 flex-shrink-0 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          moveItem(item.id, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Move up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          moveItem(item.id, 'down');
                        }}
                        disabled={index === visibleItems.length - 1}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Move down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </NavLink>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. FOOTER: RESET + USER PROFILE & LOGOUT */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-2 flex-shrink-0">
        {/* Configure Bar & Reset Shortcut */}
        {!sidebarCollapsed && (
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer',
                isEditMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'text-slate-500 hover:text-emerald-700 border-transparent hover:border-slate-200'
              )}
              title="Configure which tabs appear on your bar"
            >
              <Sliders className="w-3 h-3" />
              <span>{isEditMode ? 'Done' : 'Configure Bar'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditMode(false);
                resetToDefault();
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              title="Reset sidebar order to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Order</span>
            </button>
          </div>
        )}

        {/* User Profile Card */}
        {isLoadingUser ? (
          <UserProfileSkeleton isCollapsed={sidebarCollapsed} />
        ) : (
          <div
            className={cn(
              'flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs',
              sidebarCollapsed ? 'justify-center !p-1.5' : ''
            )}
            title={sidebarCollapsed ? `${user?.full_name || user?.name} (${user?.role})` : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              {getInitials(user?.full_name || user?.name)}
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.full_name || user?.name || 'Staff User'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/60">
                    {user?.role || 'Admin'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {user?.email || ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sign Out Action */}
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 transition-colors focus:outline-none disabled:opacity-50 cursor-pointer',
            sidebarCollapsed ? 'justify-center !px-2' : ''
          )}
          title={sidebarCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="truncate">
              {logoutMutation.isPending ? 'Signing Out...' : 'Sign Out'}
            </span>
          )}
        </button>
      </div>

      {/* 6. DRAGGABLE RESIZER HANDLE - ZERO LOCKUP */}
      {!sidebarCollapsed && (
        <div
          onMouseDown={handleResizerMouseDown}
          className={cn(
            'absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-emerald-500/40 transition-colors z-50 select-none',
            isResizing && 'bg-emerald-500/80 w-2.5'
          )}
          title="Drag to resize sidebar width"
        />
      )}
    </aside>
  </>
  );
};

export default Sidebar;
