import React, { forwardRef } from 'react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { shopInfo } from '../../data/mockData';

const InvoiceTemplate = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} className="bg-white p-8 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{shopInfo.name}</h1>
        <p className="text-sm text-gray-600 mt-1">{shopInfo.address}</p>
        <p className="text-sm text-gray-600">{shopInfo.city}</p>
        <p className="text-sm text-gray-600">Phone: {shopInfo.phone} | GSTIN: {shopInfo.gstin}</p>
      </div>

      {/* Invoice Meta */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Invoice Number</p>
          <p className="font-semibold text-gray-900">{order.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-semibold text-gray-900">{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Customer</p>
        <p className="font-medium text-gray-900">{order.customerName || 'Walk-in Customer'}</p>
        {order.customerPhone && <p className="text-sm text-gray-600">{order.customerPhone}</p>}
      </div>

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2 text-sm font-semibold text-gray-700">#</th>
            <th className="text-left py-2 text-sm font-semibold text-gray-700">Product</th>
            <th className="text-center py-2 text-sm font-semibold text-gray-700">Qty</th>
            <th className="text-right py-2 text-sm font-semibold text-gray-700">Price</th>
            <th className="text-right py-2 text-sm font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2.5 text-sm text-gray-600">{index + 1}</td>
              <td className="py-2.5 text-sm text-gray-900 font-medium">{item.productNameSnapshot}</td>
              <td className="py-2.5 text-sm text-gray-600 text-center">{item.quantity}</td>
              <td className="py-2.5 text-sm text-gray-600 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2.5 text-sm text-gray-900 font-medium text-right">{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (5%)</span>
            <span className="text-gray-900">{formatCurrency(order.taxAmount)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="text-red-500">-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-gray-800">
            <span>Grand Total</span>
            <span>{formatCurrency(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 text-sm text-gray-600">
        Payment Method: <span className="font-medium capitalize">{order.paymentMethod}</span>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center">
        <p className="text-sm font-semibold text-gray-700">Thank You, Visit Again!</p>
        <p className="text-xs text-gray-400 mt-1">Powered by QuickBill POS</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;
