import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface VisionDeltaBadgeProps {
  currentSph?: string | number;
  previousSph?: string | number;
  currentCyl?: string | number;
  previousCyl?: string | number;
  label?: string;
}

export const VisionDeltaBadge: React.FC<VisionDeltaBadgeProps> = ({
  currentSph,
  previousSph,
  currentCyl,
  previousCyl,
  label = 'Power Change',
}) => {
  if (currentSph === undefined || previousSph === undefined) {
    return null;
  }

  const curr = parseFloat(String(currentSph || 0));
  const prev = parseFloat(String(previousSph || 0));
  const diff = Number((curr - prev).toFixed(2));

  let color = 'text-slate-600 bg-slate-100 border-slate-200';
  let Icon = Minus;

  if (diff > 0) {
    color = 'text-blue-700 bg-blue-50 border-blue-200';
    Icon = TrendingUp;
  } else if (diff < 0) {
    color = 'text-teal-700 bg-teal-50 border-teal-200';
    Icon = TrendingDown;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{label}:</span>
      <span>{diff === 0 ? 'No change' : diff > 0 ? `+${diff.toFixed(2)}D` : `${diff.toFixed(2)}D`}</span>
      {currentCyl !== undefined && previousCyl !== undefined && (
        <span className="text-[10px] font-mono opacity-80">
          (CYL: {(parseFloat(String(currentCyl)) - parseFloat(String(previousCyl))).toFixed(2)}D)
        </span>
      )}
    </div>
  );
};
