import React from 'react';
import { Eye, FileText, XCircle } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function OrdersTable({ orders, onViewDetails, onViewInvoice, onCancel }) {
  if (orders.length === 0) {
    return <EmptyState title="No orders found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
              <th className="text-left px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Invoice #</th>
              <th className="text-left px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Customer</th>
              <th className="text-right px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Total</th>
              <th className="text-center px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="text-center px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="px-5 py-4 font-mono text-xs font-medium text-[var(--color-primary)]">{order.invoiceNumber}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-[var(--color-text-primary)]">{order.customerName || 'Walk-in'}</p>
                  {order.customerPhone && <p className="text-xs text-[var(--color-text-muted)]">{order.customerPhone}</p>}
                </td>
                <td className="px-5 py-4 text-right font-semibold text-[var(--color-text-primary)]">{formatCurrency(order.grandTotal)}</td>
                <td className="px-5 py-4 text-center">
                  <Badge variant={order.orderStatus === 'completed' ? 'success' : 'danger'}>
                    {order.orderStatus === 'completed' ? 'Completed' : 'Cancelled'}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)] text-sm hidden md:table-cell">{formatDateTime(order.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onViewDetails(order)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-[var(--color-primary)] transition-colors cursor-pointer" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onViewInvoice(order)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors cursor-pointer" title="View Invoice">
                      <FileText className="w-4 h-4" />
                    </button>
                    {order.orderStatus === 'completed' && (
                      <button onClick={() => onCancel(order)} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--color-danger)] transition-colors cursor-pointer" title="Cancel Order">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
