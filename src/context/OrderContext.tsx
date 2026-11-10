import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { mockOrders } from '../data/mockOrders';
import { useToast } from './ToastContext';
import { useNotifications } from './NotificationContext';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  placeOrder: (payload: any) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  simulateNextStage: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('foodhub_orders_db');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback to mockOrders
    }
    return mockOrders;
  });
  const [loading, setLoading] = useState(false);
  const { success, info } = useToast();
  const { addNotification } = useNotifications();

  const refreshOrders = useCallback(async () => {
    try {
      const res = await orderService.getOrders();
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') || null;

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const placeOrder = async (orderPayload: any): Promise<Order> => {
    const res = await orderService.createOrder(orderPayload);
    const newOrder = res.data;
    setOrders((prev) => [newOrder, ...prev]);

    addNotification({
      title: 'Order Confirmed! 🍔',
      message: `Your order #${newOrder.orderNumber} from ${newOrder.restaurantName} is confirmed!`,
      type: 'order',
      link: `/track/${newOrder.id}`,
    });

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const res = await orderService.updateOrderStatus(orderId, status);
    const updated = res.data;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    success(`Order #${updated.orderNumber} status changed to ${status.replace('_', ' ').toUpperCase()}`);

    addNotification({
      title: `Order Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: `Order #${updated.orderNumber} is now ${status.replace('_', ' ')}.`,
      type: 'order',
      link: `/track/${updated.id}`,
    });
  };

  const simulateNextStage = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;

    const sequence: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
    const currentIdx = sequence.indexOf(order.status);
    if (currentIdx !== -1 && currentIdx < sequence.length - 1) {
      const nextStatus = sequence[currentIdx + 1];
      updateOrderStatus(orderId, nextStatus);
    } else {
      info('Order is already in its final delivered stage.');
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        loading,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        refreshOrders,
        simulateNextStage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

