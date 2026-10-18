export interface NavItemConfig {
  id: string;
  name: string;
  href: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
  category: string;
  isVisible: boolean;
  isBottomBar: boolean; // Pinned to mobile bottom bar (max 4 selected)
  order: number;
}

export interface SidebarCustomizationConfig {
  version: number;
  items: {
    id: string;
    order: number;
    isVisible: boolean;
    isBottomBar: boolean;
  }[];
}
