import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
};

