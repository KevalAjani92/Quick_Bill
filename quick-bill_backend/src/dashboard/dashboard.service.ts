import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's sales (sum of grandTotal for completed orders today)
    const todaySalesResult = await this.prisma.order.aggregate({
      _sum: { grandTotal: true },
      where: {
        orderStatus: 'completed',
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });

    // Total orders today
    const totalOrdersToday = await this.prisma.order.count({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        orderStatus: 'completed',
      },
    });

    // Total active products
    const totalProducts = await this.prisma.product.count({
      where: { isActive: true },
    });

    // Low stock products (stockQuantity > 0 and stockQuantity <= lowStockThreshold)
    const allActiveProducts = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { stockQuantity: true, lowStockThreshold: true },
    });

    const lowStockProducts = allActiveProducts.filter(
      (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold,
    ).length;

    // Out of stock count
    const outOfStockProducts = allActiveProducts.filter(
      (p) => p.stockQuantity === 0,
    ).length;

    return {
      todaySales: Number(todaySalesResult._sum.grandTotal) || 0,
      totalOrdersToday,
      lowStockProducts: lowStockProducts + outOfStockProducts,
      totalProducts,
    };
  }

  async getSalesChart() {
    // Get last 7 days sales data
    const days: { day: string; sales: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const result = await this.prisma.order.aggregate({
        _sum: { grandTotal: true },
        where: {
          orderStatus: 'completed',
          createdAt: { gte: dayStart, lte: dayEnd },
        },
      });

      days.push({
        day: dayNames[date.getDay()],
        sales: Number(result._sum.grandTotal) || 0,
      });
    }

    return days;
  }

  async getTopProducts() {
    // Get top 5 most sold products (by quantity) from completed orders
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ['productNameSnapshot'],
      _sum: { quantity: true },
      where: {
        order: { orderStatus: 'completed' },
      },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 5,
    });

    return orderItems.map((item) => ({
      name: item.productNameSnapshot,
      value: item._sum.quantity || 0,
    }));
  }

  async getInsights() {
    const insights: { id: number; type: string; message: string }[] = [];
    let idCounter = 1;

    // 1. Best selling product today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const bestSellingToday = await this.prisma.orderItem.groupBy({
      by: ['productNameSnapshot'],
      _sum: { quantity: true },
      where: {
        order: {
          orderStatus: 'completed',
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 1,
    });

    if (bestSellingToday.length > 0) {
      insights.push({
        id: idCounter++,
        type: 'success',
        message: `${bestSellingToday[0].productNameSnapshot} is the best-selling product today`,
      });
    }

    // 2. Low stock warning
    const allProducts = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { stockQuantity: true, lowStockThreshold: true },
    });

    const needRestock = allProducts.filter(
      (p) => p.stockQuantity <= p.lowStockThreshold,
    ).length;

    if (needRestock > 0) {
      insights.push({
        id: idCounter++,
        type: 'warning',
        message: `${needRestock} product${needRestock > 1 ? 's' : ''} need${needRestock > 1 ? '' : 's'} restocking urgently`,
      });
    }

    // 3. Revenue comparison vs yesterday
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const todayRevenue = await this.prisma.order.aggregate({
      _sum: { grandTotal: true },
      where: {
        orderStatus: 'completed',
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });

    const yesterdayRevenue = await this.prisma.order.aggregate({
      _sum: { grandTotal: true },
      where: {
        orderStatus: 'completed',
        createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
      },
    });

    const todayRev = Number(todayRevenue._sum.grandTotal) || 0;
    const yesterdayRev = Number(yesterdayRevenue._sum.grandTotal) || 0;

    if (yesterdayRev > 0 && todayRev > 0) {
      const change = Math.round(((todayRev - yesterdayRev) / yesterdayRev) * 100);
      if (change > 0) {
        insights.push({
          id: idCounter++,
          type: 'success',
          message: `Revenue increased ${change}% from yesterday`,
        });
      } else if (change < 0) {
        insights.push({
          id: idCounter++,
          type: 'info',
          message: `Revenue decreased ${Math.abs(change)}% from yesterday`,
        });
      }
    }

    // 4. Most consistent seller this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const topWeekly = await this.prisma.orderItem.groupBy({
      by: ['productNameSnapshot'],
      _sum: { quantity: true },
      where: {
        order: {
          orderStatus: 'completed',
          createdAt: { gte: weekStart },
        },
      },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 1,
    });

    if (topWeekly.length > 0) {
      insights.push({
        id: idCounter++,
        type: 'success',
        message: `${topWeekly[0].productNameSnapshot} has consistent demand this week`,
      });
    }

    // Fallback if no insights generated
    if (insights.length === 0) {
      insights.push({
        id: idCounter++,
        type: 'info',
        message: 'Start making sales to see insights here',
      });
    }

    return insights;
  }
}
