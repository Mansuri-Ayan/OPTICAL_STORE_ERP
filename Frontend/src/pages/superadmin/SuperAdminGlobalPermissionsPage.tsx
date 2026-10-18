import React, { useState } from 'react';
import {
  Settings,
  Users,
  CheckCircle2,
  Lock,
  Save,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

const ROLE_OPTIONS = ['ADMIN', 'MANAGER', 'WORKER', 'OPTICIAN', 'ACCOUNTANT'] as const;

const GLOBAL_PERMISSION_MODULES = [
  {
    module: 'Sales & Billing (POS)',
    key: 'sales',
    permissions: [
      { action: 'read', label: 'View Sales History & Bills' },
      { action: 'create', label: 'Process POS Sales & Dispense Orders' },
      { action: 'update', label: 'Update Order & Lab Status' },
      { action: 'delete', label: 'Void / Cancel Completed Sales' },
    ],
  },
  {
    module: 'Optical Inventory & Serialized Barcodes',
    key: 'inventory',
    permissions: [
      { action: 'read', label: 'View Stock & Unit Barcodes' },
      { action: 'create', label: 'Inward New Stock & Generate 50x25mm Tags' },
      { action: 'update', label: 'Transfer Stock Across Branches' },
      { action: 'delete', label: 'Delete Stock Records' },
    ],
  },
  {
    module: 'QC Damaged Stock & Warranties',
    key: 'qc',
    permissions: [
      { action: 'read', label: 'View Pre-Lab & Post-Lab Damage Records' },
      { action: 'create', label: 'File QC Damage Claim' },
      { action: 'update', label: 'Resolve Supplier / Lab Claims' },
      { action: 'delete', label: 'Delete Claim Audit Logs' },
    ],
  },
  {
    module: 'Optical Exchanges & Returns',
    key: 'exchanges',
    permissions: [
      { action: 'read', label: 'View Exchanges Register' },
      { action: 'create', label: 'Process Exchange & Grade Condition' },
      { action: 'update', label: 'Adjust Net Difference' },
      { action: 'delete', label: 'Cancel Exchange Record' },
    ],
  },
  {
    module: 'Financial Accounting & GST',
    key: 'accounting',
    permissions: [
      { action: 'read', label: 'View Sales Ledger & Dues' },
      { action: 'create', label: 'Collect Dues & Record Supplier Payments' },
      { action: 'update', label: 'Generate P&L & GSTR Reports' },
      { action: 'delete', label: 'Delete Payment Records' },
    ],
  },
];

export const SuperAdminGlobalPermissionsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<(typeof ROLE_OPTIONS)[number]>('OPTICIAN');
  const [isSaving, setIsSaving] = useState(false);

  // Map of permissions: { "sales:create": true, ... }
  const [permissionsMap, setPermissionsMap] = useState<Record<string, boolean>>({
    'sales:read': true,
    'sales:create': true,
    'sales:update': true,
    'inventory:read': true,
    'qc:read': true,
    'qc:create': true,
    'exchanges:read': true,
    'exchanges:create': true,
  });

  const togglePermission = (permKey: string) => {
    setPermissionsMap((prev) => ({
      ...prev,
      [permKey]: !prev[permKey],
    }));
  };

  const handleSaveDefaults = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Global permission template for ${selectedRole} updated. All new admins will inherit this matrix.`);
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Lock className="w-7 h-7 text-indigo-600" />
            Master Global Role Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Configure system default permissions (<code className="text-indigo-600 font-mono text-[11px]">GlobalRolePermission</code>) that seed automatically into new tenant admins
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSaveDefaults}
          loading={isSaving}
          className="gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Global Matrix
        </Button>
      </div>

      {/* Role Picker */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500 mr-1" />
          <span className="text-xs font-bold text-slate-600">Select Role Template:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedRole === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GLOBAL_PERMISSION_MODULES.map((group) => (
          <div
            key={group.key}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" />
                {group.module}
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{group.key}:*</span>
            </div>

            <div className="space-y-2">
              {group.permissions.map((perm) => {
                const permKey = `${group.key}:${perm.action}`;
                const isEnabled = !!permissionsMap[permKey];

                return (
                  <div
                    key={permKey}
                    onClick={() => togglePermission(permKey)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isEnabled
                        ? 'border-indigo-500 bg-indigo-50/50'
                        : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/60'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{perm.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{permKey}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isEnabled ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
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

export default SuperAdminGlobalPermissionsPage;
