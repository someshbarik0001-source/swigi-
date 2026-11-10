import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { mockCoupons } from '../../data/mockCoupons';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Sparkles,
  Store,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
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
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (code: string) => {
    applyCoupon(code);
    setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-100 dark:border-slate-800"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Your Cart
                    </h3>
                    {isMultiRestaurant ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                        <span>🏪</span> {restaurantsInCart.length} Restaurants Combined
                      </span>
                    ) : restaurantName ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        from {restaurantName}
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  onClick={closeCartDrawer}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List or Empty state */}
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Your cart is hungry!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mb-6">
                    Add delicious items from your favorite restaurants and treat yourself today.
                  </p>
                  <Button
                    onClick={() => {
                      closeCartDrawer();
                      navigate('/restaurants');
                    }}
                    variant="primary"
                  >
                    Explore Restaurants
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Multi-restaurant batch delivery banner */}
                    {isMultiRestaurant && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200/80 dark:border-orange-800/50 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-bold text-slate-900 dark:text-white">
                            Multi-Restaurant Campus Order Active
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            Courier picks up from all {restaurantsInCart.length} outlets and delivers them together to SRM University AP!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Items grouped by restaurant */}
                    {restaurantGroups.map((group) => (
                      <div key={group.restaurantId} className="space-y-3">
                        {/* Restaurant Header */}
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm">🏪</span>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {group.restaurantName}
                              </h5>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {group.itemCount} item{group.itemCount > 1 ? 's' : ''} • {formatCurrency(group.subtotal)}
                              </span>
                            </div>
                          </div>

                          {isMultiRestaurant && (
                            <button
                              onClick={() => removeRestaurantItems(group.restaurantId)}
                              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title={`Remove all items from ${group.restaurantName}`}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        {/* Items under this restaurant */}
                        <div className="space-y-2.5">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                            >
                              <img
                                src={item.food.image}
                                alt={item.food.name}
                                className="w-16 h-16 rounded-xl object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {item.food.name}
                                </h4>
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                    {item.selectedOptions.map((o) => o.choiceName).join(', ')}
                                  </p>
                                )}
                                <div className="text-xs font-extrabold text-orange-600 dark:text-orange-400 mt-1">
                                  {formatCurrency(item.totalPrice)}
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 p-0.5">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-5 text-center text-xs font-bold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Promo Code Box */}
                    <div className="pt-2">
                      <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/30 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-orange-500" />
                            Have a Promo Code?
                          </span>
                          {coupon && (
                            <button
                              onClick={removeCoupon}
                              className="text-rose-500 hover:underline text-[11px]"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {coupon ? (
                          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
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
                                className="flex-1 bg-white dark:bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none uppercase font-mono"
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

                            {/* Quick suggestions */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {mockCoupons.slice(0, 3).map((c) => (
                                <button
                                  key={c.code}
                                  onClick={() => handleApplyPromo(c.code)}
                                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-colors"
                                >
                                  {c.code}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 shrink-0 space-y-3">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Subtotal</span>
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
                          <span>Discount</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                        <span>Total Due</span>
                        <span className="text-orange-500">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleProceedToCheckout}
                      variant="primary"
                      size="md"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Checkout • {formatCurrency(total)}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
