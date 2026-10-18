import React, { useState } from 'react';
import {
  Store,
  Search,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { Badge } from '@/components/ui/Badge';
import { Store as StoreType } from '@/types/store.types';

export const SuperAdminStoresPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: storesData, isLoading } = useStores({ limit: 100 });

  const stores: StoreType[] = Array.isArray(storesData)
    ? storesData
    : (storesData as { items?: StoreType[] })?.items || [];

  const filteredStores = stores.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-7 h-7 text-indigo-600" />
            Global Store Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Global inventory of retail branches, eye testing clinic locations, and GSTIN registrations
          </p>
        </div>

        <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700">
          {stores.length} Retail Outlets Registered
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by store branch, city, or GSTIN..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Loading global stores registry...
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No stores match the search query.
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{store.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400">ID: #{store.id}</span>
                  </div>
                </div>
                <Badge variant={store.is_active ? 'success' : 'neutral'}>
                  {store.is_active ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{store.address || 'Address not configured'}, {store.city || ''}</span>
                </div>
                {store.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono text-[11px]">{store.email}</span>
                  </div>
                )}
              </div>

              {store.gstin && (
                <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500 uppercase">GSTIN:</span>
                  <span className="font-mono font-bold text-indigo-600">{store.gstin}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuperAdminStoresPage;
