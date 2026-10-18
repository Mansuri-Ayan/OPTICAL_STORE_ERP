import React, { useState } from 'react';
import {
  Sliders,
  FileText,
  Eye,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useStoreStore } from '@/store/store.store';
import { Button } from '@/components/ui/Button';

const COLOR_SWATCHES = [
  { name: 'Emerald', value: '#10B981' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Navy', value: '#0A0F1F' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Rose', value: '#F43F5E' },
];

export const BillTemplatePage: React.FC = () => {
  const { selectedStore } = useStoreStore();

  const [headerText, setHeaderText] = useState(selectedStore?.name || 'TechSentinals Optical Vision');
  const [subHeaderText, setSubHeaderText] = useState('Tax Invoice & Optical Dispensing Slip');
  const [address, setAddress] = useState('Shop 4, Optical Hub, MG Road, Mumbai - 400001');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [gstin, setGstin] = useState('27AAACT1234F1Z5');
  const [footerText, setFooterText] = useState('Thank you for choosing us! 1 Year Warranty on frames.');
  const [themeColor, setThemeColor] = useState('#10B981');
  const [showPrescription, setShowPrescription] = useState(true);
  const [showGst, setShowGst] = useState(true);
  const [activeTab, setActiveTab] = useState<'sale' | 'repair' | 'po'>('sale');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Bill template settings saved successfully');
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-indigo-600" />
          Invoice & Bill Template Designer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Customize optical store headers, tax breakdown, logo, UPI QR code, and print preview for customer invoices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls Column */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Customizer</h3>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Store Header Title
              </label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="w-full px-3 py-2 font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Invoice Subtitle
              </label>
              <input
                type="text"
                value={subHeaderText}
                onChange={(e) => setSubHeaderText(e.target.value)}
                className="w-full px-3 py-2 font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Store Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Store GSTIN
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Store Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Color Swatches */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Header Accent Theme Color
              </label>
              <div className="flex gap-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => setThemeColor(swatch.value)}
                    style={{ backgroundColor: swatch.value }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      themeColor === swatch.value ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                    }`}
                    title={swatch.name}
                  />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={showPrescription}
                  onChange={(e) => setShowPrescription(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Print Optometry Prescription (OD/OS) on Sale Receipt
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={showGst}
                  onChange={(e) => setShowGst(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Print Dual GST (CGST + SGST) Breakdown on Receipt
              </label>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Footer Disclaimer / Policy
              </label>
              <textarea
                rows={2}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="primary" onClick={handleSave} loading={isSaving}>
                Save Template Configuration
              </Button>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-5 shadow-inner space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" /> Live Receipt Preview
            </span>

            {/* Template type tabs */}
            <div className="flex gap-1 p-1 bg-white rounded-xl text-xs font-bold shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('sale')}
                className={`px-2.5 py-1 rounded-lg ${
                  activeTab === 'sale' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Sale Bill
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('repair')}
                className={`px-2.5 py-1 rounded-lg ${
                  activeTab === 'repair' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Repair Bill
              </button>
            </div>
          </div>

          {/* Thermal Receipt Visual Container */}
          <div
            className="bg-white rounded-2xl border border-slate-300 p-6 shadow-xl max-w-sm mx-auto font-mono text-[11px] text-slate-800 space-y-4"
            style={{ borderTop: `6px solid ${themeColor}` }}
          >
            {/* Store details */}
            <div className="text-center space-y-0.5 border-b border-dashed border-slate-200 pb-3">
              <h3 className="font-sans font-black text-sm text-slate-900">{headerText}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">{subHeaderText}</p>
              <p className="text-[9px] text-slate-400 pt-1">{address}</p>
              <p className="text-[9px] text-slate-400">Phone: {phone}</p>
              {showGst && <p className="text-[9px] font-bold text-slate-600">GSTIN: {gstin}</p>}
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 border-b border-dashed border-slate-200 pb-2">
              <span>Inv: INV-2026-0084</span>
              <span>Date: 17 Oct 2026</span>
            </div>

            {/* Prescription Preview Block */}
            {showPrescription && activeTab === 'sale' && (
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-[10px] space-y-1">
                <span className="font-bold block text-slate-700">Rx Details:</span>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>OD: -2.50 / -0.75 &times; 180&deg;</span>
                  <span>ADD: +1.50</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>OS: -3.00 / -0.50 &times; 175&deg;</span>
                  <span>PD: 63mm</span>
                </div>
              </div>
            )}

            {/* Line items */}
            <div className="space-y-1.5 border-b border-dashed border-slate-200 pb-3">
              <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>1 &times; Ray-Ban Aviator Gold</span>
                <span>₹8,490.00</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>1 &times; Crizal BlueCut 1.6</span>
                <span>₹3,500.00</span>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹11,990.00</span>
              </div>
              {showGst && (
                <>
                  <div className="flex justify-between text-slate-500">
                    <span>CGST (9%)</span>
                    <span>₹1,079.10</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>SGST (9%)</span>
                    <span>₹1,079.10</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-black text-xs text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Net Amount</span>
                <span>₹14,148.20</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Paid (UPI)</span>
                <span>₹14,148.20</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 border-t border-dashed border-slate-200 text-[9px] text-slate-400">
              <p>{footerText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillTemplatePage;
