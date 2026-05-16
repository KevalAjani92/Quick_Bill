import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Printer, ArrowLeft } from 'lucide-react';
import { getOrderById } from '../services/orders.service';
import InvoiceTemplate from '../components/invoice/InvoiceTemplate';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to load order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: order ? `Invoice-${order.invoiceNumber}` : 'Invoice',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="animate-fade-in">
        <EmptyState title="Invoice not found" description="The invoice you're looking for doesn't exist." />
        <div className="flex justify-center mt-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Actions */}
      <div className="flex items-center justify-between no-print">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/orders')}>Back to Orders</Button>
        <Button icon={Printer} onClick={handlePrint} id="print-invoice-btn">Print Invoice</Button>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <InvoiceTemplate ref={invoiceRef} order={order} />
      </div>
    </div>
  );
}
