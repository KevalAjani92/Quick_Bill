import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ShoppingBag, AlertTriangle, Package, Plus, FileText, ShoppingCart } from 'lucide-react';
import useAuthStore from '../store/authStore';
import KpiCard from '../components/common/KpiCard';
import Button from '../components/common/Button';
import InsightsCard from '../components/dashboard/InsightsCard';
import SalesBarChart from '../components/dashboard/SalesBarChart';
import TopProductsPieChart from '../components/dashboard/TopProductsPieChart';
import { getDashboardStats, getSalesChart, getTopProducts, getInsights } from '../services/dashboard.service';
import { formatCurrency } from '../utils/formatters';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ todaySales: 0, totalOrdersToday: 0, lowStockProducts: 0, totalProducts: 0 });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, salesRes, topRes, insightsRes] = await Promise.all([
          getDashboardStats(),
          getSalesChart(),
          getTopProducts(),
          getInsights(),
        ]);
        setStats(statsRes);
        setSalesData(salesRes);
        setTopProducts(topRes);
        setInsights(insightsRes);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {greeting}, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Here&apos;s what&apos;s happening with your store today</p>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={ShoppingCart} onClick={() => navigate('/pos')}>New Sale</Button>
          <Button variant="outline" icon={Plus} onClick={() => navigate('/products')}>Add Product</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Sales"
          value={formatCurrency(stats.todaySales)}
          icon={IndianRupee}
          color="success"
          trend="up"
          trendValue="+18% from yesterday"
        />
        <KpiCard
          title="Total Orders Today"
          value={`${stats.totalOrdersToday} Orders`}
          icon={ShoppingBag}
          color="primary"
          trend="up"
          trendValue={`${stats.totalOrdersToday} today`}
        />
        <KpiCard
          title="Low Stock Products"
          value={`${stats.lowStockProducts} Products`}
          icon={AlertTriangle}
          color="warning"
        />
        <KpiCard
          title="Total Products"
          value={`${stats.totalProducts} Products`}
          icon={Package}
          color="info"
        />
      </div>

      {/* Smart Insights */}
      <InsightsCard insights={insights} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesBarChart data={salesData} />
        <TopProductsPieChart data={topProducts} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button icon={ShoppingCart} onClick={() => navigate('/pos')}>+ New Sale</Button>
          <Button variant="secondary" icon={Plus} onClick={() => navigate('/products')}>+ Add Product</Button>
          <Button variant="outline" icon={FileText} onClick={() => navigate('/orders')}>View Reports</Button>
        </div>
      </div>
    </div>
  );
}
