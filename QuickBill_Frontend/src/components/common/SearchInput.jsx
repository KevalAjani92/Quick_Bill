import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--color-border)] bg-white pl-10 pr-4 py-2.5 text-sm
          placeholder:text-[var(--color-text-muted)] outline-none
          focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100
          transition-all duration-200"
      />
    </div>
  );
}
