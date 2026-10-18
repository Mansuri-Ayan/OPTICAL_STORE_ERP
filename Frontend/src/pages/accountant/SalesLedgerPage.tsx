import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Search,
  ArrowUpRight,
  CreditCard,
  Building,
} from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sale } from '@/types/sales.types';

export const SalesLedgerPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');

  const { data: salesData, isLoading } = useSales({
    store_id: selectedStore?.id,
    limit: 50,
  });

  const salesList: Sale[] = Array.isArray(salesData)
    ? salesData
    : (salesData as { items?: Sale[] })?.items || [];

  const filteredSales = salesList.filter((sale) => {
    const matchesSearch =
      sale.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment =
      paymentFilter === 'ALL' || sale.payment_method?.toUpperCase() === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.net_amount || s.total_amount || 0), 0);
  const totalTax = filteredSales.reduce((sum, s) => sum + ((s.cgst_amount || 0) + (s.sgst_amount || 0) + (s.igst_amount || 0)), 0);
  const totalDues = filteredSales.reduce((sum, s) => sum + (s.balance_due || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            General Sales Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Dual-entry transaction register with CGST/SGST breakdowns, multi-mode receipts, and customer dues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4 text-slate-500" />
            Export Tally / CSV
          </Button>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Billed Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {filteredSales.length} Entries in Ledger
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            ₹
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GST Liability Collected</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">₹{totalTax.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              CGST + SGST (9%+9%) / IGST (18%)
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Receivables (Dues)</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">₹{totalDues.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Outstanding optical balance
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice or patient..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'CASH', 'UPI', 'CARD', 'SPLIT'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentFilter(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  paymentFilter === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['today', 'week', 'month'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1.5 rounded-lg capitalize transition-all ${
                  dateRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer / Patient</th>
                <th className="py-3 px-4">Taxable Amt</th>
                <th className="py-3 px-4">GST Split</th>
                <th className="py-3 px-4">Total Billed</th>
                <th className="py-3 px-4">Paid / Due</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Loading ledger transactions...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No transactions found in this period.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const sub = (sale.net_amount || sale.total_amount || 0) - ((sale.cgst_amount || 0) + (sale.sgst_amount || 0));
                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(sale.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        {sale.invoice_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{sale.customer_name || 'Walk-in Patient'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        ₹{Math.max(0, sub).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        CGST: ₹{(sale.cgst_amount || 0).toLocaleString('en-IN')}<br />
                        SGST: ₹{(sale.sgst_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        ₹{(sale.net_amount || sale.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-emerald-600 font-bold">
                          ₹{(sale.paid_amount || sale.net_amount || 0).toLocaleString('en-IN')}
                        </span>
                        {(sale.balance_due || 0) > 0 && (
                          <span className="text-rose-600 font-bold block text-[11px]">
                            Due: ₹{(sale.balance_due || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700">
                          {sale.payment_method || 'CASH'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={sale.status === 'COMPLETED' ? 'success' : 'warning'}>
                          {sale.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesLedgerPage;
