import React from 'react';
import { cn } from '../../utils/helpers';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mb-4 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};

