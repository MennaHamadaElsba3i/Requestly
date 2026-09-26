import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-blue-500/30',
  secondary: 'bg-white hover:bg-slate-50/90 active:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300',
  danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-rose-500/30',
  ghost: 'bg-transparent hover:bg-slate-100/80 active:bg-slate-200/60 text-slate-600 hover:text-slate-900 border border-transparent',
  outline: 'bg-transparent hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300/80 shadow-2xs',
};

const SIZES = {
  sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
  md: 'px-3.5 py-1.5 text-sm gap-2 rounded-lg font-medium',
  lg: 'px-4.5 py-2 text-base gap-2.5 rounded-lg font-medium',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center transition-colors cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="spin-animation shrink-0" size={size === 'sm' ? 13 : 15} aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
