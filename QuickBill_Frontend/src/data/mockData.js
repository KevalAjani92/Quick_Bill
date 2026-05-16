// ===== MOCK USER =====
export const mockUser = {
  id: 'u-001',
  fullName: 'Rahul Sharma',
  email: 'admin@quickbill.com',
  password: 'admin123',
  role: 'admin',
  isActive: true,
};

// ===== CATEGORIES =====
export const mockCategories = [
  { id: 'cat-001', categoryName: 'Stationery' },
  { id: 'cat-002', categoryName: 'Electronics' },
  { id: 'cat-003', categoryName: 'Groceries' },
  { id: 'cat-004', categoryName: 'Beverages' },
  { id: 'cat-005', categoryName: 'Snacks' },
  { id: 'cat-006', categoryName: 'Personal Care' },
];

// ===== PRODUCTS =====
export const mockProducts = [
  { id: 'p-001', productName: 'Spiral Notebook A4', sku: 'STN-001', barcode: '8901234001', categoryId: 'cat-001', description: 'A4 size spiral notebook, 200 pages', sellingPrice: 120, costPrice: 80, stockQuantity: 150, lowStockThreshold: 10, unit: 'pcs', isActive: true },
  { id: 'p-002', productName: 'Ball Pen (Blue)', sku: 'STN-002', barcode: '8901234002', categoryId: 'cat-001', description: 'Blue ball point pen', sellingPrice: 10, costPrice: 5, stockQuantity: 500, lowStockThreshold: 50, unit: 'pcs', isActive: true },
  { id: 'p-003', productName: 'Wireless Mouse', sku: 'ELC-001', barcode: '8901234003', categoryId: 'cat-002', description: 'Ergonomic wireless mouse', sellingPrice: 599, costPrice: 350, stockQuantity: 25, lowStockThreshold: 5, unit: 'pcs', isActive: true },
  { id: 'p-004', productName: 'USB-C Cable 1m', sku: 'ELC-002', barcode: '8901234004', categoryId: 'cat-002', description: 'USB-C fast charging cable', sellingPrice: 199, costPrice: 90, stockQuantity: 3, lowStockThreshold: 10, unit: 'pcs', isActive: true },
  { id: 'p-005', productName: 'Basmati Rice 5kg', sku: 'GRC-001', barcode: '8901234005', categoryId: 'cat-003', description: 'Premium basmati rice', sellingPrice: 450, costPrice: 380, stockQuantity: 40, lowStockThreshold: 8, unit: 'kg', isActive: true },
  { id: 'p-006', productName: 'Toor Dal 1kg', sku: 'GRC-002', barcode: '8901234006', categoryId: 'cat-003', description: 'Premium toor dal', sellingPrice: 180, costPrice: 150, stockQuantity: 0, lowStockThreshold: 5, unit: 'kg', isActive: true },
  { id: 'p-007', productName: 'Coca-Cola 750ml', sku: 'BEV-001', barcode: '8901234007', categoryId: 'cat-004', description: 'Coca-Cola soft drink', sellingPrice: 40, costPrice: 30, stockQuantity: 200, lowStockThreshold: 20, unit: 'bottle', isActive: true },
  { id: 'p-008', productName: 'Mango Juice 1L', sku: 'BEV-002', barcode: '8901234008', categoryId: 'cat-004', description: 'Real mango juice', sellingPrice: 90, costPrice: 65, stockQuantity: 4, lowStockThreshold: 10, unit: 'pcs', isActive: true },
  { id: 'p-009', productName: 'Lays Classic 52g', sku: 'SNK-001', barcode: '8901234009', categoryId: 'cat-005', description: 'Lays classic salted chips', sellingPrice: 20, costPrice: 14, stockQuantity: 100, lowStockThreshold: 15, unit: 'pcs', isActive: true },
  { id: 'p-010', productName: 'Dark Chocolate Bar', sku: 'SNK-002', barcode: '8901234010', categoryId: 'cat-005', description: 'Premium dark chocolate 70%', sellingPrice: 150, costPrice: 100, stockQuantity: 2, lowStockThreshold: 5, unit: 'pcs', isActive: true },
  { id: 'p-011', productName: 'Hand Sanitizer 200ml', sku: 'PRC-001', barcode: '8901234011', categoryId: 'cat-006', description: 'Alcohol-based hand sanitizer', sellingPrice: 99, costPrice: 55, stockQuantity: 60, lowStockThreshold: 10, unit: 'bottle', isActive: true },
  { id: 'p-012', productName: 'Toothpaste 150g', sku: 'PRC-002', barcode: '8901234012', categoryId: 'cat-006', description: 'Fluoride toothpaste', sellingPrice: 85, costPrice: 60, stockQuantity: 0, lowStockThreshold: 8, unit: 'pcs', isActive: true },
  { id: 'p-013', productName: 'Eraser Pack (5)', sku: 'STN-003', barcode: '8901234013', categoryId: 'cat-001', description: 'Dust-free erasers pack of 5', sellingPrice: 30, costPrice: 15, stockQuantity: 300, lowStockThreshold: 25, unit: 'pack', isActive: true },
  { id: 'p-014', productName: 'Bluetooth Speaker', sku: 'ELC-003', barcode: '8901234014', categoryId: 'cat-002', description: 'Portable bluetooth speaker', sellingPrice: 1299, costPrice: 800, stockQuantity: 8, lowStockThreshold: 3, unit: 'pcs', isActive: true },
  { id: 'p-015', productName: 'Green Tea 25 Bags', sku: 'BEV-003', barcode: '8901234015', categoryId: 'cat-004', description: 'Organic green tea bags', sellingPrice: 175, costPrice: 120, stockQuantity: 45, lowStockThreshold: 10, unit: 'box', isActive: true },
  { id: 'p-016', productName: 'Pencil Box', sku: 'STN-004', barcode: '8901234016', categoryId: 'cat-001', description: 'Metal pencil box', sellingPrice: 250, costPrice: 150, stockQuantity: 1, lowStockThreshold: 5, unit: 'pcs', isActive: false },
];

// ===== ORDERS =====
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);

export const mockOrders = [
  {
    id: 'ord-001', invoiceNumber: 'INV-240001', customerName: 'Amit Kumar', customerPhone: '9876543210',
    subtotal: 1918, taxAmount: 95.9, discountAmount: 0, grandTotal: 2013.9, paymentMethod: 'cash', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: today.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-001', productId: 'p-003', productNameSnapshot: 'Wireless Mouse', skuSnapshot: 'ELC-001', quantity: 2, unitPrice: 599, lineTotal: 1198 },
      { id: 'oi-002', productId: 'p-001', productNameSnapshot: 'Spiral Notebook A4', skuSnapshot: 'STN-001', quantity: 6, unitPrice: 120, lineTotal: 720 },
    ],
  },
  {
    id: 'ord-002', invoiceNumber: 'INV-240002', customerName: 'Priya Singh', customerPhone: '9876543211',
    subtotal: 850, taxAmount: 42.5, discountAmount: 0, grandTotal: 892.5, paymentMethod: 'upi', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: today.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-003', productId: 'p-005', productNameSnapshot: 'Basmati Rice 5kg', skuSnapshot: 'GRC-001', quantity: 1, unitPrice: 450, lineTotal: 450 },
      { id: 'oi-004', productId: 'p-007', productNameSnapshot: 'Coca-Cola 750ml', skuSnapshot: 'BEV-001', quantity: 10, unitPrice: 40, lineTotal: 400 },
    ],
  },
  {
    id: 'ord-003', invoiceNumber: 'INV-240003', customerName: 'Ravi Patel', customerPhone: '9876543212',
    subtotal: 1299, taxAmount: 64.95, discountAmount: 0, grandTotal: 1363.95, paymentMethod: 'card', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: today.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-005', productId: 'p-014', productNameSnapshot: 'Bluetooth Speaker', skuSnapshot: 'ELC-003', quantity: 1, unitPrice: 1299, lineTotal: 1299 },
    ],
  },
  {
    id: 'ord-004', invoiceNumber: 'INV-240004', customerName: 'Sneha Gupta', customerPhone: '9876543213',
    subtotal: 460, taxAmount: 23, discountAmount: 0, grandTotal: 483, paymentMethod: 'cash', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: yesterday.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-006', productId: 'p-009', productNameSnapshot: 'Lays Classic 52g', skuSnapshot: 'SNK-001', quantity: 5, unitPrice: 20, lineTotal: 100 },
      { id: 'oi-007', productId: 'p-010', productNameSnapshot: 'Dark Chocolate Bar', skuSnapshot: 'SNK-002', quantity: 2, unitPrice: 150, lineTotal: 300 },
      { id: 'oi-008', productId: 'p-002', productNameSnapshot: 'Ball Pen (Blue)', skuSnapshot: 'STN-002', quantity: 6, unitPrice: 10, lineTotal: 60 },
    ],
  },
  {
    id: 'ord-005', invoiceNumber: 'INV-240005', customerName: 'Vikram Joshi', customerPhone: '9876543214',
    subtotal: 720, taxAmount: 36, discountAmount: 0, grandTotal: 756, paymentMethod: 'upi', orderStatus: 'cancelled',
    createdBy: 'u-001', createdAt: yesterday.toISOString(), cancelledAt: yesterday.toISOString(),
    orderItems: [
      { id: 'oi-009', productId: 'p-001', productNameSnapshot: 'Spiral Notebook A4', skuSnapshot: 'STN-001', quantity: 6, unitPrice: 120, lineTotal: 720 },
    ],
  },
  {
    id: 'ord-006', invoiceNumber: 'INV-240006', customerName: 'Anita Desai', customerPhone: '9876543215',
    subtotal: 535, taxAmount: 26.75, discountAmount: 0, grandTotal: 561.75, paymentMethod: 'cash', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: yesterday.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-010', productId: 'p-011', productNameSnapshot: 'Hand Sanitizer 200ml', skuSnapshot: 'PRC-001', quantity: 2, unitPrice: 99, lineTotal: 198 },
      { id: 'oi-011', productId: 'p-015', productNameSnapshot: 'Green Tea 25 Bags', skuSnapshot: 'BEV-003', quantity: 1, unitPrice: 175, lineTotal: 175 },
      { id: 'oi-012', productId: 'p-013', productNameSnapshot: 'Eraser Pack (5)', skuSnapshot: 'STN-003', quantity: 2, unitPrice: 30, lineTotal: 60 },
      { id: 'oi-013', productId: 'p-004', productNameSnapshot: 'USB-C Cable 1m', skuSnapshot: 'ELC-002', quantity: 1, unitPrice: 199, lineTotal: 199 },
    ],
  },
  {
    id: 'ord-007', invoiceNumber: 'INV-240007', customerName: 'Deepak Verma', customerPhone: '9876543216',
    subtotal: 350, taxAmount: 17.5, discountAmount: 0, grandTotal: 367.5, paymentMethod: 'cash', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: twoDaysAgo.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-014', productId: 'p-005', productNameSnapshot: 'Basmati Rice 5kg', skuSnapshot: 'GRC-001', quantity: 1, unitPrice: 450, lineTotal: 450 },
    ],
  },
  {
    id: 'ord-008', invoiceNumber: 'INV-240008', customerName: 'Meena Iyer', customerPhone: '9876543217',
    subtotal: 2697, taxAmount: 134.85, discountAmount: 0, grandTotal: 2831.85, paymentMethod: 'card', orderStatus: 'completed',
    createdBy: 'u-001', createdAt: twoDaysAgo.toISOString(), cancelledAt: null,
    orderItems: [
      { id: 'oi-015', productId: 'p-014', productNameSnapshot: 'Bluetooth Speaker', skuSnapshot: 'ELC-003', quantity: 2, unitPrice: 1299, lineTotal: 2598 },
      { id: 'oi-016', productId: 'p-011', productNameSnapshot: 'Hand Sanitizer 200ml', skuSnapshot: 'PRC-001', quantity: 1, unitPrice: 99, lineTotal: 99 },
    ],
  },
];

// ===== DASHBOARD DATA =====
export const dashboardStats = {
  todaySales: 4270.35,
  totalOrdersToday: 3,
  lowStockProducts: 5,
  totalProducts: 15,
};

export const dailySalesData = [
  { day: 'Mon', sales: 3200 },
  { day: 'Tue', sales: 4500 },
  { day: 'Wed', sales: 2800 },
  { day: 'Thu', sales: 5100 },
  { day: 'Fri', sales: 3900 },
  { day: 'Sat', sales: 6200 },
  { day: 'Sun', sales: 4270 },
];

export const topSellingProducts = [
  { name: 'Wireless Mouse', value: 12 },
  { name: 'Spiral Notebook', value: 18 },
  { name: 'Bluetooth Speaker', value: 8 },
  { name: 'Coca-Cola 750ml', value: 25 },
  { name: 'Ball Pen (Blue)', value: 30 },
];

export const smartInsights = [
  { id: 1, type: 'success', message: 'Spiral Notebook is the best-selling product today' },
  { id: 2, type: 'warning', message: '5 products need restocking urgently' },
  { id: 3, type: 'info', message: 'Revenue increased 18% from yesterday' },
  { id: 4, type: 'success', message: 'Coca-Cola 750ml has consistent demand this week' },
];

// ===== SHOP INFO =====
export const shopInfo = {
  name: 'QuickBill POS',
  address: '123, MG Road, Sector 12',
  city: 'Bengaluru, Karnataka 560001',
  phone: '+91 98765 43210',
  email: 'billing@quickbill.com',
  gstin: '29AABCU9603R1ZM',
};
