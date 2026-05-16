import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateProductForm } from '../../utils/validators';

const emptyForm = {
  productName: '', sku: '', barcode: '', categoryId: '', description: '',
  sellingPrice: '', costPrice: '', stockQuantity: '', lowStockThreshold: '5',
};

export default function ProductFormModal({ isOpen, onClose, onSave, editProduct, existingProducts, categories = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!editProduct;

  useEffect(() => {
    if (editProduct) {
      setForm({
        productName: editProduct.productName,
        sku: editProduct.sku,
        barcode: editProduct.barcode || '',
        categoryId: editProduct.categoryId || '',
        description: editProduct.description || '',
        sellingPrice: String(editProduct.sellingPrice),
        costPrice: String(editProduct.costPrice || ''),
        stockQuantity: String(editProduct.stockQuantity),
        lowStockThreshold: String(editProduct.lowStockThreshold),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editProduct, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateProductForm(form, existingProducts, editProduct?.id);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    onSave({
      ...form,
      sellingPrice: Number(form.sellingPrice),
      costPrice: Number(form.costPrice) || 0,
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Product' : 'Add New Product'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name *" value={form.productName} onChange={(e) => handleChange('productName', e.target.value)} error={errors.productName} placeholder="e.g. Spiral Notebook" />
          <Input label="SKU *" value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} error={errors.sku} placeholder="e.g. STN-001" />
          <Input label="Barcode" value={form.barcode} onChange={(e) => handleChange('barcode', e.target.value)} placeholder="Optional" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>
          <Input label="Selling Price *" type="number" value={form.sellingPrice} onChange={(e) => handleChange('sellingPrice', e.target.value)} error={errors.sellingPrice} placeholder="0.00" />
          <Input label="Cost Price" type="number" value={form.costPrice} onChange={(e) => handleChange('costPrice', e.target.value)} error={errors.costPrice} placeholder="0.00" />
          <Input label="Stock Quantity *" type="number" value={form.stockQuantity} onChange={(e) => handleChange('stockQuantity', e.target.value)} error={errors.stockQuantity} placeholder="0" />
          <Input label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={(e) => handleChange('lowStockThreshold', e.target.value)} error={errors.lowStockThreshold} placeholder="5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            placeholder="Product description (optional)"
            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? 'Update Product' : 'Add Product'}</Button>
        </div>
      </form>
    </Modal>
  );
}
