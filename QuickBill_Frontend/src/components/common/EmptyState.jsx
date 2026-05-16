import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title = 'No data found', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="p-4 bg-[var(--color-surface-hover)] rounded-2xl mb-4">
        <Icon className="w-10 h-10 text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">{description}</p>}
    </div>
  );
}
