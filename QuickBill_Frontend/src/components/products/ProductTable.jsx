import React from 'react';
import { Edit3, Trash2, PackagePlus } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatters';

export default function ProductTable({ products, categories = [], onEdit, onDelete, onRestock }) {
  if (products.length === 0) {
    return <EmptyState title="No products found" description="Try adjusting your search or filters." />;
  }

  const getCategoryName = (catId) => {
    if (!catId) return '—';
    // Support both nested category object (from API) and flat categoryId
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.categoryName : '—';
  };

  const getStockBadge = (product) => {
    if (product.stockQuantity === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (product.stockQuantity <= product.lowStockThreshold) return <Badge variant="warning">⚠ Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
              <th className="text-left px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">SKU</th>
              <th className="text-left px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-right px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Price</th>
              <th className="text-center px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Stock</th>
              <th className="text-center px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-[var(--color-text-primary)]">{product.productName}</p>
                </td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)] font-mono text-xs">{product.sku}</td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)] hidden md:table-cell">
                  {product.category?.categoryName || getCategoryName(product.categoryId)}
                </td>
                <td className="px-5 py-4 text-right font-medium text-[var(--color-text-primary)]">{formatCurrency(product.sellingPrice)}</td>
                <td className="px-5 py-4 text-center font-medium text-[var(--color-text-primary)]">{product.stockQuantity}</td>
                <td className="px-5 py-4 text-center">{getStockBadge(product)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-[var(--color-primary)] transition-colors cursor-pointer" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onRestock(product)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-[var(--color-success)] transition-colors cursor-pointer" title="Restock">
                      <PackagePlus className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(product)} className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--color-danger)] transition-colors cursor-pointer" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
