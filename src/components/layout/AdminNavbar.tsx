import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Management Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
            }
            alt="Admin"
            className="w-8 h-8 rounded-xl object-cover border border-orange-500"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-slate-900 dark:text-white">
              {user?.name || 'Admin User'}
            </span>
            <Badge variant="warning" size="sm">
              Super Admin
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

