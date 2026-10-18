import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';

export const AppShell: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-slate-50/80 text-slate-900 overflow-hidden">
      {/* 1. Desktop Executive White Sidebar (lg+) with embedded Store Switcher, New Bill button, & Width Resizing */}
      <Sidebar />

      {/* 2. Primary Layout Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Slim Mobile Top Header (only rendered on < lg screens) */}
        <Navbar />

        {/* Main Content Area - Full height on desktop, with clearance for mobile bottom bar */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto min-w-0 pb-20 lg:pb-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Persistent Bottom Navigation Bar & 'All Sections' Drawer (< lg screens) */}
      <MobileBottomNav />
    </div>
  );
};

export default AppShell;
