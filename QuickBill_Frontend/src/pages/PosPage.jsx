import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Smartphone, Receipt } from 'lucide-react';
import { getProducts } from '../services/products.service';
import { createOrder } from '../services/orders.service';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import ProductSearch from '../components/pos/ProductSearch';
import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
];

export default function PosPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items, customerName, customerPhone, paymentMethod,
    addItem, setCustomerName, setCustomerPhone, setPaymentMethod, clearCart,
    getSubtotal, getTax, getGrandTotal,
  } = useCartStore();

  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
        console.error(error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const activeProducts = useMemo(() => {
    let list = allProducts.filter((p) => p.isActive);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.productName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return list;
  }, [search, allProducts]);

  const handleAddToCart = (product) => {
    const result = addItem(product);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleConfirmSale = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || undefined,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(orderPayload);

      clearCart();
      toast.success('Sale completed successfully!');
      navigate(`/invoices/${order.id}`);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create order';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Billing / POS</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT — Products */}
        <div className="lg:col-span-3 space-y-4">
          <ProductSearch value={search} onChange={setSearch} />
          <ProductGrid products={activeProducts} onAddToCart={handleAddToCart} />
        </div>

        {/* RIGHT — Cart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 sticky top-[calc(var(--header-height)+2rem)]">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Current Bill</h2>
              <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
                {items.length} items
              </span>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Input
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            {/* Cart */}
            <Cart />

            {/* Payment Method */}
            {items.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Payment Method</p>
                <div className="flex gap-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-gray-200'
                      }`}
                    >
                      <pm.icon className="w-4 h-4" />
                      {pm.label}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleConfirmSale}
                  loading={loading}
                  className="w-full !py-3 text-base mt-2"
                  id="confirm-sale-btn"
                >
                  Confirm Sale
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
