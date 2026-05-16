import React from 'react';
import { Plus, Ban } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-[var(--color-text-muted)]">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
      {products.map((product) => {
        const outOfStock = product.stockQuantity === 0;
        return (
          <button
            key={product.id}
            onClick={() => !outOfStock && onAddToCart(product)}
            disabled={outOfStock}
            className={`
              flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer
              ${outOfStock
                ? 'border-[var(--color-border)] bg-gray-50 opacity-60 cursor-not-allowed'
                : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:scale-[1.01]'
              }
            `}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--color-text-primary)] truncate">{product.productName}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{product.sku}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-[var(--color-primary)]">{formatCurrency(product.sellingPrice)}</span>
                <span className={`text-xs ${outOfStock ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                  {outOfStock ? 'Out of stock' : `${product.stockQuantity} left`}
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-lg shrink-0 ${outOfStock ? 'bg-red-50' : 'bg-indigo-50'}`}>
              {outOfStock ? <Ban className="w-4 h-4 text-red-400" /> : <Plus className="w-4 h-4 text-[var(--color-primary)]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
