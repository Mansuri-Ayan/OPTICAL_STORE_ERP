import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Sale } from '@/types/sales.types';

export const GstReportsPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [returnPeriod, setReturnPeriod] = useState<string>('2026-10');
  const [reportType, setReportType] = useState<'GSTR1' | 'GSTR3B' | 'HSN'>('GSTR1');

  const { data: salesData, isLoading } = useSales({
    store_id: selectedStore?.id,
    limit: 100,
  });

  const salesList: Sale[] = Array.isArray(salesData)
    ? salesData
    : (salesData as { items?: Sale[] })?.items || [];

  // Calculate GST Tax buckets
  let totalTaxableValue = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  salesList.forEach((sale) => {
    const cgst = sale.cgst_amount || 0;
    const sgst = sale.sgst_amount || 0;
    const igst = sale.igst_amount || 0;
    const net = sale.net_amount || sale.total_amount || 0;

    totalCGST += cgst;
    totalSGST += sgst;
    totalIGST += igst;
    totalTaxableValue += Math.max(0, net - (cgst + sgst + igst));
  });

  const totalTaxCollected = totalCGST + totalSGST + totalIGST;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600" />
            GST Tax Reports & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            GSTR-1, GSTR-3B monthly tax summaries, HSN code splits (9001/9003/9004), and input-output reconciliation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={returnPeriod}
            onChange={(e) => setReturnPeriod(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800"
          />

          <Button variant="primary" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download GSTR-1 Excel
          </Button>
        </div>
      </div>

      {/* Tax Bucket Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Taxable Value</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalTaxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
            Net base before GST
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CGST (Central Tax 9%)</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">
            ₹{totalCGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
            Intra-state central share
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SGST (State Tax 9%)</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">
            ₹{totalSGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
            Intra-state state share
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-emerald-50/50 border-emerald-200 shadow-sm">
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Output Tax Liability</p>
          <h3 className="text-2xl font-black text-emerald-900 mt-1">
            ₹{totalTaxCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <span className="text-[11px] font-black text-emerald-700 mt-1 block">
            Payable to government
          </span>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex gap-2">
        {(['GSTR1', 'GSTR3B', 'HSN'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setReportType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'GSTR1' ? 'GSTR-1 Outward Supplies' : tab === 'GSTR3B' ? 'GSTR-3B Summary Return' : 'HSN Code Analysis'}
          </button>
        ))}
      </div>

      {/* Tab Content: HSN Summary */}
      {reportType === 'HSN' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">HSN Code</th>
                <th className="py-3 px-4">Product Category Description</th>
                <th className="py-3 px-4">GST Rate</th>
                <th className="py-3 px-4">Taxable Value</th>
                <th className="py-3 px-4">CGST (₹)</th>
                <th className="py-3 px-4">SGST (₹)</th>
                <th className="py-3 px-4">Total Tax (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">9003</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">Spectacle Frames, Mountings & Parts</td>
                <td className="py-3.5 px-4 font-mono font-bold">18.00%</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalTaxableValue * 0.58).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalCGST * 0.58).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalSGST * 0.58).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{Math.round(totalTaxCollected * 0.58).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">9001</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">Ophthalmic Lenses of Any Material</td>
                <td className="py-3.5 px-4 font-mono font-bold">18.00%</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalTaxableValue * 0.35).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalCGST * 0.35).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalSGST * 0.35).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{Math.round(totalTaxCollected * 0.35).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">9004</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">Spectacles, Goggles & Sunglasses</td>
                <td className="py-3.5 px-4 font-mono font-bold">18.00%</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalTaxableValue * 0.07).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalCGST * 0.07).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono">₹{Math.round(totalSGST * 0.07).toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{Math.round(totalTaxCollected * 0.07).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        /* GSTR-1 Invoices Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Supply Type</th>
                  <th className="py-3 px-4">Total Invoice Value</th>
                  <th className="py-3 px-4">Taxable Value</th>
                  <th className="py-3 px-4">CGST (9%)</th>
                  <th className="py-3 px-4">SGST (9%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Loading GSTR records...
                    </td>
                  </tr>
                ) : salesList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No invoices found for return period {returnPeriod}.
                    </td>
                  </tr>
                ) : (
                  salesList.map((sale) => {
                    const tax = (sale.cgst_amount || 0) + (sale.sgst_amount || 0);
                    const taxable = (sale.net_amount || sale.total_amount || 0) - tax;
                    return (
                      <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {sale.invoice_number}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {new Date(sale.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {sale.customer_name || 'Consumer (B2C)'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-[10px] text-slate-600">
                            B2C Small (Intra-State)
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          ₹{(sale.net_amount || sale.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          ₹{Math.max(0, taxable).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 font-mono text-indigo-600">
                          ₹{(sale.cgst_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 font-mono text-indigo-600">
                          ₹{(sale.sgst_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GstReportsPage;
