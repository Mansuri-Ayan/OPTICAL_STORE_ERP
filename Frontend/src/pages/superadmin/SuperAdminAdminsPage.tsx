import React, { useState } from 'react';
import {
  Building,
  Plus,
  Search,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { axiosInstance } from '@/api/axiosInstance';

interface TenantAdmin {
  id: string | number;
  name: string;
  business_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  stores_count?: number;
  created_at: string;
}

export const SuperAdminAdminsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Mock list / real API if backend superadmin endpoint is active
  const [adminsList, setAdminsList] = useState<TenantAdmin[]>([
    {
      id: 1,
      name: 'Rajesh Patel',
      business_name: 'Patel Vision Care Group',
      email: 'rajesh@patelvision.com',
      phone: '+91 98250 11223',
      is_active: true,
      stores_count: 3,
      created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Ananya Sharma',
      business_name: 'Apex Opticians Ltd',
      email: 'ananya@apexoptics.in',
      phone: '+91 98110 44556',
      is_active: true,
      stores_count: 2,
      created_at: '2026-02-01T14:30:00Z',
    },
    {
      id: 3,
      name: 'Vikram Seth',
      business_name: 'Metro Optical Boutique',
      email: 'vikram@metrooptical.com',
      phone: '+91 98450 77889',
      is_active: true,
      stores_count: 1,
      created_at: '2026-03-10T09:15:00Z',
    },
  ]);

  const filteredAdmins = adminsList.filter((admin) => {
    return (
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.business_name || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/auth/register', formData);
      toast.success(`Admin account created for ${formData.business_name}`);
      const newAdmin: TenantAdmin = {
        id: response.data?.user?.id || Date.now(),
        name: formData.name,
        business_name: formData.business_name,
        email: formData.email,
        phone: formData.phone,
        is_active: true,
        stores_count: 0,
        created_at: new Date().toISOString(),
      };
      setAdminsList((prev) => [newAdmin, ...prev]);
      setShowCreateModal(false);
      setFormData({ name: '', business_name: '', email: '', phone: '', password: '' });
    } catch {
      toast.error('Failed to create admin account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdminStatus = (id: string | number) => {
    setAdminsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    );
    toast.success('Admin account status updated');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto font-sans space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building className="w-7 h-7 text-indigo-600" />
            Tenant Business Admins
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage subscribed optical optical business accounts, branch quotas, and system access
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Register New Admin
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by admin name, business name, or email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {filteredAdmins.length} Optical Retail Groups
        </span>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Business / Brand Name</th>
                <th className="py-3 px-4">Admin Principal</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">Stores</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {admin.business_name}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {admin.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <span className="flex items-center gap-1 font-mono text-[11px]">{admin.email}</span>
                    {admin.phone && (
                      <span className="text-[11px] text-slate-400">{admin.phone}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">
                    {admin.stores_count || 1} Branches
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {new Date(admin.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={admin.is_active ? 'success' : 'danger'}>
                      {admin.is_active ? 'ACTIVE' : 'SUSPENDED'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleAdminStatus(admin.id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      {admin.is_active ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Register New Optical Business Admin"
        >
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Business / Retail Brand Name</label>
              <input
                type="text"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="e.g. Vision Express Eye Clinic"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Admin Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address (Login)</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@opticalstore.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Initial Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={isSubmitting}>
                Create Admin Account
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SuperAdminAdminsPage;
