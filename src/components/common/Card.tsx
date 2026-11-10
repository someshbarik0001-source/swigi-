import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline' | 'flat';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  ...props
}) => {
  const variants = {
    default:
      'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm shadow-slate-200/50 dark:shadow-none',
    glass: 'glass-card shadow-glass dark:shadow-glass-dark',
    outline: 'border border-slate-200 dark:border-slate-800 bg-transparent',
    flat: 'bg-slate-50 dark:bg-slate-900/60',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200 overflow-hidden',
        variants[variant],
        hoverable &&
          'hover:-translate-y-1 hover:shadow-card-hover dark:hover:border-slate-700/80 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

