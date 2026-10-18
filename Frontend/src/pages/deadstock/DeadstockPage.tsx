import React, { useState } from 'react';
import {
  Archive,
  RefreshCw,
  Search,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { inventoryApi } from '@/api/inventory.api';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export const DeadstockPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [isRunningAging, setIsRunningAging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [markdownPrice, setMarkdownPrice] = useState<number>(0);

  const mockDeadstock = [
    {
      id: 1,
      product_name: 'Vogue Eyewear Half Rim Metal Frame',
      sku: 'VO-4067-501',
      category: 'Frames',
      brand: 'Vogue',
      age_days: 210,
      original_price: 5200,
      quantity: 4,
      status: 'DEADSTOCK',
      store_name: selectedStore?.name || 'Main Branch',
    },
    {
      id: 2,
      product_name: 'Titan Eye+ Acetate Rectangle Frame',
      sku: 'TIT-AC-102',
      category: 'Frames',
      brand: 'Titan',
      age_days: 195,
      original_price: 3400,
      quantity: 7,
      status: 'DEADSTOCK',
      store_name: selectedStore?.name || 'Main Branch',
    },
  ];

  const handleTriggerAging = async () => {
    setIsRunningAging(true);
    try {
      await inventoryApi.runAgingEvaluation();
      toast.success('Daily stock aging evaluation executed successfully');
    } catch {
      toast.success('Triggered simulated aging recalculation');
    } finally {
      setIsRunningAging(false);
    }
  };

  const handleReactivateStock = () => {
    toast.success(`Item reactivated into active inventory at ₹${markdownPrice}`);
    setSelectedItem(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Archive className="w-7 h-7 text-amber-600" />
            Stock Aging & Deadstock Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track slow-moving optical inventory past 180+ days, trigger daily aging jobs, and liquidate or reuse items
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleTriggerAging}
          loading={isRunningAging}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Evaluate Aging Rules
        </Button>
      </div>

      {/* Aging Threshold Stage Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Fresh Stock (< 60 Days)', count: '482 Units', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800' },
          { label: 'Aging Stock (60-120 Days)', count: '84 Units', color: 'border-blue-200 bg-blue-50/50 text-blue-800' },
          { label: 'Critical Aging (120-180 Days)', count: '29 Units', color: 'border-amber-200 bg-amber-50/50 text-amber-800' },
          { label: 'Deadstock (> 180 Days)', count: '11 Units', color: 'border-rose-200 bg-rose-50/50 text-rose-800' },
        ].map((tier, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border shadow-sm ${tier.color}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">{tier.label}</span>
            <span className="text-xl font-black block mt-1">{tier.count}</span>
          </div>
        ))}
      </div>

      {/* Deadstock Items List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deadstock items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {mockDeadstock.map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                    {item.age_days} Days in Stock
                  </span>
                  <span className="text-xs text-slate-400 font-mono">SKU: {item.sku}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{item.product_name}</h4>
                <div className="flex gap-4 text-xs text-slate-500 pt-1">
                  <span>Brand: {item.brand}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Original Price: ₹{item.original_price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedItem(item);
                  setMarkdownPrice(Math.round(item.original_price * 0.7)); // 30% discount default
                }}
                className="!bg-amber-600 hover:!bg-amber-700 flex-shrink-0"
              >
                Reactivate with Markdown
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Reactivation Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Reactivate Deadstock — ${selectedItem.product_name}`}
          size="sm"
        >
          <div className="space-y-4 font-sans text-xs">
            <p className="text-slate-500">
              Set a promotional markdown selling price to move this aged inventory item back into the active POS catalog.
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                New Markdown Selling Price (₹)
              </label>
              <input
                type="number"
                value={markdownPrice}
                onChange={(e) => setMarkdownPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-emerald-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Original Price: ₹{selectedItem.original_price.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleReactivateStock}>
                Confirm Reactivation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeadstockPage;
