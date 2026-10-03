import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700 shadow-glow',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
  outline: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg font-semibold'
};

export const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  asMotion = true,
  children,
  ...props 
}, ref) => {
  const Component = asMotion ? motion.button : 'button';
  const motionProps = asMotion ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';
