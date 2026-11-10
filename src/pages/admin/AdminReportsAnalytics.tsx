import React from 'react';
import { mockRestaurants } from '../../data/mockRestaurants';
import { mockFoods } from '../../data/mockFoods';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Download,
  TrendingUp,
  Award,
  Sparkles,
  BarChart,
  PieChart,
  DollarSign,
  FileText,
} from 'lucide-react';

export const AdminReportsAnalytics: React.FC = () => {
  const { success } = useToast();

  const handleExportCsv = () => {
    success('Monthly financial statement generated and downloaded (CSV).', 'Export Complete');
  };

  const topDishes = mockFoods.slice(0, 5);
  const topRestaurants = mockRestaurants.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Financial Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Sales Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into dish margins, restaurant commission payouts, and growth metrics.
          </p>
        </div>

        <Button
          onClick={handleExportCsv}
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV Report
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Platform Commissions (15%)
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(19267.5)}
          </h3>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +14.2% month-over-month
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Order Value (AOV)
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            ₹185.00
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Based on 3,690 orders this month
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Repeat Diner Ratio
          </span>
          <h3 className="text-2xl font-black text-orange-500">
            72.4%
          </h3>
          <span className="text-xs text-emerald-600 font-bold">
            Industry leading loyalty
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Dishes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              <span>Top 5 Best-Selling Dishes</span>
            </h3>
            <Badge variant="primary" size="sm">Volume</Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
            {topDishes.map((food, idx) => (
              <div key={food.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-slate-400">#{idx + 1}</span>
                  <img src={food.image} alt={food.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{food.name}</span>
                    <span className="text-[11px] text-slate-400">{food.restaurantName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    {formatCurrency(food.price * (120 - idx * 15))}
                  </span>
                  <span className="text-[10px] text-slate-400">{120 - idx * 15} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Grossing Partner Kitchens */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Highest Grossing Kitchens</span>
            </h3>
            <Badge variant="success" size="sm">Earnings</Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
            {topRestaurants.map((rest, idx) => (
              <div key={rest.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-slate-400">#{idx + 1}</span>
                  <img src={rest.image} alt={rest.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{rest.name}</span>
                    <span className="text-[11px] text-slate-400">{rest.cuisines.join(', ')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    {formatCurrency(34200 - idx * 6200)}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold">{rest.rating} ★ Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

