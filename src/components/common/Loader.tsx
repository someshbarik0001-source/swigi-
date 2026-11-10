import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullScreen = false,
  text,
  className,
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            'rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin',
            sizes[size]
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center text-orange-500">
          <UtensilsCrossed className="w-1/2 h-1/2 animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

