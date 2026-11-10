import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ShoppingBag,
  Bell,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, switchDemoRole } = useAuth();
  const { cartCount, openCartDrawer } = useCart();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass dark:glass-dark border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 group">
              <img
                src="/swigi-logo.png"
                alt="wigi"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0"
              />
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                wigi
              </span>
            </Link>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifDropdownOpen((v) => !v);
                  setIsUserDropdownOpen(false);
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-orange-500" /> Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-orange-500 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setIsNotifDropdownOpen(false);
                          if (n.link) navigate(n.link);
                        }}
                        className={`p-3 rounded-xl transition-colors cursor-pointer text-left ${
                          !n.read
                            ? 'bg-orange-50/50 dark:bg-orange-950/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {n.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotifDropdownOpen(false)}
                      className="text-xs font-semibold text-orange-500 hover:underline"
                    >
                      View all alerts
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-white text-orange-600 text-xs font-black flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* User Profile / Auth Area */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen((v) => !v);
                    setIsNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={
                      user.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-orange-500"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <Badge
                        variant={user.role === 'admin' ? 'warning' : 'primary'}
                        size="sm"
                        className="mt-1.5"
                      >
                        {user.role === 'admin' ? 'SRM AP Dining Operations' : 'SRM AP Student'}
                      </Badge>
                    </div>

                    {/* Fast Demo Role Switcher */}
                    <div className="p-2 my-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        ⚡ Quick Demo Role Switcher
                      </span>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          onClick={() => {
                            switchDemoRole('customer');
                            setIsUserDropdownOpen(false);
                          }}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            user.role === 'customer'
                              ? 'bg-orange-500 text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => {
                            switchDemoRole('admin');
                            setIsUserDropdownOpen(false);
                          }}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-orange-500 text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Dining Admin
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5 pt-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/profile?tab=profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        <span>My Past Orders</span>
                      </Link>

                      <Link
                        to="/track/ord-live-001"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>Live Order Tracking</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 md:hidden"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link
            to="/profile?tab=orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span>Past Orders</span>
          </Link>

          <Link
            to="/track/ord-live-001"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Live Order Tracking</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {isAuthenticated ? (
            <Link
              to="/profile?tab=profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span>My Profile</span>
            </Link>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

