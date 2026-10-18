import React from 'react';
import { Package, User, Eye, CreditCard, Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { index: 0, label: 'Products', description: 'Frames & Lenses', icon: Package },
  { index: 1, label: 'Customer', description: 'Patient Record', icon: User },
  { index: 2, label: 'Prescription', description: 'OD/OS Powers', icon: Eye },
  { index: 3, label: 'Checkout', description: 'Payment & Settle', icon: CreditCard },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((s) => {
          const isCompleted = s.index < currentStep;
          const isActive = s.index === currentStep;
          const Icon = s.icon;

          return (
            <button
              key={s.index}
              type="button"
              disabled={s.index > currentStep}
              onClick={() => onStepClick?.(s.index)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                isActive
                  ? 'bg-indigo-50/80 border border-indigo-200 ring-2 ring-indigo-500/10'
                  : isCompleted
                  ? 'hover:bg-slate-50 cursor-pointer border border-transparent'
                  : 'opacity-50 cursor-not-allowed border border-transparent'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-800 tracking-tight truncate">
                  {s.label}
                </span>
                <span className="block text-[10px] font-medium text-slate-400 truncate">
                  {s.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
