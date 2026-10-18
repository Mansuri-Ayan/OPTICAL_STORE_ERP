import React from 'react';
import { Glasses } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { MobileStoreSelector } from './MobileStoreSelector';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();

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
    <header className="lg:hidden sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-13 flex items-center justify-between px-3.5 shadow-2xs">
      {/* Brand Identity on Mobile */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <Glasses className="h-4.5 w-4.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-black text-xs tracking-tight text-slate-900 leading-none truncate">
            TechSentinals
          </span>
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider leading-tight mt-0.5 truncate">
            Optical Store
          </span>
        </div>
      </div>

      {/* Mobile Store Switcher & User Avatar */}
      <div className="flex items-center gap-2 min-w-0">
        <MobileStoreSelector />
        <div
          className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs flex-shrink-0"
          title={user?.email || 'Logged in'}
        >
          {getInitials(user?.full_name || user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
