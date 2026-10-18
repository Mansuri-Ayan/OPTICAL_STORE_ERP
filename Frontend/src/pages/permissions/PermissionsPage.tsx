import React, { useState } from 'react';
import {
  Shield,
  Settings,
  Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ROLE_OPTIONS = ['ADMIN', 'MANAGER', 'WORKER', 'OPTICIAN', 'ACCOUNTANT'] as const;

const PERMISSION_GROUPS = [
  {
    module: 'Sales & Invoices',
    key: 'sales',
    permissions: [
      { action: 'read', label: 'View Sales History & Bills' },
      { action: 'create', label: 'Create POS Sales & Orders' },
      { action: 'update', label: 'Advance Order Statuses' },
      { action: 'delete', label: 'Cancel & Void Sales' },
    ],
  },
  {
    module: 'Optical Prescriptions',
    key: 'prescriptions',
    permissions: [
      { action: 'read', label: 'View Patient Rx Records' },
      { action: 'create', label: 'Conduct Eye Tests & Issue Rx' },
      { action: 'update', label: 'Modify Prescription Parameters' },
    ],
  },
  {
    module: 'Exchanges & Returns',
    key: 'exchanges',
    permissions: [
      { action: 'read', label: 'View Exchange Records' },
      { action: 'create', label: 'Process Frame/Lens Returns' },
      { action: 'approve', label: 'Approve Cash Refunds' },
    ],
  },
  {
    module: 'Inventory & Barcodes',
    key: 'inventory',
    permissions: [
      { action: 'read', label: 'View Stock & Serialized Units' },
      { action: 'create', label: 'Receive Stock & Generate Barcodes' },
      { action: 'update', label: 'Direct Inter-Store Transfers' },
    ],
  },
  {
    module: 'Two-Stage QC & Claims',
    key: 'qc',
    permissions: [
      { action: 'read', label: 'View Damaged Items & QC Pipeline' },
      { action: 'create', label: 'Submit Pre-Lab & Post-Lab QC' },
      { action: 'manage', label: 'Settle Supplier & Lab Claims' },
    ],
  },
];

export const PermissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'role-defaults' | 'staff-overrides'>('role-defaults');
  const [selectedRole, setSelectedRole] = useState<(typeof ROLE_OPTIONS)[number]>('WORKER');

  // Local state for role toggles
  const [permissionsState, setPermissionsState] = useState<Record<string, boolean>>({
    'sales:read': true,
    'sales:create': true,
    'prescriptions:read': true,
    'prescriptions:create': true,
    'inventory:read': true,
    'qc:read': true,
  });

  const togglePermission = (key: string) => {
    setPermissionsState((prev) => {
      const next = !prev[key];
      toast.success(`${key} ${next ? 'granted' : 'revoked'}`);
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-indigo-600" />
          Access Control & Permission Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Configure least-privilege role boundaries and grant granular permissions across optical modules
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit text-xs font-bold shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('role-defaults')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'role-defaults' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4 h-4 text-indigo-600" />
          Global Role Defaults
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('staff-overrides')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'staff-overrides' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          Staff Overrides
        </button>
      </div>

      {/* Role Picker */}
      {activeTab === 'role-defaults' && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                selectedRole === r
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Permission Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.key} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{group.module}</h3>
              <span className="text-[10px] font-mono text-slate-400">module: {group.key}</span>
            </div>

            <div className="space-y-3">
              {group.permissions.map((p) => {
                const fullKey = `${group.key}:${p.action}`;
                const isGranted = !!permissionsState[fullKey];

                return (
                  <div key={fullKey} className="flex items-center justify-between py-1">
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">{p.label}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{fullKey}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePermission(fullKey)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                        isGranted ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          isGranted ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsPage;
