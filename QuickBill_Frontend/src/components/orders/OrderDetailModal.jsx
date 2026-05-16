import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function OrderDetailModal({ isOpen, onClose, order }) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order ${order.invoiceNumber}`} size="lg">
      <div className="space-y-5">
        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Status</p>
            <Badge variant={order.orderStatus === 'completed' ? 'success' : 'danger'} className="mt-1">
              {order.orderStatus === 'completed' ? 'Completed' : 'Cancelled'}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Date</p>
            <p className="text-sm font-medium mt-1">{formatDateTime(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Customer</p>
            <p className="text-sm font-medium mt-1">{order.customerName || 'Walk-in'}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Payment</p>
            <p className="text-sm font-medium mt-1 capitalize">{order.paymentMethod}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-[var(--color-surface-hover)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">Product</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">Qty</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">Price</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{item.productNameSnapshot}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-56 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Tax</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-[var(--color-border)]">
              <span>Grand Total</span>
              <span className="text-[var(--color-primary)]">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
