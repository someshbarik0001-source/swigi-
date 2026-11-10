import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mb-6 shadow-inner">
        <UtensilsCrossed className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 dark:text-white">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">
        The dining route you followed seems to have evaporated. Let's get you back to delicious meals!
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return Home
        </Button>
      </Link>
    </div>
  );
};

