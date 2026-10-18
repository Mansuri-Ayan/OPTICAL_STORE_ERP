import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  ArrowRightLeft,
  Glasses,
  BarChart3,
  Barcode,
  Archive,
  ShieldAlert,
  Microscope,
  Wrench,
  Users,
  Truck,
  ShoppingBag,
  BookOpen,
  CreditCard,
  TrendingUp,
  FileSpreadsheet,
  Store,
  UserCog,
  Shield,
  FileText,
  Gift,
  Settings,
  ShieldCheck,
  Building,
  Globe,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  ShoppingCart,
  Sparkles: ShoppingCart, // Fallback for legacy reference
  Receipt,
  ArrowRightLeft,
  Glasses,
  BarChart3,
  Barcode,
  Archive,
  ShieldAlert,
  Microscope,
  Wrench,
  Users,
  Truck,
  ShoppingBag,
  BookOpen,
  CreditCard,
  TrendingUp,
  FileSpreadsheet,
  Store,
  UserCog,
  Shield,
  FileText,
  Gift,
  Settings,
  ShieldCheck,
  Building,
  Globe,
  Lock,
  Layers,
};

interface NavIconProps {
  name: string;
  className?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ name, className }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} />;
};

export default NavIcon;
