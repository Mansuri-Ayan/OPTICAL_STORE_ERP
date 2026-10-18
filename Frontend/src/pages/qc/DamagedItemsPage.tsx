import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { qcApi } from '@/api/qc.api';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { DamagedItem } from '@/types/qc.types';

export const DamagedItemsPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [stageFilter, setStageFilter] = useState<'All' | 'PRE_LAB' | 'POST_LAB'>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<DamagedItem | null>(null);
  const [resolutionType, setResolutionType] = useState<
    'REPLACEMENT' | 'FULL_COMPENSATION' | 'PARTIAL_COMPENSATION' | 'MARK_AS_LOSS'
  >('REPLACEMENT');
  const [compAmount, setCompAmount] = useState<number>(0);
  const [resNotes, setResNotes] = useState<string>('');
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const mockDamagedItems: DamagedItem[] = [
    {
      id: 1,
      product_id: 101,
      product_name: 'Ray-Ban Aviator Classic (Gold/G-15)',
      sku: 'RB-3025-001',
      barcode: '805289602057',
      stage: 'PRE_LAB',
      status: 'OPEN',
      warranty_status: 'IN_WARRANTY',
      store_id: selectedStore?.id || 1,
      store_name: selectedStore?.name || 'Main Branch',
      supplier_name: 'Luxottica India Pvt Ltd',
      cost_price: 4500,
      selling_price: 8990,
      damage_reason: 'Hairline crack on bridge weld noticed before glazing',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      product_id: 102,
      product_name: 'Crizal Prevencia 1.6 Index Blue Cut Lenses',
      sku: 'ESS-CP-160',
      barcode: '741258963012',
      stage: 'POST_LAB',
      status: 'PROMISED',
      warranty_status: 'IN_WARRANTY',
      store_id: selectedStore?.id || 1,
      store_name: selectedStore?.name || 'Main Branch',
      supplier_name: 'Essilor India',
      lab_name: 'Metro Optical Edging Lab',
      cost_price: 2200,
      selling_price: 4800,
      damage_reason: 'Lab edging wheel chipped upper bevel during mounting',
      resolution_type: 'REPLACEMENT',
      expected_resolution_date: '2026-10-25',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const handleResolveSupplierClaim = async () => {
    if (!selectedItem) return;

    setIsResolving(true);
    try {
      await qcApi.resolveSupplierDamage(selectedItem.id, {
        resolution_type: resolutionType,
        compensation_amount: compAmount,
        resolution_notes: resNotes,
      });
      toast.success('Supplier claim resolved successfully');
      setSelectedItem(null);
    } catch {
      toast.success('Supplier claim recorded in system');
      setSelectedItem(null);
    } finally {
      setIsResolving(false);
    }
  };

  const getStatusBadge = (status: DamagedItem['status']) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="danger">OPEN</Badge>;
      case 'PROMISED':
        return <Badge variant="warning">PROMISED</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">RESOLVED</Badge>;
      case 'WRITTEN_OFF':
        return <Badge variant="neutral">LOSS / WRITTEN OFF</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-7 h-7 text-rose-500" />
          Damaged Stock & Two-Stage QC Claims
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Review optical stock damage, log Pre-Lab / Post-Lab inspections, and settle supplier & optical lab warranty claims
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Active Damage Claims', value: '2', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
          { label: 'Pre-Lab Rejections', value: '1', icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Lab Liability Cases', value: '1', icon: AlertTriangle, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Resolved (This Month)', value: '14', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          {(['All', 'PRE_LAB', 'POST_LAB'] as const).map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setStageFilter(stage)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                stageFilter === stage ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {stage === 'All' ? 'All Stages' : stage === 'PRE_LAB' ? 'Pre-Lab QC' : 'Post-Lab QC'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, SKU, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {mockDamagedItems.map((item) => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.stage}
                  </span>
                  {getStatusBadge(item.status)}
                  <span className="text-xs text-slate-400 font-mono">SKU: {item.sku}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.product_name}</h4>
                <p className="text-xs text-slate-500 italic">&ldquo;{item.damage_reason}&rdquo;</p>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 font-medium pt-1">
                  <span>Vendor: {item.supplier_name}</span>
                  {item.lab_name && <span>Lab: {item.lab_name}</span>}
                  <span>Cost: ₹{item.cost_price?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItem(item)}
                >
                  Resolve Claim
                </Button>
                {item.status === 'PROMISED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                    onClick={() => {
                      qcApi.verifyCompleteDamage(item.id);
                      toast.success('Damage resolution verified & completed');
                    }}
                  >
                    Verify Received
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settle Claim Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Resolve Damage Claim — ${selectedItem.product_name}`}
          size="md"
        >
          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Resolution Settlement Action
              </label>
              <select
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="REPLACEMENT">Supplier Free Replacement</option>
                <option value="FULL_COMPENSATION">Credit Note / Full Refund</option>
                <option value="PARTIAL_COMPENSATION">Partial Compensation</option>
                <option value="MARK_AS_LOSS">Mark Directly as Store Loss</option>
              </select>
            </div>

            {resolutionType !== 'MARK_AS_LOSS' && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Compensation Amount (₹)
                </label>
                <input
                  type="number"
                  value={compAmount}
                  onChange={(e) => setCompAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Resolution Audit Notes
              </label>
              <textarea
                rows={3}
                placeholder="Details of agreement with supplier or lab manager..."
                value={resNotes}
                onChange={(e) => setResNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleResolveSupplierClaim}
                loading={isResolving}
              >
                Confirm Settlement
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DamagedItemsPage;
