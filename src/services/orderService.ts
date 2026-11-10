import { Order, OrderStatus } from '../types';
import { mockOrders } from '../data/mockOrders';
import { simulateNetworkDelay, ApiResponse } from './api';

const STORAGE_KEY = 'foodhub_orders_db';

function getStoredOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders));
    return mockOrders;
  }
  try {
    return JSON.parse(data);
  } catch {
    return mockOrders;
  }
}

function saveStoredOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export const orderService = {
  /**
   * GET /api/orders
   * Future Backend: return await apiClient.get('/orders', { params: { userId } });
   */
  async getOrders(userId?: string): Promise<ApiResponse<Order[]>> {
    await simulateNetworkDelay(200);
    let list = getStoredOrders();
    if (userId) {
      list = list.filter((o) => o.userId === userId);
    }
    return {
      success: true,
      data: list,
    };
  },

  /**
   * GET /api/orders/:id
   * Future Backend: return await apiClient.get(`/orders/${id}`);
   */
  async getOrderById(id: string): Promise<ApiResponse<Order | null>> {
    await simulateNetworkDelay(150);
    const list = getStoredOrders();
    const order = list.find((o) => o.id === id || o.orderNumber === id) || null;
    return {
      success: !!order,
      data: order,
    };
  },

  /**
   * POST /api/orders
   * Future Backend: return await apiClient.post('/orders', orderPayload);
   */
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<ApiResponse<Order>> {
    await simulateNetworkDelay(400);
    const list = getStoredOrders();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${randomNum}`;
    const id = `ord-${Date.now()}`;

    const newOrder: Order = {
      ...orderPayload,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'placed',
      deliveryPartner: {
        id: 'rider-3',
        name: 'Jordan Miller',
        phone: '+1 (555) 678-2345',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        vehicleNumber: 'NY-EV-3021 (Swift Bike)',
        rating: 4.95,
        currentLocationName: 'Kitchen Counter',
        estimatedMinutes: 25,
      },
      timeline: [
        {
          status: 'placed',
          title: 'Order Placed',
          description: 'We received your order and payment was authorized.',
          time: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'confirmed',
          title: 'Restaurant Confirmed',
          description: 'The kitchen is reviewing your meal requests.',
          time: 'Pending',
          completed: false,
        },
        {
          status: 'preparing',
          title: 'Preparing Food',
          description: 'Fresh ingredients being cooked to perfection.',
          time: 'Pending',
          completed: false,
        },
        {
          status: 'on_the_way',
          title: 'Out for Delivery',
          description: 'Courier is en route with your sealed warm bag.',
          time: 'Pending',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Arrived at your doorstep. Bon appétit!',
          time: 'Pending',
          completed: false,
        },
      ],
    };

    list.unshift(newOrder);
    saveStoredOrders(list);

    return {
      success: true,
      data: newOrder,
      message: 'Order placed successfully',
    };
  },

  /**
   * PATCH /api/orders/:id/status
   * Future Backend: return await apiClient.patch(`/orders/${id}/status`, { status });
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    await simulateNetworkDelay(200);
    const list = getStoredOrders();
    const index = list.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');

    const order = list[index];
    order.status = status;

    // Update timeline stages
    const statuses: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
    const currentIdx = statuses.indexOf(status);

    order.timeline = order.timeline.map((event) => {
      const stepIdx = statuses.indexOf(event.status);
      if (stepIdx < currentIdx) {
        return { ...event, completed: true, current: false };
      } else if (stepIdx === currentIdx) {
        return { ...event, completed: true, current: true, time: 'Just now' };
      } else {
        return { ...event, completed: false, current: false };
      }
    });

    list[index] = order;
    saveStoredOrders(list);

    return {
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    };
  },
};

