export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateProductForm = (data, existingProducts = [], editingId = null) => {
  const errors = {};

  if (!data.productName?.trim()) {
    errors.productName = 'Product name is required';
  }

  if (!data.sku?.trim()) {
    errors.sku = 'SKU is required';
  } else {
    const duplicate = existingProducts.find(
      (p) => p.sku.toLowerCase() === data.sku.trim().toLowerCase() && p.id !== editingId
    );
    if (duplicate) {
      errors.sku = 'SKU already exists';
    }
  }

  if (data.sellingPrice === '' || data.sellingPrice === undefined || data.sellingPrice === null) {
    errors.sellingPrice = 'Selling price is required';
  } else if (Number(data.sellingPrice) < 0) {
    errors.sellingPrice = 'Price cannot be negative';
  }

  if (data.costPrice !== '' && data.costPrice !== undefined && Number(data.costPrice) < 0) {
    errors.costPrice = 'Cost price cannot be negative';
  }

  if (data.stockQuantity === '' || data.stockQuantity === undefined) {
    errors.stockQuantity = 'Stock quantity is required';
  } else if (Number(data.stockQuantity) < 0) {
    errors.stockQuantity = 'Stock cannot be negative';
  }

  if (data.lowStockThreshold !== '' && data.lowStockThreshold !== undefined && Number(data.lowStockThreshold) < 0) {
    errors.lowStockThreshold = 'Threshold cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password?.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
