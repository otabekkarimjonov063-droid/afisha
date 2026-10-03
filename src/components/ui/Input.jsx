import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          error && 'border-coral-500 focus:ring-coral-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-coral-500 font-medium">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
