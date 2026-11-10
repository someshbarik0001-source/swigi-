import React from 'react';
import { cn } from '../../utils/helpers';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer',
        className
      )}
    />
  );
};

export const RestaurantCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
    <Skeleton className="h-44 w-full rounded-xl" />
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-5 w-12 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const FoodCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex gap-4">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-16 rounded-md" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-6 w-20 mt-2" />
    </div>
    <div className="shrink-0 flex flex-col items-center gap-2">
      <Skeleton className="h-28 w-28 rounded-2xl" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
  </div>
);

