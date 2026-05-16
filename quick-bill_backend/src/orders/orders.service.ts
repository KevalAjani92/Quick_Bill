import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

const TAX_RATE = 0.05;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, filter?: string) {
    const where: any = {};

    // Search by invoice number or customer name
    if (search?.trim()) {
      where.OR = [
        { invoiceNumber: { contains: search.trim(), mode: 'insensitive' } },
        { customerName: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // Filter by status
    if (filter === 'completed') {
      where.orderStatus = 'completed';
    } else if (filter === 'cancelled') {
      where.orderStatus = 'cancelled';
    } else if (filter === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      where.createdAt = { gte: todayStart, lte: todayEnd };
    }

    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: true,
        creator: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        creator: {
          select: { id: true, fullName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(dto: CreateOrderDto, userId: string) {
    // Generate unique invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    // Validate stock and calculate totals within a transaction
    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new BadRequestException(
            `Product not found or inactive: ${item.productId}`,
          );
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.productName}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
          );
        }

        const unitPrice = Number(product.sellingPrice);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        orderItemsData.push({
          productId: product.id,
          productNameSnapshot: product.productName,
          skuSnapshot: product.sku,
          quantity: item.quantity,
          unitPrice: unitPrice,
          lineTotal: lineTotal,
        });

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
      const grandTotal = subtotal + taxAmount;

      // Create order with items
      const order = await tx.order.create({
        data: {
          invoiceNumber,
          customerName: dto.customerName || 'Walk-in Customer',
          customerPhone: dto.customerPhone || null,
          subtotal,
          taxAmount,
          discountAmount: 0,
          grandTotal,
          paymentMethod: dto.paymentMethod,
          orderStatus: 'completed',
          createdBy: userId,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
          creator: {
            select: { id: true, fullName: true },
          },
        },
      });

      return order;
    });
  }

  async cancel(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.orderStatus === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Cancel order and restore stock in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Restore stock for each item
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
          },
        });
      }

      // Update order status
      return tx.order.update({
        where: { id },
        data: {
          orderStatus: 'cancelled',
          cancelledAt: new Date(),
        },
        include: {
          orderItems: true,
          creator: {
            select: { id: true, fullName: true },
          },
        },
      });
    });
  }

  private async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');

    // Count orders created today to get sequence
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const count = await this.prisma.order.count({
      where: {
        createdAt: { gte: todayStart },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `INV-${year}${month}${sequence}`;
  }
}
