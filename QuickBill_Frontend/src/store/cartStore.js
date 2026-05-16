import { create } from 'zustand';

const TAX_RATE = 0.05;

const useCartStore = create((set, get) => ({
  items: [],
  customerName: '',
  customerPhone: '',
  paymentMethod: 'cash',

  get subtotal() {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getTax: () => {
    return get().getSubtotal() * TAX_RATE;
  },

  getGrandTotal: () => {
    return get().getSubtotal() + get().getTax();
  },

  addItem: (product) => {
    const { items } = get();
    const existing = items.find((i) => i.productId === product.id);

    if (existing) {
      if (existing.quantity + 1 > product.stockQuantity) {
        return { success: false, message: 'Insufficient stock' };
      }
      set({
        items: items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1, lineTotal: (i.quantity + 1) * i.unitPrice }
            : i
        ),
      });
    } else {
      if (product.stockQuantity < 1) {
        return { success: false, message: 'Product is out of stock' };
      }
      set({
        items: [
          ...items,
          {
            productId: product.id,
            productNameSnapshot: product.productName,
            skuSnapshot: product.sku,
            unitPrice: product.sellingPrice,
            quantity: 1,
            lineTotal: product.sellingPrice,
            maxStock: product.stockQuantity,
          },
        ],
      });
    }
    return { success: true };
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const item = items.find((i) => i.productId === productId);
    if (!item) return { success: false, message: 'Item not found' };

    if (quantity > item.maxStock) {
      return { success: false, message: 'Insufficient stock' };
    }

    if (quantity <= 0) {
      set({ items: items.filter((i) => i.productId !== productId) });
    } else {
      set({
        items: items.map((i) =>
          i.productId === productId
            ? { ...i, quantity, lineTotal: quantity * i.unitPrice }
            : i
        ),
      });
    }
    return { success: true };
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.productId !== productId) });
  },

  setCustomerName: (name) => set({ customerName: name }),
  setCustomerPhone: (phone) => set({ customerPhone: phone }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  clearCart: () => {
    set({ items: [], customerName: '', customerPhone: '', paymentMethod: 'cash' });
  },
}));

export default useCartStore;
