import React, { useState } from 'react';
import {
  Users,
  Search,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSales } from '@/hooks/useSales';
import { salesApi } from '@/api/sales.api';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Sale } from '@/types/sales.types';

export const CustomerDuesPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'CARD'>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: salesData, isLoading, refetch } = useSales({
    store_id: selectedStore?.id,
    limit: 100,
  });

  const salesList: Sale[] = Array.isArray(salesData)
    ? salesData
    : (salesData as { items?: Sale[] })?.items || [];

  // Filter only sales with balance_due > 0
  const duesList = salesList.filter((s) => (s.balance_due || 0) > 0);

  const filteredDues = duesList.filter((sale) => {
    return (
      sale.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalOutstanding = duesList.reduce((sum, s) => sum + (s.balance_due || 0), 0);

  const handleOpenSettlement = (sale: Sale) => {
    setSelectedSale(sale);
    setCollectAmount(sale.balance_due || 0);
  };

  const handleCollectPayment = async () => {
    if (!selectedSale || collectAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await salesApi.addPayment(selectedSale.id, {
        amount: collectAmount,
        payment_method: paymentMode,
      });
      toast.success(`Payment of ₹${collectAmount.toLocaleString('en-IN')} recorded`);
      setSelectedSale(null);
      refetch();
    } catch {
      toast.error('Failed to record settlement payment');
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
            <Users className="w-7 h-7 text-amber-500" />
            Customer Receivables & Dues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track uncollected customer balances, partial advance deposits, and settle dues with payment receipts
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Total Outstanding Balance</span>
            <span className="text-lg font-black text-amber-900">₹{totalOutstanding.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number or patient name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredDues.length} pending receivables
        </span>
      </div>

      {/* Dues Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer / Patient</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Advance Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Lab / Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading outstanding receivables...
                  </td>
                </tr>
              ) : filteredDues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                    All customer dues are fully cleared! No pending receivables.
                  </td>
                </tr>
              ) : (
                filteredDues.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {sale.invoice_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{sale.customer_name || 'Walk-in'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(sale.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{(sale.net_amount || sale.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                      ₹{(sale.paid_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600 font-black">
                      ₹{(sale.balance_due || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={sale.lab_status === 'DELIVERED' ? 'success' : 'warning'}>
                        {sale.lab_status || sale.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenSettlement(sale)}
                          className="!py-1 !text-xs !bg-emerald-600 hover:!bg-emerald-700"
                        >
                          Collect Due
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Settlement Modal */}
      {selectedSale && (
        <Modal
          isOpen={!!selectedSale}
          onClose={() => setSelectedSale(null)}
          title={`Collect Due: ${selectedSale.invoice_number}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{selectedSale.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-bold text-slate-900">₹{(selectedSale.net_amount || selectedSale.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Already Paid:</span>
                <span className="font-bold text-emerald-600">₹{(selectedSale.paid_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black">
                <span>Remaining Due:</span>
                <span className="text-rose-600">₹{(selectedSale.balance_due || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Amount to Settle (₹)</label>
              <input
                type="number"
                value={collectAmount}
                onChange={(e) => setCollectAmount(parseFloat(e.target.value) || 0)}
                max={selectedSale.balance_due || 0}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['CASH', 'UPI', 'CARD'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      paymentMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setSelectedSale(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCollectPayment}
                loading={isSubmitting}
                disabled={collectAmount <= 0}
              >
                Record Payment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerDuesPage;
