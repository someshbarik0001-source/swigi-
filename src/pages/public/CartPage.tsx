import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { mockCoupons } from '../../data/mockCoupons';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Store,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    removeItem,
    removeRestaurantItems,
    updateQuantity,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    restaurantName,
    restaurantsInCart,
    restaurantGroups,
    isMultiRestaurant,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (code: string) => {
    applyCoupon(code);
    setPromoInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="Your shopping cart is empty"
          description="Looks like you haven't added any appetizing meals yet. Explore our top restaurants to fill your box!"
          actionText="Browse Restaurants"
          onAction={() => navigate('/restaurants')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Order Review
            </h1>
            {isMultiRestaurant && (
              <Badge variant="warning" size="md" className="bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300 font-extrabold">
                {restaurantsInCart.length} Restaurants Combined
              </Badge>
            )}
          </div>
          {isMultiRestaurant ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Items from: {restaurantsInCart.map((r) => r.name).join(' • ')}
            </p>
          ) : restaurantName ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Items from <b className="text-orange-500">{restaurantName}</b>
            </p>
          ) : null}
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 self-start sm:self-auto flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Whole Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-restaurant banner */}
          {isMultiRestaurant && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200/80 dark:border-orange-800/50 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Multi-Restaurant Campus Batch Order Active
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  You are ordering dishes across <b>{restaurantsInCart.length} different restaurants</b>. Our courier will execute a batched route pickup and deliver everything together to your SRM AP hostel or campus gate!
                </p>
              </div>
            </div>
          )}

          {/* Grouped by restaurant */}
          {restaurantGroups.map((group) => (
            <div
              key={group.restaurantId}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              {/* Restaurant Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-base">
                    🏪
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {group.restaurantName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {group.itemCount} item{group.itemCount > 1 ? 's' : ''} in cart
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subtotal: <span className="text-orange-600 dark:text-orange-400">{formatCurrency(group.subtotal)}</span>
                  </span>
                  {isMultiRestaurant && (
                    <button
                      onClick={() => removeRestaurantItems(group.restaurantId)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title={`Remove all items from ${group.restaurantName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Items in this restaurant */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {group.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.food.isVeg ? 'veg' : 'non-veg'} size="sm">
                          {item.food.isVeg ? 'Veg' : 'Non-Veg'}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.food.name}
                        </span>
                      </div>

                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.selectedOptions.map((o) => o.choiceName).join(', ')}
                        </p>
                      )}

                      <div className="text-sm font-extrabold text-orange-600 dark:text-orange-400 mt-1">
                        {formatCurrency(item.totalPrice)}
                        <span className="text-xs text-slate-400 font-normal ml-2">
                          ({formatCurrency(item.itemPrice)} each)
                        </span>
                      </div>
                    </div>

                    {/* Quantity and delete */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Promo Code & Price Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Promo Code Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-orange-500" />
                Special Discount Coupon
              </span>
              {coupon && (
                <button
                  onClick={removeCoupon}
                  className="text-rose-500 hover:underline text-xs"
                >
                  Remove
                </button>
              )}
            </div>

            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {coupon.code} applied!
                  </span>
                </div>
                <Badge variant="success" size="sm">
                  Saved {formatCurrency(discount || (coupon.code === 'FREEDEL' ? 20 : 0))}
                </Badge>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. TASTY20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 dark:bg-slate-800/60 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none uppercase font-mono"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApplyPromo(promoInput)}
                    disabled={!promoInput.trim()}
                  >
                    Apply
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {mockCoupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyPromo(c.code)}
                      className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Bill Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Item Subtotal ({items.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Campus Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-500 font-bold">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Restaurant GST (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Voucher Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-orange-500">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-orange-500/25 text-base"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Proceed to Checkout
            </Button>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Safe and secure payments with instant campus order routing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
