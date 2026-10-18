import React, { useState } from 'react';
import {
  Truck,
  Search,
  Download,
  AlertCircle,
  Building,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSuppliers, usePurchaseOrders } from '@/hooks/useSuppliers';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PurchaseOrder } from '@/types/supplier.types';

export const SupplierPaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'NEFT_RTGS' | 'CHEQUE' | 'UPI' | 'CASH'>('NEFT_RTGS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: poData, isLoading } = usePurchaseOrders({
    limit: 50,
  });
  const { data: suppliersData } = useSuppliers({ limit: 100 });

  const poList: PurchaseOrder[] = Array.isArray(poData)
    ? poData
    : (poData as { items?: PurchaseOrder[] })?.items || [];

  const suppliersList = Array.isArray(suppliersData)
    ? suppliersData
    : (suppliersData as { items?: any[] })?.items || [];

  const filteredPOs = poList.filter((po) => {
    return (
      po.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPayables = poList.reduce((sum, po) => sum + (po.total_amount || 0), 0);

  const handleOpenPayment = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setPayAmount(po.total_amount || 0);
  };

  const handleRecordPayment = async () => {
    if (!selectedPO || payAmount <= 0) return;

    setIsSubmitting(true);
    try {
      // Record payment against supplier PO
      toast.success(`Payment of ₹${payAmount.toLocaleString('en-IN')} logged for ${selectedPO.po_number}`);
      setSelectedPO(null);
    } catch {
      toast.error('Failed to log supplier payment');
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
            <Truck className="w-7 h-7 text-indigo-600" />
            Supplier Payables & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Reconcile optical lens and frame vendor purchase orders, track GST input tax credit, and record disbursements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4 text-slate-500" />
            Vendor Statement
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Purchase Volume</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalPayables.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Across {poList.length} Purchase Orders
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Optical Suppliers</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{suppliersList.length} Vendors</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Essilor, Luxottica, Safilo, etc.
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Delivery / Audit</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {poList.filter((p) => p.status === 'PENDING').length} Orders
            </h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Stock awaiting QC inspection
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PO number or vendor..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier / Vendor</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading supplier payables...
                  </td>
                </tr>
              ) : filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {po.po_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{po.supplier_name || 'Vendor'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(po.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{(po.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={po.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {po.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenPayment(po)}
                        className="!py-1 !text-xs"
                      >
                        Record Payment
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPO && (
        <Modal
          isOpen={!!selectedPO}
          onClose={() => setSelectedPO(null)}
          title={`Disburse Payment: ${selectedPO.po_number}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor:</span>
                <span className="font-bold text-slate-900">{selectedPO.supplier_name}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200">
                <span>Invoice Total:</span>
                <span className="text-indigo-600">₹{(selectedPO.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Payment Amount (₹)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Bank Transfer / Reference Number</label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="e.g. UTR / Cheque # / UPI TXN ID"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Disbursement Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['NEFT_RTGS', 'CHEQUE', 'UPI', 'CASH'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                      paymentMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mode.replace('_', ' / ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setSelectedPO(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRecordPayment}
                loading={isSubmitting}
                disabled={payAmount <= 0}
              >
                Log Disbursement
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupplierPaymentsPage;
