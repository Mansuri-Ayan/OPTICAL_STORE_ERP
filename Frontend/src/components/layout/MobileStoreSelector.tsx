import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useStoreStore } from '@/store/store.store';
import { useStoreSelector } from '@/hooks/useStores';
import { useQueryClient } from '@tanstack/react-query';
import { StoreSelectorItem } from '@/types/store.types';
import { cn } from '@/utils/cn';

export const MobileStoreSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { storeId, setStoreId } = useAuthStore();
  const { selectedStore, setSelectedStore, setStores } = useStoreStore();
  const { data: storesResponse, isLoading } = useStoreSelector();
  const queryClient = useQueryClient();

  const storeList: StoreSelectorItem[] = Array.isArray(storesResponse)
    ? storesResponse
    : storesResponse?.items || [];

  // Sync stores with store store on load
  useEffect(() => {
    if (storeList.length > 0) {
      setStores(storeList);
      const firstStore = storeList[0];
      if (!selectedStore && !storeId && firstStore) {
        setSelectedStore(firstStore);
        setStoreId(firstStore.id);
      }
    }
  }, [storeList, selectedStore, storeId, setStores, setSelectedStore, setStoreId]);

  // Click outside listener (no backdrop, lightweight floating menu)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSelect = (store: StoreSelectorItem) => {
    setIsOpen(false);
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

  if (isLoading || storeList.length === 0) {
    return (
      <div className="h-7 w-24 bg-slate-100 rounded-full animate-pulse" />
    );
  }

  const currentStore =
    storeList.find((s) => String(s.id) === String(selectedStore?.id || storeId)) ||
    storeList[0];

  const currentStoreName = currentStore?.name || currentStore?.store_name || 'Store';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. Executive Terminal Badge in Navbar (Replaces stadium pill) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={`Active store: ${currentStoreName}. Tap to switch`}
        className={cn(
          'flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none max-w-[170px] sm:max-w-[210px] active:scale-95',
          isOpen
            ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/10 shadow-xs'
            : 'bg-white/95 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
        )}
      >
        {/* Monogram Badge */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 tracking-tight shadow-xs">
          {getInitials(currentStoreName)}
        </div>

        {/* 2-line Store Info */}
        <div className="flex flex-col min-w-0 text-left leading-none">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 truncate leading-none">
              {currentStore?.city || 'Store'}
            </span>
          </div>
          <span className="font-extrabold text-[11px] text-slate-900 truncate leading-tight mt-0.5">
            {currentStoreName}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ml-0.5',
            isOpen && 'rotate-180 text-emerald-600'
          )}
        />
      </button>

      {/* 2. Compact Anchored Floating Dropdown (No popup, no backdrop) */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-fade-in space-y-1">
          {/* Header */}
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            <span>Store Branches</span>
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              {storeList.length} Total
            </span>
          </div>

          {/* Store Rows */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
            {storeList.map((st) => {
              const isSelected = String(st.id) === String(currentStore?.id);
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSelect(st)}
                  className={cn(
                    'w-full text-left p-2 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer select-none',
                    isSelected
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-2xs'
                      : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
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
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                        <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate">{st.city || 'Store'}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected ? null : (
                    <span className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 flex-shrink-0">
                      Switch
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileStoreSelector;
