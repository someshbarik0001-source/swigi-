import React from 'react';
import { cn } from '../../utils/helpers';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'
    | 'veg'
    | 'non-veg';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
}) => {
  const variants = {
    default:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    primary:
      'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-200/60 dark:border-orange-800/40',
    success:
      'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
    warning:
      'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
    danger:
      'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40',
    neutral:
      'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-transparent',
    veg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    'non-veg':
      'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border tracking-wide whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {variant === 'veg' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
      )}
      {variant === 'non-veg' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

