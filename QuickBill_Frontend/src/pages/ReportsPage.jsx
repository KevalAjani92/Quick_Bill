import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Calendar as CalendarIcon,
  TrendingUp,
  ShoppingCart,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';
import { reportsService } from '../services/reports.service';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    bestSellingProducts: [],
    chartData: [],
    salesTable: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, customStartDate, customEndDate]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      let startDateStr = '';
      let endDateStr = '';

      const today = new Date();
      if (dateRange === 'today') {
        startDateStr = today.toISOString();
        endDateStr = today.toISOString();
      } else if (dateRange === 'last_7_days') {
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);
        startDateStr = last7.toISOString();
        endDateStr = today.toISOString();
      } else if (dateRange === 'this_month') {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        startDateStr = firstDay.toISOString();
        endDateStr = today.toISOString();
      } else if (dateRange === 'custom') {
        if (!customStartDate || !customEndDate) {
          setIsLoading(false);
          return; // Wait for both dates
        }
        startDateStr = new Date(customStartDate).toISOString();
        endDateStr = new Date(customEndDate).toISOString();
      }

      const reportData = await reportsService.getReportData(startDateStr, endDateStr);
      setData(reportData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (data.salesTable.length === 0) {
      toast.error('No data available to export');
      return;
    }

    const worksheetData = data.salesTable.map((item) => ({
      'Invoice Number': item.invoiceNumber,
      Product: item.product,
      Qty: item.qty,
      Revenue: Number(item.revenue).toFixed(2),
      Date: new Date(item.date).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    XLSX.writeFile(workbook, `sales_report_${new Date().getTime()}.xlsx`);
    toast.success('Excel file downloaded successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reports & Analytics</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Track your business performance and sales metrics
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-600)] transition-colors font-medium shadow-sm"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] flex flex-wrap items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
          <CalendarIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Date Range:</span>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--color-primary)]"
        >
          <option value="today">Today</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="this_month">This Month</option>
          <option value="custom">Custom</option>
        </select>

        {dateRange === 'custom' && (
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            />
            <span className="text-[var(--color-text-secondary)]">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-text-secondary)] font-semibold text-sm">Total Revenue</h3>
            <div className="w-10 h-10 bg-[var(--color-success-light)] rounded-xl flex items-center justify-center text-[var(--color-success)]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">
            ${data.totalRevenue.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-text-secondary)] font-semibold text-sm">Total Orders</h3>
            <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)]">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">{data.totalOrders}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-text-secondary)] font-semibold text-sm">Top Product</h3>
            <div className="w-10 h-10 bg-[var(--color-warning-light)] rounded-xl flex items-center justify-center text-[var(--color-warning)]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-[var(--color-text-primary)] truncate">
            {data.bestSellingProducts.length > 0
              ? data.bestSellingProducts[0].name
              : 'N/A'}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)] mt-1">
            {data.bestSellingProducts.length > 0
              ? `${data.bestSellingProducts[0].quantity} sold`
              : 'No sales yet'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">Revenue Trend</h3>
          <div className="h-72 w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const d = new Date(value);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                No data available for this period
              </div>
            )}
          </div>
        </div>

        {/* Best Selling Products List */}
        <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">Best Selling Products</h3>
          <div className="space-y-4">
            {isLoading ? (
               <div className="flex justify-center py-8">
                 <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : data.bestSellingProducts.length > 0 ? (
              data.bestSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-border-light)] transition-colors border border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-[var(--color-text-primary)] font-medium">{product.name}</span>
                  </div>
                  <div className="text-[var(--color-text-secondary)] text-sm font-medium">
                    {product.quantity} units
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[var(--color-text-muted)] py-8">
                No sales data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] bg-white">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Detailed Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)]">
                <th className="py-3 px-6 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Invoice Number</th>
                <th className="py-3 px-6 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Product</th>
                <th className="py-3 px-6 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Qty</th>
                <th className="py-3 px-6 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Revenue</th>
                <th className="py-3 px-6 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[var(--color-text-muted)]">
                     <div className="flex justify-center">
                       <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                     </div>
                  </td>
                </tr>
              ) : data.salesTable.length > 0 ? (
                data.salesTable.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-[var(--color-text-primary)]">{item.invoiceNumber}</td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-secondary)]">{item.product}</td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-secondary)]">{item.qty}</td>
                    <td className="py-4 px-6 text-sm text-[var(--color-success)] font-medium">
                      ${Number(item.revenue).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[var(--color-text-muted)]">
                    No sales data available for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
