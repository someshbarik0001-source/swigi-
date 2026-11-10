import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { useLocation } from '../../context/LocationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  User as UserIcon,
  MapPin,
  CreditCard,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Sun,
  LogOut,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const { user, updateProfile, addAddress, deleteAddress, setDefaultAddress, addPaymentMethod, deletePaymentMethod, logout } = useAuth();
  const { deviceLocation } = useLocation();
  const { orders } = useOrders();
  const { success, warning } = useToast();
  const navigate = useNavigate();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Add Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('New York');
  const [addrState, setAddrState] = useState('NY');
  const [addrZip, setAddrZip] = useState('10001');

  // Add Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pmType, setPmType] = useState<'card' | 'upi'>('card');
  const [pmTitle, setPmTitle] = useState('');
  const [pmDetails, setPmDetails] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, email, phone });
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim()) return;

    await addAddress({
      label: addrLabel,
      street: addrStreet.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      zipCode: addrZip.trim(),
      isDefault: false,
    });

    setIsAddressModalOpen(false);
    setAddrStreet('');
    success('Address saved to your profile');
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pmTitle.trim() || !pmDetails.trim()) return;

    await addPaymentMethod({
      type: pmType,
      title: pmTitle.trim(),
      details: pmDetails.trim(),
      isDefault: false,
    });

    setIsPaymentModalOpen(false);
    setPmTitle('');
    setPmDetails('');
    success('Payment method added');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            }
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-4 border-orange-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {user?.name || 'Alex Rivera'}
              </h1>
              <Badge variant={user?.role === 'admin' ? 'warning' : 'primary'} size="sm">
                {user?.role === 'admin' ? 'Admin' : 'Verified Diner'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.email} • {user?.phone}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-600 p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          {[
            { id: 'profile', label: 'Profile Info', icon: UserIcon },
            { id: 'orders', label: 'Past Orders', icon: ShoppingBag, count: orders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user?.savedAddresses?.length },
            { id: 'payments', label: 'Payment Methods', icon: CreditCard },
            { id: 'settings', label: 'Account Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[420px]">
          {/* TAB 1: PROFILE INFO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your contact details for smooth delivery notifications.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          )}

          {/* TAB 2: PAST ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Past Orders ({orders.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track in-progress deliveries or reorder your favorite meals.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm">No orders yet!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isLive = order.status !== 'delivered' && order.status !== 'cancelled';
                    return (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-xs font-mono font-bold text-orange-500">
                              #{order.orderNumber}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {order.restaurantName}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              {formatDateTime(order.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                order.status === 'delivered'
                                  ? 'success'
                                  : order.status === 'cancelled'
                                  ? 'danger'
                                  : 'warning'
                              }
                              size="sm"
                              className="capitalize font-bold"
                            >
                              {order.status.replace('_', ' ')}
                            </Badge>

                            <Link to={`/track/${order.id}`}>
                              <Button
                                size="sm"
                                variant={isLive ? 'primary' : 'outline'}
                                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                              >
                                {isLive ? 'Track Live' : 'Details'}
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Items line summary */}
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {order.items.map((i) => `${i.quantity}x ${i.food.name}`).join(', ')}
                        </div>

                        <div className="flex items-center justify-between text-xs font-semibold pt-1">
                          <span className="text-slate-400">
                            Delivered to {order.deliveryAddress.street}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Saved Addresses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage home, office, and secondary drop-off locations.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsAddressModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add New
                </Button>
              </div>

              {/* Default Device Location: SRM AP */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-xs mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Device GPS Location: {deviceLocation.name}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                      {deviceLocation.address} ({deviceLocation.coordinates.latitude}° N, {deviceLocation.coordinates.longitude}° E)
                    </p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  Active Campus Location
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="neutral" size="sm">
                          {addr.label}
                        </Badge>
                        {addr.isDefault ? (
                          <Badge variant="success" size="sm">
                            Default
                          </Badge>
                        ) : (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] text-orange-500 hover:underline font-semibold"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {addr.street}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Saved Payment Methods
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Safe tokenized mock payment credentials.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsPaymentModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Card/UPI
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {pm.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono">{pm.details}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => deletePaymentMethod(pm.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  App Settings & Preferences
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Customize theme, notifications, and diet filtering.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {/* Theme indicator */}
                <div className="pt-3 first:pt-0 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Display Theme
                    </span>
                    <span className="text-slate-400">
                      Standard crisp daylight theme active across SRM AP campus portal
                    </span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-600 font-bold flex items-center gap-1.5 text-xs border border-orange-200">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Daylight Mode</span>
                  </div>
                </div>

                {/* Notifications toggle */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Order Status SMS Alerts
                    </span>
                    <span className="text-slate-400">Receive live courier updates via SMS</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </div>

                {/* Secret Promo drops */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Chef Promo & Discount Drops
                    </span>
                    <span className="text-slate-400">Get notified of 20% off weekend vouchers</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add Delivery Address"
        size="md"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4">
          <div className="flex gap-2">
            {(['Home', 'Work', 'Other'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setAddrLabel(l)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                  addrLabel === l
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Input
            label="Street Address"
            value={addrStreet}
            onChange={(e) => setAddrStreet(e.target.value)}
            required
            placeholder="e.g. 742 Evergreen Terrace"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input label="City" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required />
            <Input label="State" value={addrState} onChange={(e) => setAddrState(e.target.value)} required />
            <Input label="Zip" value={addrZip} onChange={(e) => setAddrZip(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD PAYMENT MODAL */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Add Payment Option"
        size="md"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <Input
            label="Method Name"
            value={pmTitle}
            onChange={(e) => setPmTitle(e.target.value)}
            placeholder="e.g. Chase Sapphire or Google Pay"
            required
          />
          <Input
            label="Details / Masked Number"
            value={pmDetails}
            onChange={(e) => setPmDetails(e.target.value)}
            placeholder="•••• 4821 or user@okhdfc"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Method
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

