import React, { useState } from 'react';
import { mockCoupons } from '../../data/mockCoupons';
import { Coupon } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { Ticket, Plus, Tag, Sparkles } from 'lucide-react';

export const AdminCouponsManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('flat');
  const [discountValue, setDiscountValue] = useState(50);
  const [minOrder, setMinOrder] = useState(199);
  const [description, setDescription] = useState('');

  const { success } = useToast();

  const handleToggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    success('Coupon status toggled');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title,
      discountType,
      discountValue,
      minOrder,
      validTill: '2026-12-31',
      description,
      usageCount: 0,
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
    setCode('');
    setTitle('');
    success(`Promo voucher "${newCoupon.code}" created!`);
  };

  const columns: Column<Coupon>[] = [
    {
      header: 'Promo Code & Title',
      cell: (row) => (
        <div>
          <span className="font-mono font-black text-sm text-orange-500 block">
            {row.code}
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      header: 'Discount Rule',
      cell: (row) => (
        <div className="text-xs">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {row.discountType === 'percentage'
              ? `${row.discountValue}% OFF`
              : `${formatCurrency(row.discountValue)} FLAT OFF`}
          </span>
          <span className="block text-[11px] text-slate-400">
            Min order {formatCurrency(row.minOrder)}
          </span>
        </div>
      ),
    },
    {
      header: 'Redemptions',
      cell: (row) => <span className="font-bold">{row.usageCount} uses</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'} size="sm">
          {row.isActive ? 'Live / Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <Button
          size="sm"
          variant={row.isActive ? 'outline' : 'primary'}
          onClick={() => handleToggleActive(row.id)}
        >
          {row.isActive ? 'Deactivate' : 'Enable'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Growth & Marketing
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Coupons & Promo Vouchers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure checkout discount codes, minimum basket thresholds, and expiry.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Promo Code
        </Button>
      </div>

      <Table
        columns={columns}
        data={coupons}
        keyExtractor={(row) => row.id}
      />

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
        size="md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Promo Code (e.g. FEAST25)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            placeholder="SUMMER30"
          />

          <Input
            label="Title / Banner Text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="30% Off on Summer Treats"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Rupee (₹)</option>
              </select>
            </div>

            <Input
              label="Value (%, or ₹)"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Minimum Basket Size (₹)"
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(Number(e.target.value))}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

