import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { huffmanCompress } from '../../algorithms';
import {
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Binary,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();

  const order = getOrderById(orderId || '');

  const huffmanData = useMemo(() => {
    if (!order) return null;
    const rawPayload = `TICKET#${order.orderNumber}|STORE:${order.restaurantName}|DROP:${order.deliveryAddress.street}|TOTAL:₹${order.total}|ITEMS:${order.items.map((i) => i.food.name).join('+')}`;
    return huffmanCompress(rawPayload);
  }, [order]);

  // Fire celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#10b981', '#6366f1'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-bold">Order Received!</h2>
        <p className="text-xs text-slate-500">
          Your order has been authorized and queued for preparation.
        </p>
        <Link to="/restaurants">
          <Button variant="primary">Continue to Swigi</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <Badge variant="success" size="md">
          Order Confirmed & Payment Verified
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Woohoo! Meal is on the way!
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          We've sent your order <span className="font-bold text-orange-500">#{order.orderNumber}</span> to{' '}
          <span className="font-bold text-slate-900 dark:text-white">{order.restaurantName}</span>.
          Chef is already firing up the kitchen.
        </p>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => navigate(`/track/${order.id}`)}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-orange-500/25"
            leftIcon={<Clock className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Track Order Live (GPS)
          </Button>

          <Button
            onClick={() => navigate('/restaurants')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Explore More Food
          </Button>
        </div>
      </motion.div>

      {/* Order Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Order Details
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              #{order.orderNumber}
            </h3>
          </div>
          <span className="text-xs text-slate-400">{formatDateTime(order.createdAt)}</span>
        </div>

        {/* Destination & ETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Delivering To</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Estimated Arrival</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-semibold text-emerald-500">
                {order.estimatedDeliveryTime} (Fast Track)
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Purchased Items
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[11px]">
                    {item.quantity}x
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.food.name}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials Breakdown */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Taxes</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Voucher Savings</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
            <span>Paid via {order.paymentMethod.toUpperCase()}</span>
            <span className="text-orange-500">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* DAA Huffman Coding Network Transmission Verification Card */}
      {huffmanData && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                DAA
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Huffman Encoded Order Transmission Packet
                  <span className="text-[10px] font-mono text-amber-500 font-bold">O(n log n)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Transmitted across SRM AP Campus Wi-Fi using greedy variable-length prefix codes
                </p>
              </div>
            </div>

            <Link
              to="/algorithms"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
            >
              DAA Lab Visualizer →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Original Size</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{huffmanData.originalBits} bits</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[10px] text-amber-600 block">Compressed Size</span>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">{huffmanData.compressedBits} bits</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] text-emerald-600 block">Bandwidth Saved</span>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">+{huffmanData.compressionRatioPct}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[10px] text-indigo-600 block">Reconstruction</span>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">100% Lossless</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-900 text-amber-400 font-mono text-[10px] rounded-xl truncate border border-slate-800">
            {huffmanData.encodedBitstring}
          </div>
        </div>
      )}
    </div>
  );
};

