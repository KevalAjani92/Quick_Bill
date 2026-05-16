import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding QuickBill database...\n');

  // ===== 1. SEED ADMIN USER =====
  const passwordHash = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@quickbill.com' },
    update: {},
    create: {
      fullName: 'Rahul Sharma',
      email: 'admin@quickbill.com',
      passwordHash,
      role: 'admin',
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  // ===== 2. SEED CATEGORIES =====
  const categoryNames = [
    'Stationery',
    'Electronics',
    'Groceries',
    'Beverages',
    'Snacks',
    'Personal Care',
  ];

  const categories: Record<string, any> = {};

  for (const name of categoryNames) {
    const cat = await prisma.productCategory.upsert({
      where: { categoryName: name },
      update: {},
      create: { categoryName: name },
    });
    categories[name] = cat;
  }
  console.log(`✅ ${categoryNames.length} categories created`);

  // ===== 3. SEED PRODUCTS =====
  const productsData = [
    {
      productName: 'Spiral Notebook A4',
      sku: 'STN-001',
      barcode: '8901234001',
      category: 'Stationery',
      description: 'A4 size spiral notebook, 200 pages',
      sellingPrice: 120,
      costPrice: 80,
      stockQuantity: 150,
      lowStockThreshold: 10,
      unit: 'pcs',
    },
    {
      productName: 'Ball Pen (Blue)',
      sku: 'STN-002',
      barcode: '8901234002',
      category: 'Stationery',
      description: 'Blue ball point pen',
      sellingPrice: 10,
      costPrice: 5,
      stockQuantity: 500,
      lowStockThreshold: 50,
      unit: 'pcs',
    },
    {
      productName: 'Wireless Mouse',
      sku: 'ELC-001',
      barcode: '8901234003',
      category: 'Electronics',
      description: 'Ergonomic wireless mouse',
      sellingPrice: 599,
      costPrice: 350,
      stockQuantity: 25,
      lowStockThreshold: 5,
      unit: 'pcs',
    },
    {
      productName: 'USB-C Cable 1m',
      sku: 'ELC-002',
      barcode: '8901234004',
      category: 'Electronics',
      description: 'USB-C fast charging cable',
      sellingPrice: 199,
      costPrice: 90,
      stockQuantity: 3,
      lowStockThreshold: 10,
      unit: 'pcs',
    },
    {
      productName: 'Basmati Rice 5kg',
      sku: 'GRC-001',
      barcode: '8901234005',
      category: 'Groceries',
      description: 'Premium basmati rice',
      sellingPrice: 450,
      costPrice: 380,
      stockQuantity: 40,
      lowStockThreshold: 8,
      unit: 'kg',
    },
    {
      productName: 'Toor Dal 1kg',
      sku: 'GRC-002',
      barcode: '8901234006',
      category: 'Groceries',
      description: 'Premium toor dal',
      sellingPrice: 180,
      costPrice: 150,
      stockQuantity: 0,
      lowStockThreshold: 5,
      unit: 'kg',
    },
    {
      productName: 'Coca-Cola 750ml',
      sku: 'BEV-001',
      barcode: '8901234007',
      category: 'Beverages',
      description: 'Coca-Cola soft drink',
      sellingPrice: 40,
      costPrice: 30,
      stockQuantity: 200,
      lowStockThreshold: 20,
      unit: 'bottle',
    },
    {
      productName: 'Mango Juice 1L',
      sku: 'BEV-002',
      barcode: '8901234008',
      category: 'Beverages',
      description: 'Real mango juice',
      sellingPrice: 90,
      costPrice: 65,
      stockQuantity: 4,
      lowStockThreshold: 10,
      unit: 'pcs',
    },
    {
      productName: 'Lays Classic 52g',
      sku: 'SNK-001',
      barcode: '8901234009',
      category: 'Snacks',
      description: 'Lays classic salted chips',
      sellingPrice: 20,
      costPrice: 14,
      stockQuantity: 100,
      lowStockThreshold: 15,
      unit: 'pcs',
    },
    {
      productName: 'Dark Chocolate Bar',
      sku: 'SNK-002',
      barcode: '8901234010',
      category: 'Snacks',
      description: 'Premium dark chocolate 70%',
      sellingPrice: 150,
      costPrice: 100,
      stockQuantity: 2,
      lowStockThreshold: 5,
      unit: 'pcs',
    },
    {
      productName: 'Hand Sanitizer 200ml',
      sku: 'PRC-001',
      barcode: '8901234011',
      category: 'Personal Care',
      description: 'Alcohol-based hand sanitizer',
      sellingPrice: 99,
      costPrice: 55,
      stockQuantity: 60,
      lowStockThreshold: 10,
      unit: 'bottle',
    },
    {
      productName: 'Toothpaste 150g',
      sku: 'PRC-002',
      barcode: '8901234012',
      category: 'Personal Care',
      description: 'Fluoride toothpaste',
      sellingPrice: 85,
      costPrice: 60,
      stockQuantity: 0,
      lowStockThreshold: 8,
      unit: 'pcs',
    },
    {
      productName: 'Eraser Pack (5)',
      sku: 'STN-003',
      barcode: '8901234013',
      category: 'Stationery',
      description: 'Dust-free erasers pack of 5',
      sellingPrice: 30,
      costPrice: 15,
      stockQuantity: 300,
      lowStockThreshold: 25,
      unit: 'pack',
    },
    {
      productName: 'Bluetooth Speaker',
      sku: 'ELC-003',
      barcode: '8901234014',
      category: 'Electronics',
      description: 'Portable bluetooth speaker',
      sellingPrice: 1299,
      costPrice: 800,
      stockQuantity: 8,
      lowStockThreshold: 3,
      unit: 'pcs',
    },
    {
      productName: 'Green Tea 25 Bags',
      sku: 'BEV-003',
      barcode: '8901234015',
      category: 'Beverages',
      description: 'Organic green tea bags',
      sellingPrice: 175,
      costPrice: 120,
      stockQuantity: 45,
      lowStockThreshold: 10,
      unit: 'box',
    },
    {
      productName: 'Pencil Box',
      sku: 'STN-004',
      barcode: '8901234016',
      category: 'Stationery',
      description: 'Metal pencil box',
      sellingPrice: 250,
      costPrice: 150,
      stockQuantity: 1,
      lowStockThreshold: 5,
      unit: 'pcs',
    },
  ];

  const products: Record<string, any> = {};

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        productName: p.productName,
        sku: p.sku,
        barcode: p.barcode,
        categoryId: categories[p.category].id,
        description: p.description,
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: p.lowStockThreshold,
        unit: p.unit,
      },
    });
    products[p.sku] = product;
  }
  console.log(`✅ ${productsData.length} products created`);

  // ===== 4. SEED SAMPLE ORDERS =====
  const TAX_RATE = 0.05;

  const ordersData = [
    {
      invoiceNumber: 'INV-240001',
      customerName: 'Amit Kumar',
      customerPhone: '9876543210',
      paymentMethod: 'cash',
      items: [
        { sku: 'ELC-001', qty: 2 },
        { sku: 'STN-001', qty: 6 },
      ],
    },
    {
      invoiceNumber: 'INV-240002',
      customerName: 'Priya Singh',
      customerPhone: '9876543211',
      paymentMethod: 'upi',
      items: [
        { sku: 'GRC-001', qty: 1 },
        { sku: 'BEV-001', qty: 10 },
      ],
    },
    {
      invoiceNumber: 'INV-240003',
      customerName: 'Ravi Patel',
      customerPhone: '9876543212',
      paymentMethod: 'card',
      items: [{ sku: 'ELC-003', qty: 1 }],
    },
  ];

  for (const orderData of ordersData) {
    // Check if order already exists
    const existingOrder = await prisma.order.findUnique({
      where: { invoiceNumber: orderData.invoiceNumber },
    });
    if (existingOrder) continue;

    let subtotal = 0;
    const orderItemsCreate: any[] = [];

    for (const item of orderData.items) {
      const product = products[item.sku];
      const unitPrice = Number(product.sellingPrice);
      const lineTotal = unitPrice * item.qty;
      subtotal += lineTotal;

      orderItemsCreate.push({
        productId: product.id,
        productNameSnapshot: product.productName,
        skuSnapshot: product.sku,
        quantity: item.qty,
        unitPrice,
        lineTotal,
      });
    }

    const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
    const grandTotal = subtotal + taxAmount;

    await prisma.order.create({
      data: {
        invoiceNumber: orderData.invoiceNumber,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        subtotal,
        taxAmount,
        discountAmount: 0,
        grandTotal,
        paymentMethod: orderData.paymentMethod,
        orderStatus: 'completed',
        createdBy: adminUser.id,
        orderItems: {
          create: orderItemsCreate,
        },
      },
    });
  }
  console.log(`✅ ${ordersData.length} sample orders created`);

  console.log('\n🎉 Seeding complete!');
  console.log('─────────────────────────────────');
  console.log('Login credentials:');
  console.log('  Email:    admin@quickbill.com');
  console.log('  Password: admin123');
  console.log('─────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
