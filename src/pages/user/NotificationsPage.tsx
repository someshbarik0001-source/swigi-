import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatTimeAgo } from '../../utils/formatters';
import { Bell, CheckCheck, Tag, ShoppingBag, Info, ArrowRight } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'order' | 'offer'>('all');
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Alerts & Activity
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with live courier progress and special dining vouchers.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(['all', 'order', 'offer'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === type
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {type === 'all' ? 'All Alerts' : `${type}s`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No notifications in this tab</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'border-orange-200 bg-orange-50/40 dark:bg-orange-950/20 dark:border-orange-900/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'order'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : n.type === 'offer'
                    ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                {n.type === 'order' ? (
                  <ShoppingBag className="w-5 h-5" />
                ) : n.type === 'offer' ? (
                  <Tag className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {formatTimeAgo(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
              </div>

              {n.link && (
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

