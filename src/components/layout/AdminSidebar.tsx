import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Utensils,
  Users,
  Ticket,
  Bike,
  BarChart3,
  Settings,
  ArrowLeft,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Restaurants', path: '/admin/restaurants', icon: Store },
    { label: 'Food Items', path: '/admin/foods', icon: Utensils },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Delivery Riders', path: '/admin/delivery', icon: Bike },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/swigi-logo.png"
              alt="Swigi"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div>
              <span className="text-xl font-black text-white tracking-tight leading-none block">
                Swigi
              </span>
              <span className="text-[10px] block font-bold text-orange-400 tracking-wider uppercase mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: Return to public app */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Return to Swigi App</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

