import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { mockRestaurants } from '../../data/mockRestaurants';
import { mockFoods } from '../../data/mockFoods';
import { mockUsers } from '../../data/mockUsers';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Store,
  Users,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Bike,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 184250.0;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  // Chart data simulation (weekly revenue in INR)
  const weeklyData = [
    { day: 'Mon', revenue: 24200, orders: 184 },
    { day: 'Tue', revenue: 28500, orders: 212 },
    { day: 'Wed', revenue: 31000, orders: 240 },
    { day: 'Thu', revenue: 29800, orders: 225 },
    { day: 'Fri', revenue: 45450, orders: 380 },
    { day: 'Sat', revenue: 58200, orders: 460 },
    { day: 'Sun', revenue: 51900, orders: 410 },
  ];

  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Control Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Platform Analytics & Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time insights across restaurant partners, delivery fleet, and orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/orders">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Live Orders ({activeOrdersCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. OVERVIEW METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Revenue */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gross Volume
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last week</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {orders.length}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-orange-500 font-bold mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeOrdersCount} in preparation or delivery</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Partner Restaurants */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Partner Kitchens
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {mockRestaurants.length}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
              <span>{mockFoods.length} active menu items</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Registered Customers */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Diners
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              42,890
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>96.4% satisfaction score</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REVENUE ANALYTICS BAR CHART & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chart Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Revenue Velocity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily sales totals and fulfillment volume.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                Peak Day: Saturday (₹58,200)
              </Badge>
            </div>
          </div>

          {/* Bar Chart Graphic */}
          <div className="pt-6">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 dark:border-slate-800 pb-2">
              {weeklyData.map((d) => {
                const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none mb-1 shadow-md">
                      {formatCurrency(d.revenue)}
                    </div>
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden h-full flex flex-col justify-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-orange-600 to-amber-500 rounded-t-xl group-hover:from-orange-500 group-hover:to-amber-400 transition-all duration-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-orange-500 transition-colors">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performing Categories & Live Fleet */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Fleet Delivery Efficiency
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Average Preparation Time</span>
                <span className="font-extrabold text-slate-900 dark:text-white">14.2 mins</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Average Courier Transit</span>
                <span className="font-extrabold text-slate-900 dark:text-white">11.8 mins</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">On-Time Arrival Rate</span>
                <span className="font-extrabold text-emerald-500">98.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Riders on Street</span>
                <span className="font-extrabold text-orange-500">28 Couriers</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <h4 className="text-sm font-black">Swigi AI Dispatcher</h4>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Automated route optimization has reduced order delivery time by 6.4 minutes across all
              metropolitan zones.
            </p>
          </div>
        </div>
      </div>

      {/* 3. RECENT ORDERS TABLE SNIPPET */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Order Activity
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <span>View All Management Table</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-orange-500">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    {order.userName}
                  </td>
                  <td className="px-4 py-3">{order.restaurantName}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                      className="capitalize"
                    >
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/track/${order.id}`}
                      className="text-orange-500 hover:underline font-bold"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

