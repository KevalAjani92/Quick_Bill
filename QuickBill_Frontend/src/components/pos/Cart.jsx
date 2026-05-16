import React from 'react';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore((s) => s.getSubtotal());
  const tax = useCartStore((s) => s.getTax());
  const grandTotal = useCartStore((s) => s.getGrandTotal());

  const handleQty = (productId, newQty) => {
    const result = updateQuantity(productId, newQty);
    if (!result.success) toast.error(result.message);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-indigo-50 rounded-2xl mb-3">
          <ShoppingBag className="w-8 h-8 text-[var(--color-primary)]" />
        </div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Cart is empty</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Add products from the left panel</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 p-3 bg-[var(--color-surface-hover)] rounded-xl">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{item.productNameSnapshot}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{formatCurrency(item.unitPrice)} each</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQty(item.productId, item.quantity - 1)}
                className="p-1 rounded-md bg-white border border-[var(--color-border)] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => handleQty(item.productId, item.quantity + 1)}
                className="p-1 rounded-md bg-white border border-[var(--color-border)] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] w-20 text-right">{formatCurrency(item.lineTotal)}</p>
            <button
              onClick={() => removeItem(item.productId)}
              className="p-1 rounded-md hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-[var(--color-border)] pt-4 mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Tax (5%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-dashed border-[var(--color-border)]">
          <span>Grand Total</span>
          <span className="text-[var(--color-primary)]">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
