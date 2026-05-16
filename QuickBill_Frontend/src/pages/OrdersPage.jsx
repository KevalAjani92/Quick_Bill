import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, cancelOrder as cancelOrderApi } from '../services/orders.service';
import SearchInput from '../components/common/SearchInput';
import OrdersTable from '../components/orders/OrdersTable';
import OrderDetailModal from '../components/orders/OrderDetailModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Completed', 'Cancelled', 'Today'];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [detailOrder, setDetailOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    let list = orders;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.invoiceNumber.toLowerCase().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q))
      );
    }

    if (activeFilter === 'Completed') list = list.filter((o) => o.orderStatus === 'completed');
    else if (activeFilter === 'Cancelled') list = list.filter((o) => o.orderStatus === 'cancelled');
    else if (activeFilter === 'Today') {
      const todayStr = new Date().toDateString();
      list = list.filter((o) => new Date(o.createdAt).toDateString() === todayStr);
    }

    return list;
  }, [orders, search, activeFilter]);

  const handleCancel = async () => {
    if (!cancelOrder) return;
    try {
      await cancelOrderApi(cancelOrder.id);
      toast.success('Order cancelled. Stock has been restored.');
      setCancelOrder(null);
      await fetchOrders();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
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
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Orders</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by invoice # or customer..."
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

      <OrdersTable
        orders={filtered}
        onViewDetails={setDetailOrder}
        onViewInvoice={(order) => navigate(`/invoices/${order.id}`)}
        onCancel={setCancelOrder}
      />

      <OrderDetailModal
        isOpen={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
      />

      <ConfirmDialog
        isOpen={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
        onConfirm={handleCancel}
        title="Cancel Order?"
        message={`This will cancel order ${cancelOrder?.invoiceNumber} and restore stock for all items. This cannot be undone.`}
        confirmText="Cancel Order"
      />
    </div>
  );
}
