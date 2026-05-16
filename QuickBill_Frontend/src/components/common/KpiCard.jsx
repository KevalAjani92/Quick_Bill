import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
  const colorMap = {
    primary: { bg: 'bg-indigo-50', icon: 'text-[var(--color-primary)]', border: 'border-indigo-100' },
    success: { bg: 'bg-emerald-50', icon: 'text-[var(--color-success)]', border: 'border-emerald-100' },
    warning: { bg: 'bg-amber-50', icon: 'text-[var(--color-accent)]', border: 'border-amber-100' },
    danger: { bg: 'bg-red-50', icon: 'text-[var(--color-danger)]', border: 'border-red-100' },
    info: { bg: 'bg-blue-50', icon: 'text-[var(--color-info)]', border: 'border-blue-100' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ${c.border} border group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}
