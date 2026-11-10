import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Order En Route to Ganga Hostel! 🛵',
    message: 'Naresh is cycling near SAC with your Biryanis and More order #ORD-948201. ETA 6 mins.',
    type: 'order',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    link: '/track/ord-live-001',
  },
  {
    id: 'notif-2',
    title: 'SRM AP Special: ₹50 Flat Off! 🎉',
    message: 'Use code SRMAP50 on meals above ₹199. Valid across all campus food stalls today.',
    type: 'offer',
    read: false,
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    link: '/restaurants',
  },
  {
    id: 'notif-3',
    title: 'Order Delivered! 🍜',
    message: 'Your midnight order #ORD-817290 from Midnight Maggi Adda was delivered at Ganga Hostel.',
    type: 'order',
    read: true,
    timestamp: '2026-11-06T23:47:00Z',
    link: '/profile?tab=orders',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialNotifications;
      }
    }
    return initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

