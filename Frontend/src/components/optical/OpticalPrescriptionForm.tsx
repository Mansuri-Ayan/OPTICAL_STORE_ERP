import React, { useState } from 'react';
import { Eye, ArrowLeft, ArrowRight, Stethoscope, Calendar, FileText, Sliders, Plus, Minus } from 'lucide-react';
import { Prescription, EyePower, LensType, FramePreference, LensCoating } from '@/types/optical.types';
import { Button } from '@/components/ui/Button';

interface OpticalPrescriptionFormProps {
  prescription?: Prescription | null;
  onChange?: (prescription: Prescription) => void;
  onBack?: () => void;
  onNext?: (prescription: Prescription) => void;
  onSkip?: () => void;
}

const defaultEye: EyePower = {
  sph: '0.00',
  cyl: '0.00',
  axis: '0',
  addPower: '0.00',
  pd: '32',
  prism: '0',
  base: '',
};

export const LENS_TYPES: LensType[] = [
  'Single Vision',
  'Bifocal',
  'Progressive',
  'Blue Cut',
  'Photochromic',
  'Polarized',
  'Anti-Reflective',
  'Transition',
  'High-Index',
];

export const FRAME_PREFERENCES: FramePreference[] = [
  'Full Rim',
  'Half Rim',
  'Rimless',
  'Cat Eye',
  'Aviator',
  'Round',
  'Rectangle',
  'Wayfarer',
  'Oval',
  'Sports',
];

export const LENS_COATINGS: LensCoating[] = [
  'Anti-Reflective',
  'Blue Light Filter',
  'UV Protection',
  'Scratch Resistant',
  'Anti-Fog',
  'Hydrophobic',
];

export const OpticalPrescriptionForm: React.FC<OpticalPrescriptionFormProps> = ({
  prescription,
  onChange,
  onBack,
  onNext,
  onSkip,
}) => {
  const [form, setForm] = useState<Prescription>(() => ({
    rightEye: { ...defaultEye, ...(prescription?.rightEye || {}) },
    leftEye: { ...defaultEye, ...(prescription?.leftEye || {}) },
    lensType: prescription?.lensType || 'Single Vision',
    framePreference: prescription?.framePreference || 'Full Rim',
    lensCoating: prescription?.lensCoating || 'Anti-Reflective',
    doctorName: prescription?.doctorName || '',
    clinicName: prescription?.clinicName || '',
    prescriptionDate: prescription?.prescriptionDate || new Date().toISOString().split('T')[0],
    notes: prescription?.notes || '',
  }));

  const updateEye = (eye: 'rightEye' | 'leftEye', field: keyof EyePower, val: string | number | undefined) => {
    setForm((prev) => {
      const updated = {
        ...prev,
        [eye]: { ...prev[eye], [field]: val },
      };
      onChange?.(updated);
      return updated;
    });
  };

  const adjustDiopter = (eye: 'rightEye' | 'leftEye', field: 'sph' | 'cyl' | 'addPower', step: number) => {
    const current = parseFloat(String(form[eye][field] || '0')) || 0;
    const nextVal = (current + step).toFixed(2);
    const formatted = parseFloat(nextVal) > 0 ? `+${nextVal}` : nextVal;
    updateEye(eye, field, formatted);
  };

  const handleFieldChange = (field: keyof Prescription, val: unknown) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      onChange?.(updated);
      return updated;
    });
  };

  const renderEyeCard = (eyeKey: 'rightEye' | 'leftEye', title: string, code: 'OD' | 'OS', accentColor: string) => {
    const eye = form[eyeKey];
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white ${accentColor}`}
            >
              {code}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{title}</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {code === 'OD' ? 'Oculus Dexter (Right)' : 'Oculus Sinister (Left)'}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {eye.sph || '0.00'} / {eye.cyl || '0.00'} &times; {eye.axis || '0'}&deg;
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {/* SPH */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">SPH (Sphere)</label>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <button
                type="button"
                onClick={() => adjustDiopter(eyeKey, 'sph', -0.25)}
                className="px-2 py-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                value={eye.sph}
                onChange={(e) => updateEye(eyeKey, 'sph', e.target.value)}
                className="w-full text-center text-xs font-mono font-bold py-1.5 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustDiopter(eyeKey, 'sph', +0.25)}
                className="px-2 py-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CYL */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">CYL (Cylinder)</label>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <button
                type="button"
                onClick={() => adjustDiopter(eyeKey, 'cyl', -0.25)}
                className="px-2 py-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                value={eye.cyl}
                onChange={(e) => updateEye(eyeKey, 'cyl', e.target.value)}
                className="w-full text-center text-xs font-mono font-bold py-1.5 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustDiopter(eyeKey, 'cyl', +0.25)}
                className="px-2 py-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AXIS */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">AXIS (0&deg;-180&deg;)</label>
            <input
              type="number"
              min="0"
              max="180"
              value={eye.axis}
              onChange={(e) => updateEye(eyeKey, 'axis', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </div>

          {/* ADD */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ADD (Reading)</label>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <button
                type="button"
                onClick={() => adjustDiopter(eyeKey, 'addPower', -0.25)}
                className="px-2 py-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                value={eye.addPower || ''}
                onChange={(e) => updateEye(eyeKey, 'addPower', e.target.value)}
                placeholder="+1.50"
                className="w-full text-center text-xs font-mono font-bold py-1.5 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustDiopter(eyeKey, 'addPower', +0.25)}
                className="px-2 py-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PD */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">PD (mm)</label>
            <input
              type="number"
              value={eye.pd || ''}
              onChange={(e) => updateEye(eyeKey, 'pd', e.target.value)}
              placeholder="32"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            />
          </div>

          {/* Prism / Base */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Prism / Base</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={eye.prism || ''}
                onChange={(e) => updateEye(eyeKey, 'prism', e.target.value)}
                placeholder="Δ"
                className="w-1/2 border border-slate-200 rounded-xl px-2 py-2 text-xs font-mono font-bold text-center focus:outline-none"
              />
              <select
                value={eye.base || ''}
                onChange={(e) => updateEye(eyeKey, 'base', e.target.value as EyePower['base'])}
                className="w-1/2 border border-slate-200 rounded-xl px-1 py-2 text-[11px] font-bold text-center focus:outline-none bg-white"
              >
                <option value="">None</option>
                <option value="BU">BU</option>
                <option value="BD">BD</option>
                <option value="BI">BI</option>
                <option value="BO">BO</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Optical Prescription Details</h2>
            <p className="text-xs text-slate-500">Record binocular power, optometric parameters, and lens options</p>
          </div>
        </div>

        {onSkip && (
          <Button variant="ghost" size="sm" onClick={onSkip} className="text-slate-500 hover:text-slate-700">
            Skip for Plano / Non-Rx
          </Button>
        )}
      </div>

      {/* OD & OS Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {renderEyeCard('rightEye', 'Right Eye', 'OD', 'bg-blue-600')}
        {renderEyeCard('leftEye', 'Left Eye', 'OS', 'bg-teal-600')}
      </div>

      {/* Lens, Frame & Coating Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dispensing Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Lens Type
            </label>
            <select
              value={form.lensType}
              onChange={(e) => handleFieldChange('lensType', e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {LENS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Frame Preference
            </label>
            <select
              value={form.framePreference}
              onChange={(e) => handleFieldChange('framePreference', e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {FRAME_PREFERENCES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Lens Coating
            </label>
            <select
              value={form.lensCoating}
              onChange={(e) => handleFieldChange('lensCoating', e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {LENS_COATINGS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor and Date info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Doctor / Optometrist Name
            </label>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Dr. Rajesh Mehta"
                value={form.doctorName || ''}
                onChange={(e) => handleFieldChange('doctorName', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Examination Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={form.prescriptionDate || ''}
                onChange={(e) => handleFieldChange('prescriptionDate', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Clinical Notes
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              placeholder="Notes on visual acuity, progressive corridor, fitting height, or corneal cylinder..."
              value={form.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      {(onBack || onNext) && (
        <div className="flex items-center justify-between pt-2">
          {onBack ? (
            <Button variant="outline" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          ) : <div />}
          {onNext && (
            <Button
              variant="primary"
              onClick={() => onNext(form)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Payment
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
