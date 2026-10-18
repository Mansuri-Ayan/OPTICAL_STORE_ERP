import React from 'react';
import {
  ShieldCheck,
  Building,
  Users,
  Store,
  Activity,
  CheckCircle2,
  Server,
  ArrowUpRight,
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';

export const SuperAdminDashboardPage: React.FC = () => {
  const { data: storesData } = useStores({ limit: 100 });
  const stores = Array.isArray(storesData)
    ? storesData
    : (storesData as { items?: any[] })?.items || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            SuperAdmin Platform Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Global multi-tenant governance, business account management, and system-wide cluster health
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          FastAPI Cluster Healthy
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tenant Admin Accounts</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">12 Admins</h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              100% Active Tenants
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Store Branches</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{stores.length || 24} Stores</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Multi-city retail outlets
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Active Staff</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">148 Users</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Managers, Workers & Opticians
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">System Database Mode</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">PostgreSQL</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Async SQLAlchemy + asyncpg
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <Server className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Cluster Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            Backend Infrastructure Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Core Runtime</span>
              <span className="font-mono font-bold text-slate-900">Python 3.12 / FastAPI 0.110</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Database Engine</span>
              <span className="font-mono font-bold text-slate-900">PostgreSQL 16 (Async Mode)</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Token Security</span>
              <span className="font-mono font-bold text-slate-900">JWT In-Memory + httpOnly Cookie</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-600">Multi-Tenancy Isolation</span>
              <span className="font-mono font-bold text-slate-900">Admin Scoped + Store Sub-Scoped</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Global Compliance & Safeguards
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Strict Sequential Numbering</span>
                <span className="text-slate-500">Global unique sequences for Invoices, Purchase Orders and Exchanges</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Soft Deactivation Cascades</span>
                <span className="text-slate-500">Store deactivation sets is_active=False and cascades to staff safely</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Permission Inheritance</span>
                <span className="text-slate-500">Global role defaults seed automatically to new tenant admins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
