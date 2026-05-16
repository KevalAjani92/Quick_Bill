import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, restockProduct } from '../services/products.service';
import { getCategories } from '../services/categories.service';
import Button from '../components/common/Button';
import SearchInput from '../components/common/SearchInput';
import ProductTable from '../components/products/ProductTable';
import ProductFormModal from '../components/products/ProductFormModal';
import RestockModal from '../components/products/RestockModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Low Stock', 'Out of Stock'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [restockProductItem, setRestockProductItem] = useState(null);
  const [deleteProductItem, setDeleteProductItem] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.productName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    // Filter
    if (activeFilter === 'Low Stock') {
      list = list.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold);
    } else if (activeFilter === 'Out of Stock') {
      list = list.filter((p) => p.stockQuantity === 0);
    }

    return list;
  }, [products, search, activeFilter]);

  const handleSaveProduct = async (data) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, data);
        toast.success('Product updated successfully');
      } else {
        await createProduct(data);
        toast.success('Product added successfully');
      }
      setFormOpen(false);
      setEditProduct(null);
      await fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save product';
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const handleDelete = async () => {
    if (deleteProductItem) {
      try {
        await deleteProduct(deleteProductItem.id);
        toast.success('Product removed');
        setDeleteProductItem(null);
        await fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleRestock = async (id, qty) => {
    try {
      await restockProduct(id, qty);
      toast.success(`Added ${qty} units to stock`);
      setRestockProductItem(null);
      await fetchProducts();
    } catch (error) {
      toast.error('Failed to restock product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Products</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{products.length} total products</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditProduct(null); setFormOpen(true); }} id="add-product-btn">
          Add Product
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or SKU..."
          className="flex-1 max-w-md"
        />
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        categories={categories}
        onEdit={(p) => { setEditProduct(p); setFormOpen(true); }}
        onDelete={setDeleteProductItem}
        onRestock={setRestockProductItem}
      />

      {/* Modals */}
      <ProductFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        onSave={handleSaveProduct}
        editProduct={editProduct}
        existingProducts={products}
        categories={categories}
      />

      {restockProductItem && (
        <RestockModal
          isOpen={!!restockProductItem}
          onClose={() => setRestockProductItem(null)}
          product={restockProductItem}
          onRestock={handleRestock}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteProductItem}
        onClose={() => setDeleteProductItem(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message={`This will remove "${deleteProductItem?.productName}" from your inventory. This uses soft delete.`}
        confirmText="Delete"
      />
    </div>
  );
}
