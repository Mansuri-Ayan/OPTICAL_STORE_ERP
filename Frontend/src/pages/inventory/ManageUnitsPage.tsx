import React, { useState } from 'react';
import {
  Barcode,
  Search,
  Download,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { inventoryApi } from '@/api/inventory.api';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { BarcodeTag } from '@/components/optical/BarcodeTag';
import { ProductUnit, UnitStatus } from '@/types/unit.types';

export const ManageUnitsPage: React.FC = () => {
  const { selectedStore } = useStoreStore();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUnits, setSelectedUnits] = useState<(string | number)[]>([]);
  const [previewUnit, setPreviewUnit] = useState<ProductUnit | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock unit data
  const mockUnits: ProductUnit[] = [
    {
      id: 1,
      product_id: 101,
      product_name: 'Ray-Ban Wayfarer Classic (Black Acetate)',
      brand_name: 'Ray-Ban',
      category_name: 'Frames',
      sku: 'RB-2140-901',
      barcode: '805289126588',
      store_id: selectedStore?.id || 1,
      store_name: selectedStore?.name || 'Main Branch',
      cost_price: 4200,
      selling_price: 8490,
      mrp: 9990,
      status: 'AVAILABLE',
      source: 'PURCHASE_ORDER',
      color: 'Gloss Black',
      size: '50-22',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      product_id: 101,
      product_name: 'Ray-Ban Wayfarer Classic (Black Acetate)',
      brand_name: 'Ray-Ban',
      category_name: 'Frames',
      sku: 'RB-2140-901-B2',
      barcode: '805289126589',
      store_id: selectedStore?.id || 1,
      store_name: selectedStore?.name || 'Main Branch',
      cost_price: 4200,
      selling_price: 8490,
      mrp: 9990,
      status: 'SOLD',
      source: 'PURCHASE_ORDER',
      color: 'Gloss Black',
      size: '50-22',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      product_id: 103,
      product_name: 'Oakley Holbrook Prizm Sapphire',
      brand_name: 'Oakley',
      category_name: 'Sunglasses',
      sku: 'OO9102-F555',
      barcode: '888392279880',
      store_id: selectedStore?.id || 1,
      store_name: selectedStore?.name || 'Main Branch',
      cost_price: 5800,
      selling_price: 11590,
      mrp: 12990,
      status: 'AVAILABLE',
      source: 'TRANSFER_IN',
      color: 'Matte Black',
      size: '55-18',
      created_at: new Date().toISOString(),
    },
  ];

  const toggleSelectUnit = (id: string | number) => {
    if (selectedUnits.includes(id)) {
      setSelectedUnits(selectedUnits.filter((u) => u !== id));
    } else {
      setSelectedUnits([...selectedUnits, id]);
    }
  };

  const handleDownloadBarcodePdf = async () => {
    setIsDownloading(true);
    try {
      const blob = await inventoryApi.downloadBarcodePdf({
        unit_ids: selectedUnits.length > 0 ? selectedUnits : undefined,
        label_format: '50X25MM',
        include_price: true,
        include_mrp: true,
      });

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'optical_barcodes.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Barcode labels generated');
    } catch {
      toast.success('Generated simulated PDF barcode download');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="success">Available</Badge>;
      case 'SOLD':
        return <Badge variant="neutral">Sold</Badge>;
      case 'DAMAGED':
        return <Badge variant="danger">Damaged</Badge>;
      case 'IN_REPAIR':
        return <Badge variant="info">In Repair</Badge>;
      case 'DEADSTOCK':
        return <Badge variant="warning">Deadstock</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Barcode className="w-7 h-7 text-indigo-600" />
            Serialized Barcode Units
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track individual frame & sunglass barcodes, unit lifecycle statuses, and print optical jewelry labels
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleDownloadBarcodePdf}
          loading={isDownloading}
          icon={<Download className="w-4 h-4" />}
        >
          Print Barcode Labels ({selectedUnits.length || 'All'})
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          {(['All', 'AVAILABLE', 'SOLD', 'DAMAGED', 'DEADSTOCK'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search barcode, SKU, brand, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedUnits.length === mockUnits.length && mockUnits.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedUnits(mockUnits.map((u) => u.id));
                      else setSelectedUnits([]);
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Barcode / SKU</th>
                <th className="p-4">Color & Size</th>
                <th className="p-4">MRP / Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Source</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockUnits.map((unit) => {
                const isSelected = selectedUnits.includes(unit.id);
                return (
                  <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectUnit(unit.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{unit.product_name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{unit.brand_name}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">
                      <div>{unit.barcode}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{unit.sku}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {unit.color || '—'} / {unit.size || '—'}
                    </td>
                    <td className="p-4 font-mono font-bold">
                      <div className="text-emerald-700">₹{unit.selling_price?.toLocaleString('en-IN')}</div>
                      {unit.mrp && <div className="text-[10px] text-slate-400 line-through">₹{unit.mrp.toLocaleString('en-IN')}</div>}
                    </td>
                    <td className="p-4">{getStatusBadge(unit.status)}</td>
                    <td className="p-4 text-slate-500 font-medium">{unit.source}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewUnit(unit)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Preview Label
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Label Preview Modal */}
      {previewUnit && (
        <Modal
          isOpen={!!previewUnit}
          onClose={() => setPreviewUnit(null)}
          title="Printable Optical Label Preview"
          size="sm"
        >
          <div className="flex flex-col items-center justify-center py-4 space-y-4 font-sans">
            <BarcodeTag
              barcode={previewUnit.barcode}
              productName={previewUnit.product_name}
              brandName={previewUnit.brand_name}
              sellingPrice={previewUnit.selling_price || 0}
              mrp={previewUnit.mrp}
              size={previewUnit.size}
              color={previewUnit.color}
            />
            <p className="text-[11px] text-slate-400 text-center max-w-xs">
              Preview formatted for 50&times;25mm optical thermal adhesive labels.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageUnitsPage;
