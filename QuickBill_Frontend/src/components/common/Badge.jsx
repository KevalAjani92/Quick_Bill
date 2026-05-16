import React from 'react';

const variantStyles = {
  success: 'bg-[var(--color-success-light)] text-[var(--color-success-dark)]',
  warning: 'bg-[var(--color-warning-light)] text-amber-700',
  danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger-dark)]',
  info: 'bg-[var(--color-info-light)] text-blue-700',
  default: 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}
