# HisabBook

**Smart Inventory, POS & Digital Ledger for Mobile & Electronics Shops**

---

## Overview

HisabBook is a frontend web application designed as a **smart assistant** for mobile and electronics shop owners.
It automates inventory management, sales tracking, and financial calculations in real-time — replacing traditional paper-based systems.

---

## Core Features

- Inventory Management (Unique & Bulk Items)
- Point of Sale (POS) System
- Digital Khata (Customer Credit Tracking)
- Roznamcha (Expenses & Cashbox)
- Dashboard & Business Reports
- Multi-Currency Support (USD & AFN)

---

## Concept

The system is built to ensure that every sale:

- Automatically updates inventory
- Calculates profit instantly
- Adjusts cash records

---

## Tech Stack

- React.js
- Material UI (MUI)
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- LocalStorage + redux-persist
- Recharts
- jsPDF

---

## Team

- Satayesh Esmaily
- Setayesh Azizi
- Somaiya Noori

---

## Project Info

- **Start Date:** Feb 6, 2026
- **Duration:** 6 Months
- **Type:** Frontend Web Application

---
## Project Directory Structure
```text
HISAB-BOOK/
├── config.js                   # Global environment config (App Version, API Endpoints)
├── public/                     # Static assets directly served by the browser
│   ├── assets/                 # Brand logos, shop banners, and high-res icons
│   └── favicon.svg             # Application tab icon
├── src/
│   ├── app/
│   │   └── rootReducer.js      # Centralized reducer combining all feature slices
│   ├── components/
│   │   ├── layout/             # High-level structural components
│   │   │   ├── MainLayout.jsx  # Primary wrapper with Sidebar and Topbar
│   │   │   ├── Sidebar.jsx     # Navigation drawer with RTL/LTR awareness
│   │   │   └── Topbar.jsx      # Header containing Global Search and Profile
│   │   ├── shared/             # Business components used across multiple modules
│   │   │   ├── CurrencyDisplay.jsx # Dynamic AFN/USD price formatter
│   │   │   ├── LanguageSwitcher.jsx # Logic to toggle English, Persian, and Pashto
│   │   │   └── ThemeToggle.jsx  # Switcher for Light and Dark visual modes
│   │   └── ui/                 # Atomic UI components (Reusable & Generic)
│   │       ├── ConfirmDialog.jsx # Modal for Delete/Reset confirmation
│   │       ├── EmptyState.jsx    # Visual shown when a table or search has no data
│   │       ├── KPICard.jsx       # Stat boxes for Dashboard (e.g. Total Inventory Value)
│   │       ├── LoadingSpinner.jsx # Standardized circular progress indicator
│   │       ├── PageHeader.jsx    # Standardized title bar with breadcrumbs and actions
│   │       ├── SkeletonLoader.jsx # Ghost UI used during data loading states
│   │       └── StatusBadge.jsx   # Color-coded chips (e.g., Sold: Red, Available: Green)
│   ├── constants/              # Immutable configuration and dropdown data
│   │   ├── brands.js           # Static list of supported brands (Apple, Samsung, etc.)
│   │   ├── categories.js       # Inventory types (Phones, Laptops, Accessories)
│   │   ├── conditions.js       # Device states (Brand New, Used, Open Box)
│   │   ├── expenseTypes.js     # Categories for Roznamcha (Rent, Staff, Electricity)
│   │   └── routePaths.js       # Centralized file for all internal application URLs
│   ├── hooks/                  # Global custom React hooks
│   │   ├── useCurrencyConverter.js # Hook to calculate prices based on Daily Rate
│   │   ├── useLanguageDirection.js # Hook to detect and apply RTL/LTR styling
│   │   └── useLocalStorage.js  # Wrapper for browser persistence logic
│   ├── locales/                # Internationalization (i18n) dictionaries
│   │   ├── en.json             # English (LTR) translation keys
│   │   ├── fa.json             # Persian/Dari (RTL) translation keys
│   │   └── ps.json             # Pashto (RTL) translation keys
│   ├── mockData/               
│   │   └── initialData.js      # Seed data for initial app state and prototyping
│   ├── pages/                  # Main application views (Feature-based folders)
│   │   ├── dashboard/          # Analytics & Business Intelligence
│   │   │   ├── components/
│   │   │   │   ├── ActivityFeed.jsx   # Log of recent sales and updates
│   │   │   │   ├── LowStockAlerts.jsx # List of accessories requiring restock
│   │   │   │   ├── SalesTrendChart.jsx # Recharts visualization of daily income
│   │   │   │   └── StockDistributionChart.jsx # Pie chart of brand market share
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardData.js # Logic to aggregate Redux state for charts
│   │   │   │   └── useDashboardPage.js # Page-level lifecycle management
│   │   │   └── DashboardPage.jsx
│   │   ├── inventory/          # Stock and Device Management
│   │   │   ├── components/
│   │   │   │   ├── AccessoriesTable.jsx # MUI DataGrid for bulk quantity items
│   │   │   │   ├── AddAccessoryForm.jsx # Form for non-serialized stock
│   │   │   │   ├── AddLaptopForm.jsx    # Specs form (CPU, RAM, GPU)
│   │   │   │   ├── AddPhoneForm.jsx     # IMEI tracking form for smartphones
│   │   │   │   ├── InventoryFilters.jsx # Advanced search by Brand/Condition/IMEI
│   │   │   │   ├── LaptopsTable.jsx     # Detailed grid for unique laptops
│   │   │   │   └── PhonesTable.jsx      # Detailed grid for unique IMEIs
│   │   │   ├── hooks/
│   │   │   │   └── useInventoryFilters.js # Shared logic for searching through stock
│   │   │   └── InventoryPage.jsx
│   │   ├── khata/              # Digital Credit Ledger
│   │   │   ├── components/
│   │   │   │   ├── AddKhataEntry.jsx    # Create a new debtor/customer record
│   │   │   │   ├── CustomerDebtTable.jsx # Summary of who owes money
│   │   │   │   └── RepaymentModal.jsx   # Record partial payments against a debt
│   │   │   └── KhataPage.jsx
│   │   ├── pos/                # Point of Sale interface
│   │   │   ├── components/
│   │   │   │   ├── CartItem.jsx         # Individual device/accessory in checkout
│   │   │   │   ├── CartPanel.jsx        # Sidebar managing the active bill
│   │   │   │   ├── CheckoutModal.jsx    # Payment selection (AFN vs USD)
│   │   │   │   ├── CustomerForm.jsx     # Customer identification for warranty
│   │   │   │   ├── ReceiptPreview.jsx   # Live preview of the printable invoice
│   │   │   │   ├── SearchBar.jsx        # Rapid IMEI search bar for fast sales
│   │   │   │   └── TradeInForm.jsx      # Logic for deducting old phone values
│   │   │   ├── hooks/
│   │   │   │   └── useCheckout.js       # Logic to finalize sales and sync with inventory
│   │   │   └── POSPage.jsx
│   │   ├── reports/            # Performance and P&L Reports
│   │   │   ├── components/
│   │   │   │   ├── BestSellersReport.jsx # Visualization of top moving products
│   │   │   │   ├── ProfitLossReport.jsx  # Date-filtered income vs expense report
│   │   │   │   └── StockAgingReport.jsx  # Analysis of "dead stock" (old items)
│   │   │   └── ReportsPage.jsx
│   │   ├── roznamcha/          # Daily Cashbook and Shop Expenses
│   │   │   ├── components/
│   │   │   │   ├── AddExpenseForm.jsx   # Log daily costs (Food, Rent, Internet)
│   │   │   │   ├── CashboxSummary.jsx   # Sync between system cash and physical drawer
│   │   │   │   └── ExpenseTable.jsx     # Master list of daily expenditures
│   │   │   └── RoznamchaPage.jsx
│   │   ├── settings/           # App Configuration
│   │   │   ├── components/
│   │   │   │   ├── ExchangeRateForm.jsx # Daily USD-to-AFN rate configuration
│   │   │   │   ├── LanguageSettings.jsx # Switcher for En/Fa/Ps
│   │   │   │   ├── ShopProfileForm.jsx  # Edit Name, Logo, and Address for PDFs
│   │   │   │   └── ThemeSettings.jsx    # UI customization (Dark/Light)
            ├── utils/          # Settings-specific logic
│   │       │   └── generateInvoicePDF.js # Engine to build and download receipts
│   │   │   └── SettingsPage.jsx
│   │   └── NotFoundPage.jsx    # Custom 404 UI for incorrect routes
│   ├── redux/
│   │   ├── slices/             # Feature-specific state management (RTK)
│   │   │   ├── inventorySlice.js # Logic for stock updates and IMEI validation
│   │   │   ├── khataSlice.js     # Managing debts and repayment history
│   │   │   ├── posSlice.js       # Managing the temporary cart state
│   │   │   ├── roznamchaSlice.js # Logic for daily expenses and cash reconciliation
│   │   │   ├── salesSlice.js     # Permanent record of all finalized transactions
│   │   │   └── settingsSlice.js  # Global app settings (Exchange Rate, Lang, Theme)
│   │   └── store.js            # Main Redux Store configured with Redux-Persist
│   ├── routes/
│   │   ├── AppRouter.jsx       # Master URL mapping with Lazy Loading support
│   │   └── ProtectedLayout.jsx # Security wrapper (Auth/Permission check logic)
│   ├── theme/
│   │   ├── darkTheme.js        # Tokens for Dark Mode design
│   │   ├── lightTheme.js       # Tokens for Light Mode design
│   │   ├── muiTheme.js         # Material UI global overrides (Button, Table styles)
│   │   ├── rtlCache.js         # Cache configuration for Stylis-RTL (UI Flipping)
│   │   └── ThemeProviderWrapper.jsx # Context for injecting Theme/RTL globally
│   ├── utils/                  # Reusable business logic & helper functions
│   │   ├── cashboxCalculator.js # Algorithms for multi-currency cash balancing
│   │   ├── currencyFormatter.js # Logic to display prices based on selected locale
│   │   ├── dateFormatter.js     # Utility to standardize date displays
│   │   ├── imeiValidator.js     # Logic to prevent duplicate serial numbers
│   │   └── profitCalculator.js  # Formula for calculating net margins per sale
│   ├── App.jsx                 # Main entry component containing Providers
│   ├── i18n.js                 # Configuration for react-i18next framework
│   ├── index.css               # Global CSS & Tailwind injection point
│   └── main.jsx                # React DOM render root
├── .gitignore                  # Files excluded from version control
├── package.json                # Project dependencies and script shortcuts
├── vite.config.js              # Vite bundler and RTL compiler settings
└── README.md                   # Project documentation and team details 
```
## Getting Started / Installation

git clone [https://github.com/HisabBook/hisab-book.git]

npm install

npm run dev

---

## Status

Planning & Design Phase...

---

## Future Updates

This README will be updated with:

- Setup instructions
- Screenshots
- Live demo
- Project structure
- Features details

---
