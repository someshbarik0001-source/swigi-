import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Settings, Shield, Bell, DollarSign, Save } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState(12);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(20);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(199);
  const [supportEmail, setSupportEmail] = useState('dining@srmap.edu.in');
  const [supportPhone, setSupportPhone] = useState('+91 86453 55666');

  const { success } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('SRM AP campus dining parameters updated successfully.', 'Settings Saved');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Configurations
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          SRM AP Campus Dining Operations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Adjust campus commission rates, bicycle courier delivery fees, and student support lines.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Financial Parameters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span>Campus Commission & Delivery Pricing</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Stall Commission (%)"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              required
            />
            <Input
              label="Hostel Delivery Fee (₹)"
              type="number"
              value={baseDeliveryFee}
              onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
              required
            />
            <Input
              label="Free Delivery Over (₹)"
              type="number"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Customer Care Contacts */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-orange-500" />
            <span>Campus Dining Support & Escalations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Campus Dining Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
            />
            <Input
              label="Student Helpline Phone"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

