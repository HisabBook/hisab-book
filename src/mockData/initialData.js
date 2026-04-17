
// Added category to ALL accessories
// Added createdAt, updatedAt timestamps everywhere
//Added edge-case phones (zero battery, duplicate brand)
// Added edge-case accessories (quantity = 0, at threshold)
//Added edge-case customers (zero debt, very high debt,
//negative-edge / over-paid scenario)
//Added more sales history for Reports/Charts testing
//Added more expense entries for Roznamcha testing


// PHONES  (Unique Items — IMEI tracked)
export const mockPhones = [
  // ── Standard available phone 
  {
    id: 'ph_001',
    imei: '352099001761481',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    color: 'Deep Purple',
    ram: '6GB',
    rom: '256GB',
    condition: 'Brand New',
    batteryHealth: 100,
    purchasePrice: 820,
    sellPrice: 950,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-01-15',
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-01-15T08:30:00Z',
    notes: '',
  },

  // ── Open Box 
  {
    id: 'ph_002',
    imei: '490154203237518',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    color: 'Phantom Black',
    ram: '12GB',
    rom: '512GB',
    condition: 'Open Box',
    batteryHealth: 100,
    purchasePrice: 700,
    sellPrice: 880,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-01-18',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
    notes: 'Box opened for display only',
  },

  // ── Used phone with low battery 
  {
    id: 'ph_003',
    imei: '011020002955751',
    brand: 'Xiaomi',
    model: 'Redmi Note 12 Pro',
    color: 'Glacier Blue',
    ram: '8GB',
    rom: '128GB',
    condition: 'Used',
    batteryHealth: 87,
    purchasePrice: 150,
    sellPrice: 210,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-01-20',
    createdAt: '2026-01-20T09:15:00Z',
    updatedAt: '2026-01-20T09:15:00Z',
    notes: 'Minor scratch on back cover',
  },

  // ── Already sold phone (for Inventory table filtering) ────
  {
    id: 'ph_004',
    imei: '356093046235857',
    brand: 'Apple',
    model: 'iPhone 13',
    color: 'Midnight',
    ram: '4GB',
    rom: '128GB',
    condition: 'Used',
    batteryHealth: 91,
    purchasePrice: 400,
    sellPrice: 520,
    currency: 'USD',
    stockStatus: 'Sold',
    dateAdded: '2026-01-10',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-02-05T14:30:00Z',
    notes: '',
  },

  // ── Standard available
  {
    id: 'ph_005',
    imei: '867143040490089',
    brand: 'OnePlus',
    model: '11 5G',
    color: 'Titan Black',
    ram: '16GB',
    rom: '256GB',
    condition: 'Brand New',
    batteryHealth: 100,
    purchasePrice: 550,
    sellPrice: 680,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-02-01',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
    notes: '',
  },

  // ── EDGE CASE: Very old phone (Stock Aging test) 
  {
    id: 'ph_006',
    imei: '123456789012347',
    brand: 'Samsung',
    model: 'Galaxy A32',
    color: 'Awesome Blue',
    ram: '4GB',
    rom: '64GB',
    condition: 'Used',
    batteryHealth: 79,
    purchasePrice: 90,
    sellPrice: 130,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2025-10-01', // ← Over 90 days ago
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-01T09:00:00Z',
    notes: 'Sitting in stock for a long time',
  },

  // ── EDGE CASE: Critical battery (Used phone) 
  {
    id: 'ph_007',
    imei: '356938035643809',
    brand: 'Apple',
    model: 'iPhone 11',
    color: 'White',
    ram: '4GB',
    rom: '64GB',
    condition: 'Used',
    batteryHealth: 71, // ← Low battery health
    purchasePrice: 200,
    sellPrice: 270,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-01-28',
    createdAt: '2026-01-28T12:00:00Z',
    updatedAt: '2026-01-28T12:00:00Z',
    notes: 'Battery needs replacement soon',
  },

  // ── EDGE CASE: Sold phone with trade-in origin
  {
    id: 'ph_008',
    imei: '990000862471854',
    brand: 'Huawei',
    model: 'P30 Pro',
    color: 'Aurora',
    ram: '8GB',
    rom: '256GB',
    condition: 'Used',
    batteryHealth: 83,
    purchasePrice: 0, // ← Came in via trade-in
    sellPrice: 180,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-02-03',
    createdAt: '2026-02-03T14:00:00Z',
    updatedAt: '2026-02-03T14:00:00Z',
    notes: 'Received as trade-in from customer',
  },

  // ── EDGE CASE: Extremely high-value phone 
  {
    id: 'ph_009',
    imei: '357192090678932',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    color: 'Natural Titanium',
    ram: '8GB',
    rom: '1TB',
    condition: 'Brand New',
    batteryHealth: 100,
    purchasePrice: 1350,
    sellPrice: 1600,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-02-05',
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-02-05T09:00:00Z',
    notes: 'Top of the line — high-value item',
  },
];
// LAPTOPS  (Unique Items — Serial tracked)

export const mockLaptops = [
  {
    id: 'lp_001',
    serialNumber: 'SN-MBP-2024-001',
    brand: 'Apple',
    model: 'MacBook Pro M3',
    cpu: 'Apple M3 Pro',
    gpu: 'Integrated 18-core GPU',
    ram: '18GB',
    storage: '512GB SSD',
    storageType: 'SSD',
    screenSize: '14"',
    condition: 'Brand New',
    purchasePrice: 1600,
    sellPrice: 1900,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-01-25',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
    notes: '',
  },
  {
    id: 'lp_002',
    serialNumber: 'SN-DELL-2023-007',
    brand: 'Dell',
    model: 'XPS 15',
    cpu: 'Intel Core i7-13700H',
    gpu: 'NVIDIA RTX 4060',
    ram: '16GB',
    storage: '1TB SSD',
    storageType: 'SSD',
    screenSize: '15.6"',
    condition: 'Used',
    purchasePrice: 900,
    sellPrice: 1100,
    currency: 'USD',
    stockStatus: 'Available',
    dateAdded: '2026-02-02',
    createdAt: '2026-02-02T11:00:00Z',
    updatedAt: '2026-02-02T11:00:00Z',
    notes: 'Comes with original charger',
  },

  // ── EDGE CASE: Already sold laptop 
  {
    id: 'lp_003',
    serialNumber: 'SN-HP-2022-015',
    brand: 'HP',
    model: 'EliteBook 840 G9',
    cpu: 'Intel Core i5-1235U',
    gpu: 'Intel Iris Xe',
    ram: '16GB',
    storage: '512GB SSD',
    storageType: 'SSD',
    screenSize: '14"',
    condition: 'Used',
    purchasePrice: 500,
    sellPrice: 680,
    currency: 'USD',
    stockStatus: 'Sold',
    dateAdded: '2025-12-10',
    createdAt: '2025-12-10T08:00:00Z',
    updatedAt: '2026-01-20T15:00:00Z',
    notes: '',
  },
];

//   ACCESSORIES  (Bulk Items — Qty tracked)
//  All accessories now have a 'category' field
export const mockAccessories = [
  // ── Normal stock 
  {
    id: 'acc_001',
    name: 'iPhone 15 Silicone Case',
    category: 'Case', 
    brand: 'Apple',
    compatibleWith: 'iPhone 15',
    quantity: 35,
    lowStockThreshold: 10,
    purchasePrice: 3,
    sellPrice: 8,
    currency: 'USD',
    dateAdded: '2026-01-12',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'acc_002',
    name: 'Samsung 25W Super Fast Charger',
    category: 'Charger',
    brand: 'Samsung',
    compatibleWith: 'Samsung Galaxy Series',
    quantity: 20,
    lowStockThreshold: 5,
    purchasePrice: 8,
    sellPrice: 18,
    currency: 'USD',
    dateAdded: '2026-01-14',
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z',
  },
  {
    id: 'acc_003',
    name: 'Tempered Glass Screen Protector (6.7")',
    category: 'Screen Protector',
    brand: 'Generic',
    compatibleWith: 'Universal 6.7 inch',
    quantity: 80,
    lowStockThreshold: 20,
    purchasePrice: 1,
    sellPrice: 3,
    currency: 'USD',
    dateAdded: '2026-01-16',
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z',
  },

  // ── EDGE CASE: Below threshold (triggers low stock alert) ─
  {
    id: 'acc_004',
    name: 'USB-C to USB-C Cable (1m)',
    category: 'Cable',
    brand: 'Anker',
    compatibleWith: 'Universal USB-C',
    quantity: 4, // ← BELOW threshold of 10
    lowStockThreshold: 10,
    purchasePrice: 4,
    sellPrice: 9,
    currency: 'USD',
    dateAdded: '2026-01-18',
    createdAt: '2026-01-18T11:00:00Z',
    updatedAt: '2026-02-04T11:00:00Z',
  },
  {
    id: 'acc_005',
    name: 'Wireless Earbuds (TWS)',
    category: 'Audio',
    brand: 'Generic',
    compatibleWith: 'Universal Bluetooth',
    quantity: 15,
    lowStockThreshold: 5,
    purchasePrice: 10,
    sellPrice: 25,
    currency: 'USD',
    dateAdded: '2026-02-03',
    createdAt: '2026-02-03T12:00:00Z',
    updatedAt: '2026-02-03T12:00:00Z',
  },

  // ── EDGE CASE: Quantity = 0 (out of stock) 
  {
    id: 'acc_006',
    name: 'Lightning to USB-A Cable (1m)',
    category: 'Cable',
    brand: 'Apple',
    compatibleWith: 'iPhone, iPad (Lightning)',
    quantity: 0, // ← OUT OF STOCK
    lowStockThreshold: 10,
    purchasePrice: 5,
    sellPrice: 12,
    currency: 'USD',
    dateAdded: '2026-01-05',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-02-06T08:00:00Z',
  },

  // ── EDGE CASE: Exactly AT threshold 
  {
    id: 'acc_007',
    name: 'Samsung Galaxy Buds 2',
    category: 'Audio',
    brand: 'Samsung',
    compatibleWith: 'Universal Bluetooth',
    quantity: 5, // ← EXACTLY at threshold
    lowStockThreshold: 5,
    purchasePrice: 55,
    sellPrice: 80,
    currency: 'USD',
    dateAdded: '2026-01-22',
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
  },

  // ── High-value accessory
  {
    id: 'acc_008',
    name: 'MagSafe Charger 15W',
    category: 'Charger',
    brand: 'Apple',
    compatibleWith: 'iPhone 12 and above',
    quantity: 12,
    lowStockThreshold: 5,
    purchasePrice: 28,
    sellPrice: 45,
    currency: 'USD',
    dateAdded: '2026-01-30',
    createdAt: '2026-01-30T10:00:00Z',
    updatedAt: '2026-01-30T10:00:00Z',
  },

  // ── AFN-priced accessory 
  {
    id: 'acc_009',
    name: 'Phone Cleaning Kit',
    category: 'Care',
    brand: 'Generic',
    compatibleWith: 'Universal',
    quantity: 50,
    lowStockThreshold: 15,
    purchasePrice: 50, // in AFN
    sellPrice: 120,
    currency: 'AFN',
    dateAdded: '2026-02-01',
    createdAt: '2026-02-01T08:30:00Z',
    updatedAt: '2026-02-01T08:30:00Z',
  },
];

//   CUSTOMERS
//   Edge cases: zero debt, very high debt, AFN debt, over-paid
export const mockCustomers = [
  // ── Normal customer with USD debt 
  {
    id: 'cust_001',
    name: 'Ahmad Karimi',
    phone: '+93 700 123 456',
    email: '',
    debtAmount: 150, // USD debt
    currency: 'USD',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-01T14:00:00Z',
    notes: 'Regular customer — pays on time',
  },

  // ── Fully settled customer 
  {
    id: 'cust_002',
    name: 'Fatima Noori',
    phone: '+93 799 654 321',
    email: '',
    debtAmount: 0, // ← SETTLED
    currency: 'USD',
    createdAt: '2026-01-22T11:00:00Z',
    updatedAt: '2026-02-05T14:30:00Z',
    notes: '',
  },

  // ── AFN debt customer 
  {
    id: 'cust_003',
    name: 'Reza Ahmadi',
    phone: '+93 701 987 654',
    email: '',
    debtAmount: 3500, // AFN debt
    currency: 'AFN',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
    notes: 'Owes from iPhone 13 purchase',
  },

  // ── EDGE CASE: Very high debt
  {
    id: 'cust_004',
    name: 'Wahid Sultani',
    phone: '+93 702 111 222',
    email: '',
    debtAmount: 2800, // ← VERY HIGH — MacBook Pro purchase
    currency: 'USD',
    createdAt: '2026-01-25T13:00:00Z',
    updatedAt: '2026-01-25T13:00:00Z',
    notes: 'Bought MacBook Pro — installment agreement',
  },

  // ── EDGE CASE: New customer, no purchase yet 
  {
    id: 'cust_005',
    name: 'Mariam Hussaini',
    phone: '+93 703 333 444',
    email: '',
    debtAmount: 0,
    currency: 'USD',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
    notes: 'Walk-in customer — first visit',
  },

  // ── EDGE CASE: Customer with very small remaining debt 
  {
    id: 'cust_006',
    name: 'Sayed Khalid',
    phone: '+93 704 555 666',
    email: '',
    debtAmount: 5, // ← only $5 remaining
    currency: 'USD',
    createdAt: '2026-01-30T09:00:00Z',
    updatedAt: '2026-02-04T16:00:00Z',
    notes: 'Almost paid off — $5 remaining',
  },
];
//  SALES HISTORY
// Multiple entries for chart/report testing
export const mockSales = [
  {
    id: 'sale_001',
    customerId: 'cust_002',
    customerName: 'Fatima Noori',
    items: [
      {
        itemId: 'ph_004',
        type: 'phone',
        name: 'iPhone 13 — Midnight 128GB',
        imei: '356093046235857',
        sellPrice: 520,
        quantity: 1,
      },
    ],
    totalAmount: 520,
    amountPaid: 520,
    dueAmount: 0,
    currency: 'USD',
    saleType: 'Standard',
    saleDate: '2026-02-05',
    createdAt: '2026-02-05T14:30:00Z',
    invoiceNumber: 'INV-2026-0001',
  },

  // ── Sale with partial payment (Khata)
  {
    id: 'sale_002',
    customerId: 'cust_001',
    customerName: 'Ahmad Karimi',
    items: [
      {
        itemId: 'ph_002',
        type: 'phone',
        name: 'Galaxy S23 Ultra — Phantom Black',
        imei: '490154203237518',
        sellPrice: 880,
        quantity: 1,
      },
    ],
    totalAmount: 880,
    amountPaid: 730,
    dueAmount: 150, // ← Goes to Khata
    currency: 'USD',
    saleType: 'Standard',
    saleDate: '2026-02-06',
    createdAt: '2026-02-06T11:00:00Z',
    invoiceNumber: 'INV-2026-0002',
  },

  // ── Exchange / Trade-in sale 
  {
    id: 'sale_003',
    customerId: 'cust_003',
    customerName: 'Reza Ahmadi',
    items: [
      {
        itemId: 'ph_001',
        type: 'phone',
        name: 'iPhone 14 Pro — Deep Purple 256GB',
        imei: '352099001761481',
        sellPrice: 950,
        quantity: 1,
      },
    ],
    tradeIn: {
      brand: 'Samsung',
      model: 'Galaxy S21',
      imei: '990000862471854',
      tradeInValue: 300,
    },
    totalAmount: 950,
    tradeInDeduction: 300,
    amountPaid: 300,
    dueAmount: 350,
    currency: 'USD',
    saleType: 'Exchange',
    saleDate: '2026-02-06',
    createdAt: '2026-02-06T13:00:00Z',
    invoiceNumber: 'INV-2026-0003',
  },

  // ── Accessory-only sale 
  {
    id: 'sale_004',
    customerId: 'cust_005',
    customerName: 'Mariam Hussaini',
    items: [
      {
        itemId: 'acc_001',
        type: 'accessory',
        name: 'iPhone 15 Silicone Case',
        sellPrice: 8,
        quantity: 2,
      },
      {
        itemId: 'acc_003',
        type: 'accessory',
        name: 'Tempered Glass Screen Protector (6.7")',
        sellPrice: 3,
        quantity: 1,
      },
    ],
    totalAmount: 19,
    amountPaid: 19,
    dueAmount: 0,
    currency: 'USD',
    saleType: 'Standard',
    saleDate: '2026-02-06',
    createdAt: '2026-02-06T15:00:00Z',
    invoiceNumber: 'INV-2026-0004',
  },
];


//  EXPENSES (Roznamcha)
//  More entries for cashbox testing
export const mockExpenses = [
  {
    id: 'exp_001',
    category: 'Rent',
    description: 'Monthly shop rent — February',
    amount: 200,
    currency: 'USD',
    date: '2026-02-01',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'exp_002',
    category: 'Electricity',
    description: 'Electricity bill — February',
    amount: 1500,
    currency: 'AFN',
    date: '2026-02-03',
    createdAt: '2026-02-03T09:00:00Z',
  },
  {
    id: 'exp_003',
    category: 'Staff Lunch',
    description: 'Team lunch Thursday',
    amount: 300,
    currency: 'AFN',
    date: '2026-02-06',
    createdAt: '2026-02-06T13:00:00Z',
  },
  {
    id: 'exp_004',
    category: 'Internet',
    description: 'Monthly internet subscription',
    amount: 25,
    currency: 'USD',
    date: '2026-02-01',
    createdAt: '2026-02-01T08:30:00Z',
  },

  // ── EDGE CASE: Very large expense 
  {
    id: 'exp_005',
    category: 'Other',
    description: 'Shop renovation — paint & fixtures',
    amount: 450,
    currency: 'USD',
    date: '2026-01-28',
    createdAt: '2026-01-28T16:00:00Z',
  },

  // ── EDGE CASE: Small daily expense 
  {
    id: 'exp_006',
    category: 'Staff Lunch',
    description: 'Staff tea & snacks',
    amount: 150,
    currency: 'AFN',
    date: '2026-02-05',
    createdAt: '2026-02-05T12:00:00Z',
  },
];

//  CATEGORIES  (for Accessory dropdowns)

export const ACCESSORY_CATEGORIES = [
  'Case',
  'Screen Protector',
  'Charger',
  'Cable',
  'Audio',
  'Care',
  'Power Bank',
  'Holder / Stand',
  'Memory Card',
  'Other',
];

//  BRANDS
export const PHONE_BRANDS = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'OnePlus',
  'Huawei',
  'Oppo',
  'Vivo',
  'Realme',
  'Nokia',
  'Sony',
  'Motorola',
  'Other',
];

export const LAPTOP_BRANDS = [
  'Apple',
  'Dell',
  'HP',
  'Lenovo',
  'Asus',
  'Acer',
  'Microsoft',
  'MSI',
  'Other',
];

//  CONDITIONS
export const CONDITIONS = ['Brand New', 'Open Box', 'Used'];

//  EXPENSE CATEGORIES

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Electricity',
  'Internet',
  'Staff Lunch',
  'Staff Salary',
  'Transport',
  'Other',
];
