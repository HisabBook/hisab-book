// All prices are stored in the base currency (USD).
// All timestamps are in ISO 8601 format for easy parsing.

// 1. PHONES (Unique Items)
export const mockPhones = [
  {
    id: 'phone_001',
    imei: '358123456789012',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max (256GB)',
    condition: 'New',
    purchasePrice: 1050,
    sellPrice: 1200,
    stockStatus: 'Available',
    dateAdded: '2026-02-10T10:00:00.000Z',
    dateSold: null,
  },
  {
    id: 'phone_002',
    imei: '358987654321098',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra (512GB)',
    condition: 'New',
    purchasePrice: 1100,
    sellPrice: 1250,
    stockStatus: 'Available',
    dateAdded: '2026-03-01T11:30:00.000Z',
    dateSold: null,
  },
  {
    id: 'phone_003',
    imei: '352223334445556',
    brand: 'Apple',
    model: 'iPhone 13 (128GB)',
    condition: 'Used',
    batteryHealth: 92, // Important detail for used phones
    purchasePrice: 400,
    sellPrice: 480,
    stockStatus: 'Available',
    dateAdded: '2026-03-15T14:00:00.000Z',
    dateSold: null,
  },
  {
    id: 'phone_004',
    imei: '351112223334445',
    brand: 'Xiaomi',
    model: 'Redmi Note 13 Pro',
    condition: 'New',
    purchasePrice: 250,
    sellPrice: 300,
    stockStatus: 'Sold',
    dateAdded: '2026-02-20T09:00:00.000Z',
    dateSold: '2026-03-18T18:05:00.000Z',
  },
];

// 2. ACCESSORIES (Bulk Items)
export const mockAccessories = [
  {
    id: 'acc_001',
    name: 'Apple 20W USB-C Power Adapter',
    category: 'Chargers',
    quantityInStock: 45,
    purchasePrice: 12,
    sellPrice: 20,
    dateAdded: '2026-02-10T10:05:00.000Z',
  },
  {
    id: 'acc_002',
    name: 'Samsung 45W Fast Charger',
    category: 'Chargers', // TASK: Added category
    quantityInStock: 20,
    purchasePrice: 15,
    sellPrice: 25,
    dateAdded: '2026-02-10T10:05:00.000Z',
  },
  {
    id: 'acc_003',
    name: 'iPhone 15 Pro Clear Case',
    category: 'Cases', // TASK: Added category
    quantityInStock: 100,
    purchasePrice: 3,
    sellPrice: 10,
    dateAdded: '2026-03-01T11:35:00.000Z',
  },
  {
    id: 'acc_004',
    name: 'AirPods Pro (2nd Gen) Copy',
    category: 'Audio',
    quantityInStock: 0,
    purchasePrice: 15,
    sellPrice: 30,
    dateAdded: '2026-02-15T12:00:00.000Z',
  },
];

// 3. CUSTOMERS (For Khata/Debt System)
export const mockCustomers = [
  {
    id: 'cust_001',
    name: 'Ahmad Khan',
    phone: '0701234567',
    balance: 0, // Renamed from debtAmount. 0 means settled.
    lastTransactionDate: '2026-03-10T11:00:00.000Z',
  },
  {
    id: 'cust_002',
    name: 'Mahmood Ali',
    phone: '0789876543',
    balance: 150, // Positive number means customer owes money.
    lastTransactionDate: '2026-03-12T13:00:00.000Z',
  },
  {
    id: 'cust_003',
    name: 'Zahra Karimi',
    phone: '0799998877',
    balance: 45,
    lastTransactionDate: '2026-03-18T19:00:00.000Z',
  },
  {
    id: 'cust_004',
    name: 'Zubair Safi',
    phone: '0777555666',
    balance: 2500, // EDGE CASE: Customer with very high debt
    lastTransactionDate: '2026-02-28T17:45:00.000Z',
  },
  {
    id: 'cust_005',
    name: 'Nadia Azizi',
    phone: '0722777888',
    balance: -50, // EDGE CASE: Customer has credit (overpaid or returned item)
    lastTransactionDate: '2026-03-16T10:15:00.000Z',
  },
];

// 4. GLOBAL SETTINGS (For Exchange Rate, Theme, etc.)
export const mockSettings = {
  shopName: 'HisabBook Mobile',
  shopAddress: 'Kabul, Afghanistan',
  shopLogo: null,
  theme: 'light',
  language: 'en',
  primaryCurrency: 'AFN',
  baseCurrency: 'USD',
  exchangeRate: 70.0, // USD = 70 AFN. Change this one value to update all prices.
};

// 5. COMBINED DATABASE EXPORT
export const mockDatabase = {
  phones: mockPhones,
  accessories: mockAccessories,
  customers: mockCustomers,
  settings: mockSettings, // Added settings to the main export
};
