import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-sm',
  secondary: 'bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-100)] text-[var(--color-primary)] ',
  danger: 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-dark)] text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]',
  outline: 'bg-white border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] shadow-sm',
  success: 'bg-[var(--color-success)] hover:bg-[var(--color-success-dark)] text-white shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
}
