import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Search,
  Receipt,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { exchangeApi } from '@/api/exchange.api';
import { salesApi } from '@/api/sales.api';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Sale, SaleItem } from '@/types/sales.types';
import { ReturnItemInput, ReplacementItemInput } from '@/types/exchange.types';

export const ExchangesPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [searchInvoice, setSearchInvoice] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundSale, setFoundSale] = useState<Sale | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Return items selection
  const [returnItems, setReturnItems] = useState<ReturnItemInput[]>([]);
  // Replacement items selection
  const [replacementItems, setReplacementItems] = useState<ReplacementItemInput[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search existing sale by invoice number
  const handleSearchSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInvoice.trim()) return;

    setIsSearching(true);
    try {
      const res = await salesApi.getSales({ search: searchInvoice.trim() });
      if (res.items && res.items.length > 0) {
        const exactMatch = res.items.find(
          (s) => s.invoice_number.toLowerCase() === searchInvoice.trim().toLowerCase()
        ) || res.items[0];
        if (exactMatch) {
          setFoundSale(exactMatch);
          setShowNewModal(true);
        }
      } else {
        toast.error('No matching sale or invoice found');
      }
    } catch {
      toast.error('Error fetching invoice details');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleReturnItem = (item: SaleItem) => {
    const existing = returnItems.find((r) => r.sale_item_id === item.id);
    if (existing) {
      setReturnItems(returnItems.filter((r) => r.sale_item_id !== item.id));
    } else {
      setReturnItems([
        ...returnItems,
        {
          sale_item_id: item.id,
          product_id: item.product_id,
          product_name: item.product_name || 'Item',
          quantity: 1,
          unit_price: item.unit_price,
          total_credit: item.unit_price,
          condition: 'GOOD',
          return_reason: 'Fit / Style issue',
        },
      ]);
    }
  };

  const returnTotal = returnItems.reduce((sum, item) => sum + item.total_credit, 0);
  const replacementTotal = replacementItems.reduce((sum, item) => sum + item.total_charge, 0);
  const netDifference = replacementTotal - returnTotal;

  const handleCompleteExchange = async () => {
    if (!foundSale || !selectedStore?.id) return;
    if (returnItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        original_sale_id: foundSale.id,
        store_id: selectedStore.id,
        returned_items: returnItems,
        replacement_items: replacementItems,
        return_total: returnTotal,
        replacement_total: replacementTotal,
        net_difference: netDifference,
        payment_method: netDifference > 0 ? paymentMethod : undefined,
      };

      const result = await exchangeApi.createExchange(payload);
      toast.success(`Exchange created: ${result.exchange_number}`);
      setShowNewModal(false);
      setFoundSale(null);
      setReturnItems([]);
      setReplacementItems([]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process exchange';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ArrowRightLeft className="w-7 h-7 text-indigo-600" />
            Optical Exchanges & Returns
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Exchange spectacles, return frames, grade condition (Good vs Damaged), and settle price differences
          </p>
        </div>

        <form onSubmit={handleSearchSale} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Invoice # (e.g. INV-2026-001)"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <Button type="submit" variant="primary" size="md" loading={isSearching}>
            Lookup Sale
          </Button>
        </form>
      </div>

      {/* Main Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-3 shadow-sm">
        <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Initiate an Exchange from an Invoice</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Search an existing optical invoice number above to inspect original items, select return products, and pick
          replacement inventory.
        </p>
      </div>

      {/* New Exchange Modal */}
      {foundSale && (
        <Modal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          title={`Process Exchange for Invoice #${foundSale.invoice_number}`}
          size="lg"
        >
          <div className="space-y-5 font-sans">
            {/* Sale metadata */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 font-medium">Customer: </span>
                <span className="font-bold text-slate-800">{foundSale.customer_name || 'Walk-in'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Original Total: </span>
                <span className="font-bold text-slate-900">₹{foundSale.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Select items to return */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                1. Select Items to Return
              </label>
              <div className="space-y-2">
                {foundSale.items.map((item) => {
                  const isSelected = returnItems.some((r) => r.sale_item_id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleReturnItem(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{item.product_name}</h4>
                        <span className="text-[11px] font-mono text-slate-500">
                          ₹{item.unit_price.toLocaleString('en-IN')} &times; {item.quantity}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Return'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlement calculations */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Return Credit Total</span>
                <span className="font-bold text-emerald-600">₹{returnTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Replacement Items Total</span>
                <span className="font-bold text-slate-800">₹{replacementTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 text-slate-900">
                <span>Net Difference</span>
                <span className={netDifference > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                  {netDifference > 0
                    ? `+₹${netDifference.toLocaleString('en-IN')} (Customer Pays)`
                    : netDifference < 0
                    ? `-₹${Math.abs(netDifference).toLocaleString('en-IN')} (Refund / Credit)`
                    : '₹0 (Even Exchange)'}
                </span>
              </div>
            </div>

            {netDifference > 0 && (
              <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-xs font-bold text-indigo-950">Payment Mode for Balance:</span>
                <div className="flex gap-1.5">
                  {(['CASH', 'UPI', 'CARD'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === m
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCompleteExchange}
                loading={isSubmitting}
                disabled={returnItems.length === 0}
              >
                Confirm Exchange
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExchangesPage;
