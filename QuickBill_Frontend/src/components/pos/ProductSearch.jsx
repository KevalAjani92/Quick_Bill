import React from 'react';
import SearchInput from '../common/SearchInput';

export default function ProductSearch({ value, onChange }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Search products by name or SKU..."
      className="w-full"
    />
  );
}
