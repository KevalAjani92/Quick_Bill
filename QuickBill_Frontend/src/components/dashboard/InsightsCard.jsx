import React from 'react';
import { TrendingUp, Lightbulb, AlertTriangle, Info } from 'lucide-react';

const typeConfig = {
  success: { icon: TrendingUp, bg: 'bg-emerald-50', border: 'border-emerald-100', iconColor: 'text-emerald-500', dot: 'bg-emerald-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-500', dot: 'bg-amber-400' },
  info: { icon: Lightbulb, bg: 'bg-blue-50', border: 'border-blue-100', iconColor: 'text-blue-500', dot: 'bg-blue-400' },
};

export default function InsightsCard({ insights }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Smart Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => {
          const config = typeConfig[insight.type] || typeConfig.info;
          return (
            <div
              key={insight.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${config.bg} border ${config.border} transition-all duration-200 hover:scale-[1.01]`}
            >
              <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
