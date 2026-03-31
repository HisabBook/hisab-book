export const mockPhones = [
  {
    id: "phone_001",
    imei: "358123456789012",
    brand: "Apple",
    model: "iPhone 15 Pro Max (256GB)",
    condition: "New",
    purchasePrice: 1050, // Prices in USD for standard global base
    sellPrice: 1200,
    stockStatus: "Available",
  },
  {
    id: "phone_002",
    imei: "358987654321098",
    brand: "Samsung",
    model: "Galaxy S24 Ultra (512GB)",
    condition: "New",
    purchasePrice: 1100,
    sellPrice: 1250,
    stockStatus: "Available",
  },
  {
    id: "phone_003",
    imei: "352223334445556",
    brand: "Apple",
    model: "iPhone 13 (128GB)",
    condition: "Used",
    purchasePrice: 400,
    sellPrice: 480,
    stockStatus: "Available",
  },
  {
    id: "phone_004",
    imei: "351112223334445",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro",
    condition: "New",
    purchasePrice: 250,
    sellPrice: 300,
    stockStatus: "Sold", // This helps test UI filters (hiding sold items)
  },
];

// 2. ACCESSORIES (Bulk Items: Tracked by Quantity)
export const mockAccessories = [
  {
    id: "acc_001",
    name: "Apple 20W USB-C Power Adapter",
    quantity: 45,
    purchasePrice: 12,
    sellPrice: 20,
  },
  {
    id: "acc_002",
    name: "Samsung 45W Fast Charger",
    quantity: 20,
    purchasePrice: 15,
    sellPrice: 25,
  },
  {
    id: "acc_003",
    name: "iPhone 15 Pro Clear Case",
    quantity: 100,
    purchasePrice: 3,
    sellPrice: 10,
  },
  {
    id: "acc_004",
    name: "AirPods Pro (2nd Gen) Copy", // Common in local markets
    quantity: 0, // Helps test "Out of Stock" warnings in the UI
    purchasePrice: 15,
    sellPrice: 30,
  },
];

// 3. CUSTOMERS (For Khata/Debt System and POS Receipts)
export const mockCustomers = [
  {
    id: "cust_001",
    name: "Ahmad Khan",
    phone: "0701234567",
    debtAmount: 0, // Green indicator (Settled/No Debt)
  },
  {
    id: "cust_002",
    name: "Mahmood Ali",
    phone: "0789876543",
    debtAmount: 150, // Red indicator (Owes $150 in Khata)
  },
  {
    id: "cust_003",
    name: "Zahra Karimi",
    phone: "0799998877",
    debtAmount: 45, // Red indicator
  },
];

// Export all together just in case the team needs the whole database object
export const mockDatabase = {
  phones: mockPhones,
  accessories: mockAccessories,
  customers: mockCustomers,
};
