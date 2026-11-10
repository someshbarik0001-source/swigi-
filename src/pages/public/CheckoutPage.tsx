import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { Address } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useLocation } from '../../context/LocationContext';
import {
  MapPin,
  Plus,
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    coupon,
    clearCart,
    restaurantName,
    restaurantId,
    restaurantsInCart,
    restaurantGroups,
    isMultiRestaurant,
  } = useCart();
  const { user, addAddress } = useAuth();
  const { deviceLocation } = useLocation();
  const { placeOrder } = useOrders();
  const { error, success } = useToast();
  const navigate = useNavigate();

  // Selected delivery address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return user?.savedAddresses?.find((a) => a.isDefault)?.id || user?.savedAddresses?.[0]?.id || '';
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'cod'>('card');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Add Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('SRM University AP, Amaravati');
  const [newState, setNewState] = useState('Andhra Pradesh');
  const [newZip, setNewZip] = useState('522240');
  const [newLandmark, setNewLandmark] = useState('');

  const currentAddress: Address = {
    id: 'device-srm-ap',
    label: 'Home',
    street: deviceLocation.hostelDefault,
    city: deviceLocation.city,
    state: deviceLocation.state,
    zipCode: deviceLocation.postalCode,
    landmark: deviceLocation.landmark,
    isDefault: true,
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    await addAddress({
      label: newLabel,
      street: newStreet.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      zipCode: newZip.trim(),
      landmark: newLandmark.trim(),
      isDefault: false,
    });

    setIsAddressModalOpen(false);
    setNewStreet('');
    setNewLandmark('');
    success('Delivery address saved successfully');
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      error('Your cart is empty');
      navigate('/restaurants');
      return;
    }

    if (!currentAddress) {
      error('Please select or add a delivery address');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const primaryRestaurantId = restaurantsInCart[0]?.id || restaurantId || 'R014';
      const orderRestaurantName = isMultiRestaurant
        ? restaurantsInCart.map((r) => r.name).join(' & ')
        : restaurantName || 'Biryanis and More';

      const newOrder = await placeOrder({
        userId: user?.id || 'guest',
        userName: user?.name || 'Rohan Varma',
        userPhone: user?.phone || '+91 98480 91823',
        restaurantId: primaryRestaurantId,
        restaurantName: orderRestaurantName,
        restaurantIds: restaurantsInCart.map((r) => r.id),
        restaurantNames: restaurantsInCart.map((r) => r.name),
        isMultiRestaurant,
        restaurantAddress: isMultiRestaurant
          ? `Multi-Restaurant Batch Pickup (${restaurantsInCart.map((r) => r.name).join(', ')})`
          : 'Door No. 6-188, near NRI Hospital, Mangalagiri, AP 522508',
        restaurantImage: items[0]?.food?.image || '',
        items,
        deliveryAddress: currentAddress,
        paymentMethod,
        paymentStatus: 'completed',
        subtotal,
        tax,
        deliveryFee,
        discount,
        couponCode: coupon?.code,
        total,
        specialInstructions,
        estimatedDeliveryTime: isMultiRestaurant ? '20-25 mins (Batch Pickup)' : '10-15 mins',
      });

      clearCart();
      navigate(`/order-success/${newOrder.id}`);
    } catch (err: any) {
      error('Failed to submit order. Please retry.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Almost Ready to Eat
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Finalize Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. DELIVERY ADDRESS SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>1. Delivery Address</span>
              </h3>
            </div>

            {/* Default Device Location: SRM University AP */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 text-sm block">
                    Device Location: {deviceLocation.name}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {deviceLocation.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PAYMENT METHOD SELECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <span>2. Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Credit / Debit Card</h4>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, Amex</p>
                </div>
              </div>

              {/* UPI / Instant Pay */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instant UPI / QR</h4>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Wallet / Apple Pay */}
              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  paymentMethod === 'wallet'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Apple Pay / Wallet</h4>
                  <p className="text-[11px] text-slate-500">One-tap authentication</p>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-500">Pay cash at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SPECIAL DELIVERY NOTES */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Special Delivery Instructions
            </h3>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Call upon reaching Ganga/Yamuna Hostel Gate, leave with hostel guard, keep biryani warm..."
              className="w-full text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Right Side: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Order Summary ({items.length} items)
              </h3>
              {isMultiRestaurant && (
                <Badge variant="warning" size="sm" className="font-extrabold text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300">
                  {restaurantsInCart.length} Outlets Batched
                </Badge>
              )}
            </div>

            {/* Multi-restaurant batch info callout */}
            {isMultiRestaurant && (
              <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/40 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>
                  Courier will collect from <b>{restaurantsInCart.map((r) => r.name).join(' and ')}</b> before dropping off at SRM AP.
                </span>
              </div>
            )}

            {/* Quick items list grouped by restaurant */}
            <div className="max-h-60 overflow-y-auto space-y-3.5 pr-1">
              {restaurantGroups.map((group) => (
                <div key={group.restaurantId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-slate-50 dark:bg-slate-800/70 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="truncate">🏪 {group.restaurantName}</span>
                    <span>{formatCurrency(group.subtotal)}</span>
                  </div>
                  <div className="space-y-1.5 pl-1.5">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-orange-500 shrink-0">{item.quantity}x</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {item.food.name}
                          </span>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Campus Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : formatCurrency(deliveryFee)}</span>
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
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Due</span>
                <span className="text-orange-500">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Safety Guarantee */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Simulated checkout session. No real card will be charged.</span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              isLoading={isPlacingOrder}
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-orange-500/25 text-base"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Place Order • {formatCurrency(total)}
            </Button>
          </div>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add Delivery Address"
        description="Enter your exact drop-off details for speedy courier arrival."
        size="md"
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="flex gap-2">
            {(['Home', 'Work', 'Other'] as const).map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setNewLabel(label)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  newLabel === label
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Input
            label="Street Address & Apt / Suite"
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
            placeholder="e.g. 520 8th Ave, Apt 14"
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="City"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
            />
            <Input
              label="State"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              required
            />
            <Input
              label="Zip Code"
              value={newZip}
              onChange={(e) => setNewZip(e.target.value)}
              required
            />
          </div>

          <Input
            label="Nearby Landmark (Optional)"
            value={newLandmark}
            onChange={(e) => setNewLandmark(e.target.value)}
            placeholder="Opposite Central Library"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

