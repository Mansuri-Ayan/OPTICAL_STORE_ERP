import React from 'react';
import { Store as StoreIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useStoreStore } from '@/store/store.store';
import { useStoreSelector } from '@/hooks/useStores';
import { useQueryClient } from '@tanstack/react-query';
import { StoreSelectorItem } from '@/types/store.types';

export const StoreSwitcher: React.FC = () => {
  const { storeId, setStoreId } = useAuthStore();
  const { selectedStore, setSelectedStore, setStores } = useStoreStore();
  const { data: storesResponse, isLoading } = useStoreSelector();
  const queryClient = useQueryClient();

  const storeList: (StoreSelectorItem | any)[] = Array.isArray(storesResponse)
    ? storesResponse
    : (storesResponse as { items?: any[] })?.items || [];

  React.useEffect(() => {
    if (storeList.length > 0) {
      setStores(storeList);
      const firstStore = storeList[0];
      if (!selectedStore && !storeId && firstStore) {
        setSelectedStore(firstStore);
        setStoreId(firstStore.id);
      }
    }
  }, [storeList, selectedStore, storeId, setStores, setSelectedStore, setStoreId]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStoreId = e.target.value;
    if (String(newStoreId) === String(selectedStore?.id || storeId)) {
      return;
    }
    const found = storeList.find((s) => String(s.id) === String(newStoreId)) || null;
    setSelectedStore(found);
    setStoreId(newStoreId);
    queryClient.invalidateQueries({
      predicate: (query) => {
        const topKey = query.queryKey[0];
        return topKey !== 'stores' && topKey !== 'auth';
      },
    });
  };

  if (isLoading || storeList.length === 0) {
    return null;
  }

  const currentVal = selectedStore?.id ? String(selectedStore.id) : (storeId ? String(storeId) : '');

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hidden sm:flex flex-shrink-0">
        <StoreIcon className="h-3.5 w-3.5" />
      </div>
      <div className="relative">
        <select
          value={currentVal}
          onChange={handleStoreChange}
          aria-label="Select active branch"
          className="block w-full max-w-[140px] sm:max-w-xs rounded-xl border border-slate-200 py-1.5 pl-3 pr-8 text-xs font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white cursor-pointer hover:border-slate-300 transition-colors"
        >
          <option value="" disabled hidden>Select Store</option>
          {storeList.map((store) => (
            <option key={store.id} value={String(store.id)}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StoreSwitcher;
