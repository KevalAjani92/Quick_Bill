import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, stockFilter?: string) {
    const where: any = { isActive: true };

    // Search by name or SKU
    if (search?.trim()) {
      where.OR = [
        { productName: { contains: search.trim(), mode: 'insensitive' } },
        { sku: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // Out of stock filter
    if (stockFilter === 'out_of_stock') {
      where.stockQuantity = 0;
    }

    let products = await this.prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, categoryName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Post-filter for low stock (comparing two columns: stockQuantity <= lowStockThreshold)
    if (stockFilter === 'low_stock') {
      products = products.filter(
        (p) =>
          Number(p.stockQuantity) > 0 &&
          Number(p.stockQuantity) <= Number(p.lowStockThreshold),
      );
    }

    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, categoryName: true },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    // Check for duplicate SKU
    const existing = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (existing) {
      throw new ConflictException(`Product with SKU "${dto.sku}" already exists`);
    }

    return this.prisma.product.create({
      data: {
        productName: dto.productName,
        sku: dto.sku,
        barcode: dto.barcode || null,
        categoryId: dto.categoryId || null,
        description: dto.description || null,
        sellingPrice: dto.sellingPrice,
        costPrice: dto.costPrice ?? 0,
        stockQuantity: dto.stockQuantity,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
        unit: dto.unit || 'pcs',
      },
      include: {
        category: {
          select: { id: true, categoryName: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    // Check for duplicate SKU (if SKU is being changed)
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (existing) {
        throw new ConflictException(`Product with SKU "${dto.sku}" already exists`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.productName !== undefined && { productName: dto.productName }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.barcode !== undefined && { barcode: dto.barcode || null }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId || null }),
        ...(dto.description !== undefined && { description: dto.description || null }),
        ...(dto.sellingPrice !== undefined && { sellingPrice: dto.sellingPrice }),
        ...(dto.costPrice !== undefined && { costPrice: dto.costPrice }),
        ...(dto.stockQuantity !== undefined && { stockQuantity: dto.stockQuantity }),
        ...(dto.lowStockThreshold !== undefined && { lowStockThreshold: dto.lowStockThreshold }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
      },
      include: {
        category: {
          select: { id: true, categoryName: true },
        },
      },
    });
  }

  async restock(id: string, quantity: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        stockQuantity: { increment: quantity },
      },
      include: {
        category: {
          select: { id: true, categoryName: true },
        },
      },
    });
  }

  async softDelete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
