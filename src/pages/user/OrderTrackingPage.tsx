import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { mockOrders } from '../../data/mockOrders';
import { CampusLiveMap } from '../../components/map/CampusLiveMap';
import {
  Bike,
  Phone,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  FastForward,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, orders, simulateNextStage } = useOrders();

  // If specific orderId requested, find it; otherwise fallback to active order, first order, or mock order
  const order =
    getOrderById(orderId || '') ||
    orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') ||
    orders[0] ||
    mockOrders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Clock className="w-16 h-16 text-orange-500 mx-auto" />
        <h2 className="text-xl font-bold">No active orders found</h2>
        <p className="text-xs text-slate-500">
          Place your first meal order to experience real-time live GPS tracking.
        </p>
        <Link to="/restaurants">
          <Button variant="primary">Order Food Now</Button>
        </Link>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/profile?tab=orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Past Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Live Order Tracker
            </h1>
            <Badge
              variant={isDelivered ? 'success' : 'primary'}
              size="md"
              className="capitalize"
            >
              {order.status.replace('_', ' ')}
            </Badge>
            {order.isMultiRestaurant && (
              <Badge variant="warning" size="md" className="font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300">
                Multi-Restaurant Order
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Order #{order.orderNumber} • Placed {formatDateTime(order.createdAt)} • {order.restaurantName}
          </p>
        </div>

        {/* Demo Fast-forward simulation button */}
        <div className="bg-orange-50 dark:bg-orange-950/40 p-2.5 rounded-2xl border border-orange-200 dark:border-orange-800/40 flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block">
              Demo Interactive Simulation
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Advance order life-cycle
            </span>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => simulateNextStage(order.id)}
            disabled={isDelivered}
            leftIcon={<FastForward className="w-4 h-4" />}
          >
            {isDelivered ? 'Completed' : 'Next Stage'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Live Visual Map & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Live Google Maps & OpenStreetMap Campus Delivery Map */}
          <CampusLiveMap order={order} />

          {/* Interactive Timeline Progression */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Live Order Stages
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {order.timeline.map((event, idx) => {
                const isCompleted = event.completed;
                const isCurrent = event.current;

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Status Dot */}
                    <div
                      className={`absolute -left-6 mt-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? 'bg-emerald-500 border-white dark:border-slate-900 text-white'
                          : isCurrent
                          ? 'bg-orange-500 border-white dark:border-slate-900 text-white ring-4 ring-orange-500/20 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isCompleted || isCurrent
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {event.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Delivery Partner & Order Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Partner Card */}
          {order.deliveryPartner && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Delivery Courier
              </span>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={order.deliveryPartner.photo}
                    alt={order.deliveryPartner.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {order.deliveryPartner.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{order.deliveryPartner.rating} Star Rider</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {order.deliveryPartner.vehicleNumber}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryPartner.phone}`}
                  className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center hover:bg-orange-100 transition-colors"
                  aria-label="Call Rider"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Current Zone</span>
                <span className="text-slate-900 dark:text-white">
                  {order.deliveryPartner.currentLocationName}
                </span>
              </div>
            </div>
          )}

          {/* Delivery Destination Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Destination
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block text-slate-900 dark:text-white">
                  {order.deliveryAddress.label} • {order.userName}
                </span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                  {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
                {order.specialInstructions && (
                  <p className="text-slate-400 italic mt-1.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                    "{order.specialInstructions}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Receipt */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Summary Receipt
              </h4>
              {order.isMultiRestaurant && (
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full">
                  Multi-Outlet Dispatch
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {(() => {
                const groupMap = new Map<string, { name: string; items: typeof order.items; subtotal: number }>();
                order.items.forEach((item) => {
                  const restId = item.food.restaurantId;
                  if (!groupMap.has(restId)) {
                    groupMap.set(restId, {
                      name: item.food.restaurantName || order.restaurantName,
                      items: [],
                      subtotal: 0,
                    });
                  }
                  const g = groupMap.get(restId)!;
                  g.items.push(item);
                  g.subtotal += item.totalPrice;
                });
                const groups = Array.from(groupMap.values());

                return groups.map((g, idx) => (
                  <div key={idx} className="space-y-1.5 pt-2 first:pt-0">
                    {groups.length > 1 && (
                      <div className="flex items-center justify-between text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-950/30 px-2.5 py-1 rounded-lg">
                        <span>🏪 {g.name}</span>
                        <span>{formatCurrency(g.subtotal)}</span>
                      </div>
                    )}
                    {g.items.map((item) => (
                      <div key={item.id} className="flex justify-between pl-1">
                        <span>
                          {item.quantity}x {item.food.name}
                        </span>
                        <span className="font-bold">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-orange-500">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

