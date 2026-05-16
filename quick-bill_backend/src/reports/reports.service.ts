import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReportData(startDateStr?: string, endDateStr?: string) {
    let startDate = startDateStr ? new Date(startDateStr) : new Date();
    if (!startDateStr) {
      startDate.setDate(startDate.getDate() - 30); // Default to last 30 days if no date is provided
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setHours(0, 0, 0, 0);
    }

    let endDate = endDateStr ? new Date(endDateStr) : new Date();
    if (!endDateStr) {
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate.setHours(23, 59, 59, 999);
    }

    // 1. Total Revenue & 2. Total Orders
    const aggregateData = await this.prisma.order.aggregate({
      _sum: { grandTotal: true },
      _count: { id: true },
      where: {
        orderStatus: 'completed',
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const totalRevenue = Number(aggregateData._sum.grandTotal) || 0;
    const totalOrders = aggregateData._count.id || 0;

    // 3. Best Selling Products
    const topProductsResult = await this.prisma.orderItem.groupBy({
      by: ['productNameSnapshot'],
      _sum: { quantity: true },
      where: {
        order: {
          orderStatus: 'completed',
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: 5,
    });

    const bestSellingProducts = topProductsResult.map((item) => ({
      name: item.productNameSnapshot,
      quantity: item._sum.quantity || 0,
    }));

    // 4. Chart Data (Aggregate by Day within the range)
    const ordersForChart = await this.prisma.order.findMany({
      where: {
        orderStatus: 'completed',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { grandTotal: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const chartDataMap: Record<string, number> = {};
    for (const order of ordersForChart) {
      const dateKey = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      chartDataMap[dateKey] = (chartDataMap[dateKey] || 0) + Number(order.grandTotal);
    }
    const chartData = Object.keys(chartDataMap).map((date) => ({
      date,
      sales: chartDataMap[date],
    }));

    // 5. Sales Table (Order items detailed)
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          orderStatus: 'completed',
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      include: {
        order: {
          select: { invoiceNumber: true, createdAt: true, grandTotal: true },
        },
      },
      orderBy: {
        order: { createdAt: 'desc' },
      },
    });

    const salesTable = orderItems.map((item) => ({
      id: item.id,
      invoiceNumber: item.order.invoiceNumber,
      product: item.productNameSnapshot,
      qty: item.quantity,
      revenue: Number(item.lineTotal),
      date: item.order.createdAt,
    }));

    return {
      totalRevenue,
      totalOrders,
      bestSellingProducts,
      chartData,
      salesTable,
    };
  }
}
