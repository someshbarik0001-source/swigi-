import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'border-slate-200 dark:border-slate-800 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

