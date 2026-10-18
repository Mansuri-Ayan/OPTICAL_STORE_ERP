import { useState, useCallback, useMemo } from 'react';
import { NavItemConfig, SidebarCustomizationConfig } from '@/types/navigation.types';
import { getCookie, setCookie, deleteCookie } from '@/utils/cookies';

const COOKIE_NAME = 'optical_sidebar_config';
const CONFIG_VERSION = 1;

export const DEFAULT_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    category: 'Daily Shortcuts',
    isVisible: true,
    isBottomBar: true,
    order: 0,
  },
  {
    id: 'pos',
    name: 'New Bill / Billing POS',
    href: '/pos',
    iconName: 'ShoppingCart',
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    category: 'Daily Shortcuts',
    isVisible: true,
    isBottomBar: true,
    order: 1,
  },
  {
    id: 'sales',
    name: 'Sales Bills & Invoices',
    href: '/sales',
    iconName: 'Receipt',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    category: 'Billing & Sales',
    isVisible: true,
    isBottomBar: true,
    order: 2,
  },
  {
    id: 'exchanges',
    name: 'Exchanges & Returns',
    href: '/exchanges',
    iconName: 'ArrowRightLeft',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    category: 'Billing & Sales',
    isVisible: true,
    isBottomBar: false,
    order: 3,
  },
  {
    id: 'products',
    name: 'Frames, Lenses & Catalog',
    href: '/products',
    iconName: 'Glasses',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    category: 'Frames & Lenses (Stock)',
    isVisible: true,
    isBottomBar: false,
    order: 4,
  },
  {
    id: 'inventory',
    name: 'Stock Quantities',
    href: '/inventory',
    iconName: 'BarChart3',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
    category: 'Frames & Lenses (Stock)',
    isVisible: true,
    isBottomBar: true,
    order: 5,
  },
  {
    id: 'manage-units',
    name: 'Print Barcode Stickers (50x25)',
    href: '/manage-units',
    iconName: 'Barcode',
    iconColor: 'text-slate-700',
    iconBg: 'bg-slate-100',
    category: 'Frames & Lenses (Stock)',
    isVisible: true,
    isBottomBar: false,
    order: 6,
  },
  {
    id: 'deadstock',
    name: 'Deadstock (Slow Moving)',
    href: '/deadstock',
    iconName: 'Archive',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    category: 'Frames & Lenses (Stock)',
    isVisible: true,
    isBottomBar: false,
    order: 7,
  },
  {
    id: 'labs',
    name: 'Lab Fitting Orders',
    href: '/labs',
    iconName: 'Microscope',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    category: 'Prescriptions & QC',
    isVisible: true,
    isBottomBar: false,
    order: 8,
  },
  {
    id: 'damaged-items',
    name: 'Damaged / Issue Stock',
    href: '/damaged-items',
    iconName: 'ShieldAlert',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    category: 'Prescriptions & QC',
    isVisible: true,
    isBottomBar: false,
    order: 9,
  },
  {
    id: 'repairs',
    name: 'Frame Repairs',
    href: '/repairs',
    iconName: 'Wrench',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    category: 'Prescriptions & QC',
    isVisible: true,
    isBottomBar: false,
    order: 10,
  },
  {
    id: 'customers',
    name: 'Customers & Rx Power',
    href: '/customers',
    iconName: 'Users',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    category: 'Customers & Vendors',
    isVisible: true,
    isBottomBar: false,
    order: 11,
  },
  {
    id: 'suppliers',
    name: 'Suppliers',
    href: '/suppliers',
    iconName: 'Truck',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
    category: 'Customers & Vendors',
    isVisible: true,
    isBottomBar: false,
    order: 12,
  },
  {
    id: 'purchase-orders',
    name: 'Purchase Orders',
    href: '/purchase-orders',
    iconName: 'ShoppingBag',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    category: 'Customers & Vendors',
    isVisible: true,
    isBottomBar: false,
    order: 13,
  },
  {
    id: 'dues',
    name: 'Customer Pending Dues',
    href: '/accountant/dues',
    iconName: 'CreditCard',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    category: 'Accounts & GST',
    isVisible: true,
    isBottomBar: false,
    order: 14,
  },
  {
    id: 'ledger',
    name: 'Sales Ledger',
    href: '/accountant/ledger',
    iconName: 'BookOpen',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    category: 'Accounts & GST',
    isVisible: true,
    isBottomBar: false,
    order: 15,
  },
  {
    id: 'supplier-payments',
    name: 'Supplier Payments',
    href: '/accountant/suppliers',
    iconName: 'Truck',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    category: 'Accounts & GST',
    isVisible: true,
    isBottomBar: false,
    order: 16,
  },
  {
    id: 'profit-loss',
    name: 'Profit & Loss (P&L)',
    href: '/accountant/profit-loss',
    iconName: 'TrendingUp',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    category: 'Accounts & GST',
    isVisible: true,
    isBottomBar: false,
    order: 17,
  },
  {
    id: 'gst',
    name: 'GST Tax Reports',
    href: '/accountant/gst',
    iconName: 'FileSpreadsheet',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    category: 'Accounts & GST',
    isVisible: true,
    isBottomBar: false,
    order: 18,
  },
  {
    id: 'expenses',
    name: 'Daily Shop Expenses',
    href: '/expenses',
    iconName: 'Receipt',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    category: 'Accounts & GST',
    isVisible: true,
    isBottomBar: false,
    order: 19,
  },
  {
    id: 'stores',
    name: 'Stores & Branches',
    href: '/stores',
    iconName: 'Store',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    category: 'Store Management',
    isVisible: true,
    isBottomBar: false,
    order: 20,
  },
  {
    id: 'staff',
    name: 'Staff Directory',
    href: '/staff',
    iconName: 'UserCog',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    category: 'Store Management',
    isVisible: true,
    isBottomBar: false,
    order: 21,
  },
  {
    id: 'permissions',
    name: 'Role Permissions',
    href: '/permissions',
    iconName: 'Shield',
    iconColor: 'text-slate-700',
    iconBg: 'bg-slate-100',
    category: 'Store Management',
    isVisible: true,
    isBottomBar: false,
    order: 22,
  },
  {
    id: 'bill-template',
    name: 'Bill & Receipt Designer',
    href: '/bill-template',
    iconName: 'FileText',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
    category: 'Store Management',
    isVisible: true,
    isBottomBar: false,
    order: 23,
  },
  {
    id: 'loyalty',
    name: 'Customer Loyalty Points',
    href: '/loyalty',
    iconName: 'Gift',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    category: 'Store Management',
    isVisible: true,
    isBottomBar: false,
    order: 24,
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    iconName: 'Settings',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
    category: 'Store Management',
    isVisible: true,
    isBottomBar: false,
    order: 25,
  },
];

export function useSidebarCustomization() {
  const [items, setItems] = useState<NavItemConfig[]>(() => {
    const rawCookie = getCookie(COOKIE_NAME);
    if (!rawCookie) return DEFAULT_NAV_ITEMS;

    try {
      const parsed: SidebarCustomizationConfig = JSON.parse(rawCookie);
      if (parsed.version !== CONFIG_VERSION || !Array.isArray(parsed.items)) {
        return DEFAULT_NAV_ITEMS;
      }

      // Merge saved preferences with master default list to preserve new routes
      const configMap = new Map(parsed.items.map((i) => [i.id, i]));

      const merged = DEFAULT_NAV_ITEMS.map((item) => {
        const saved = configMap.get(item.id);
        if (saved) {
          return {
            ...item,
            order: saved.order ?? item.order,
            isVisible: saved.isVisible ?? item.isVisible,
            isBottomBar: saved.isBottomBar ?? item.isBottomBar,
          };
        }
        return item;
      });

      return merged.sort((a, b) => a.order - b.order);
    } catch {
      return DEFAULT_NAV_ITEMS;
    }
  });

  // Save current configuration to cookie
  const persistConfig = useCallback((newItems: NavItemConfig[]) => {
    const configToSave: SidebarCustomizationConfig = {
      version: CONFIG_VERSION,
      items: newItems.map((item, index) => ({
        id: item.id,
        order: index,
        isVisible: item.isVisible,
        isBottomBar: item.isBottomBar,
      })),
    };
    setCookie(COOKIE_NAME, JSON.stringify(configToSave), 365);
  }, []);

  // Move item up or down
  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const current = copy[idx];
      const target = copy[targetIdx];
      if (!current || !target) return prev;

      copy[idx] = target;
      copy[targetIdx] = current;

      // Reassign sequential orders
      const updated = copy.map((item, i) => ({ ...item, order: i }));
      persistConfig(updated);
      return updated;
    });
  }, [persistConfig]);

  // Native Drag & Drop reordering
  const reorderDragDrop = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    setItems((prev) => {
      const draggedIdx = prev.findIndex((i) => i.id === draggedId);
      const targetIdx = prev.findIndex((i) => i.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;

      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedIdx, 1);
      if (!draggedItem) return prev;
      copy.splice(targetIdx, 0, draggedItem);

      const updated = copy.map((item, i) => ({ ...item, order: i }));
      persistConfig(updated);
      return updated;
    });
  }, [persistConfig]);

  // Toggle item visibility
  const toggleVisibility = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, isVisible: !item.isVisible };
        }
        return item;
      });
      persistConfig(updated);
      return updated;
    });
  }, [persistConfig]);

  // Toggle bottom bar tab (enforces max 4 items for mobile bottom bar silently without toasts)
  const toggleBottomBar = useCallback((id: string) => {
    setItems((prev) => {
      const currentSelectedCount = prev.filter((i) => i.isBottomBar).length;
      const target = prev.find((i) => i.id === id);

      if (!target) return prev;
      if (!target.isBottomBar && currentSelectedCount >= 4) {
        return prev;
      }

      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, isBottomBar: !item.isBottomBar };
        }
        return item;
      });

      persistConfig(updated);
      return updated;
    });
  }, [persistConfig]);

  // Reset to default layout
  const resetToDefault = useCallback(() => {
    deleteCookie(COOKIE_NAME);
    setItems(DEFAULT_NAV_ITEMS);
  }, []);

  // Filtered views
  const visibleItems = useMemo(() => items.filter((i) => i.isVisible), [items]);

  // The 4 items chosen for mobile bottom bar
  const bottomBarItems = useMemo(() => {
    const selected = items.filter((i) => i.isBottomBar && i.isVisible);
    if (selected.length === 0) {
      // Fallback to default top 4
      return items.slice(0, 4);
    }
    return selected.slice(0, 4);
  }, [items]);

  // Grouped by category while preserving custom order
  const groupedCategories = useMemo(() => {
    const categoriesMap = new Map<string, NavItemConfig[]>();
    for (const item of visibleItems) {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, []);
      }
      categoriesMap.get(item.category)!.push(item);
    }
    return Array.from(categoriesMap.entries()).map(([label, groupItems]) => ({
      label,
      items: groupItems,
    }));
  }, [visibleItems]);

  return {
    items,
    visibleItems,
    bottomBarItems,
    groupedCategories,
    moveItem,
    reorderDragDrop,
    toggleVisibility,
    toggleBottomBar,
    resetToDefault,
  };
}
