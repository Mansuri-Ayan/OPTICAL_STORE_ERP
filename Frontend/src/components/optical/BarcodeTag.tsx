import React from 'react';
import { Tag, Barcode } from 'lucide-react';

interface BarcodeTagProps {
  barcode: string;
  productName: string;
  brandName?: string;
  modelCode?: string;
  sellingPrice: number;
  mrp?: number;
  size?: string;
  color?: string;
}

export const BarcodeTag: React.FC<BarcodeTagProps> = ({
  barcode,
  productName,
  brandName,
  modelCode,
  sellingPrice,
  mrp,
  size,
  color,
}) => {
  return (
    <div className="w-56 p-3 bg-white border border-slate-300 rounded-xl shadow-sm text-slate-900 font-mono text-[10px] space-y-1.5 select-none hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
        <span className="font-extrabold uppercase text-[11px] truncate tracking-wide text-slate-800">
          {brandName || 'OPTICAL'}
        </span>
        <Tag className="w-3.5 h-3.5 text-slate-400" />
      </div>

      <div className="font-sans font-semibold text-xs truncate text-slate-700">
        {productName}
      </div>

      <div className="flex justify-between text-slate-500 text-[9px]">
        {modelCode && <span>Mod: {modelCode}</span>}
        {size && <span>Sz: {size}</span>}
        {color && <span>Clr: {color}</span>}
      </div>

      {/* Simulated Barcode Lines */}
      <div className="py-1 flex flex-col items-center justify-center bg-slate-50/70 rounded p-1">
        <Barcode className="w-full h-7 text-slate-800" />
        <span className="text-[9px] font-bold tracking-widest text-slate-600">{barcode}</span>
      </div>

      {/* Price tag */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        {mrp && mrp > sellingPrice ? (
          <span className="line-through text-slate-400 text-[9px]">
            MRP ₹{mrp.toLocaleString('en-IN')}
          </span>
        ) : <div />}
        <span className="text-xs font-black text-emerald-700">
          ₹{sellingPrice.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
};
