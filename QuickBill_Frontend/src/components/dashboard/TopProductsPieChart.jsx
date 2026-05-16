import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] text-white px-3 py-2 rounded-lg text-sm shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-indigo-300">{payload[0].value} units sold</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        {entry.value}
      </div>
    ))}
  </div>
);

export default function TopProductsPieChart({ data }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
      <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Top Selling Products</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
