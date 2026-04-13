// Prices are in USD as the standard global base currency.
// Timestamps are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) for easy parsing.

// 1. MOCK PHONES (UNIQUE ITEMS) - Expanded with timestamps and a 'Sold' example
export const mockPhones = [
  {
    id: 'phone_001',
    imei: '358123456789012',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max (256GB)',
    condition: 'New',
    purchasePrice: 1050, // Base currency (USD)
    sellPrice: 1200, // Base currency (USD)
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
    purchasePrice: 1100, // Base currency (USD)
    sellPrice: 1250, // Base currency (USD)
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
    batteryHealth: 92,
    purchasePrice: 400, // Base currency (USD)
    sellPrice: 550, // Base currency (USD)
    stockStatus: 'Available',
    dateAdded: '2026-03-15T14:00:00.000Z',
    dateSold: null,
  },
  {
    id: 'phone_004',
    imei: '359998887776665',
    brand: 'Google',
    model: 'Pixel 8 Pro (256GB)',
    condition: 'Open Box',
    purchasePrice: 700, // Base currency (USD)
    sellPrice: 850, // Base currency (USD)
    stockStatus: 'Sold',
    dateAdded: '2026-02-20T09:00:00.000Z',
    dateSold: '2026-03-18T18:05:00.000Z',
  },
];
// 2. MOCK ACCESSORIES (BULK ITEMS) - With categories and an out-of-stock edge case
export const mockAccessories = [
  {
    id: 'acc_001',
    name: 'iPhone 15 Pro Silicone Case',
    category: 'Cases',
    purchasePrice: 10, // Base currency (USD)
    sellPrice: 20, // Base currency (USD)
    quantityInStock: 50,
    dateAdded: '2026-02-10T10:05:00.000Z',
  },
  {
    id: 'acc_002',
    name: 'Anker 30W USB-C Charger',
    category: 'Chargers',
    purchasePrice: 15, // Base currency (USD)
    sellPrice: 25, // Base currency (USD)
    quantityInStock: 30,
    dateAdded: '2026-02-10T10:05:00.000Z',
  },
  {
    id: 'acc_003',
    name: 'Samsung Galaxy Buds Pro',
    category: 'Audio',
    purchasePrice: 80, // Base currency (USD)
    sellPrice: 120, // Base currency (USD)
    quantityInStock: 15,
    dateAdded: '2026-03-05T16:20:00.000Z',
  },
  {
    id: 'acc_004',
    name: 'Glass Screen Protector for S24 Ultra',
    category: 'Protection',
    purchasePrice: 5, // Base currency (USD)
    sellPrice: 10, // Base currency (USD)
    quantityInStock: 0,
    dateAdded: '2026-02-15T12:00:00.000Z',
  },
];

// 3. MOCK CUSTOMERS (KHATA) - With high debt and negative debt (credit) edge cases
export const mockCustomers = [
  {
    id: 'cust_001',
    name: 'Ahmad Wali',
    phone: '0788111222',
    balance: 150.0, // Balance in base currency (USD)
    lastTransactionDate: '2026-03-12T13:00:00.000Z',
  },
  {
    id: 'cust_002',
    name: 'Fatima Noori',
    phone: '0799333444',
    balance: 0.0,
    lastTransactionDate: '2026-03-10T11:00:00.000Z',
  },
  {
    id: 'cust_003',
    name: 'Zubair Khan',
    phone: '0777555666',
    balance: 2500.0,
    lastTransactionDate: '2026-02-28T17:45:00.000Z',
  },
  {
    id: 'cust_004',
    name: 'Nadia Azizi',
    phone: '0722777888',
    balance: -50.0,
    lastTransactionDate: '2026-03-16T10:15:00.000Z',
  },
];
// 4. MOCK SETTINGS - The central place for global configuration like exchange rates
export const mockSettings = {
  shopName: 'Herat Mobile Plaza',
  shopAddress: 'Herat, Afghanistan',
  shopLogo: null, // or a path to a default logo asset
  theme: 'light',
  language: 'en',
  primaryCurrency: 'AFN', // User's preferred display currency
  baseCurrency: 'USD',
  exchangeRate: 70.0, // The most important field: 1 USD = 70 AFN
};
