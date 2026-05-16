import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function RestockModal({ isOpen, onClose, product, onRestock }) {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!quantity || qty <= 0) {
      setError('Enter a valid positive number');
      return;
    }
    onRestock(product.id, qty);
    setQuantity('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restock Product" size="sm">
      <div className="space-y-4">
        <div className="p-3 bg-[var(--color-surface-hover)] rounded-xl">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{product?.productName}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">Current Stock: <span className="font-semibold">{product?.stockQuantity}</span></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Quantity to Add"
            type="number"
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(''); }}
            error={error}
            placeholder="Enter quantity"
            min="1"
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="success">Add Stock</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
