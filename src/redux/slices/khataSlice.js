import { createSelector, createSlice } from '@reduxjs/toolkit';
import { mockCustomers, mockSales } from '../../mockData/initialData';
import { normalizeKhataPersistedState } from '../khataMigrations';

const ENTITY_STATUSES = {
  OPEN: 'open',
  PARTIAL: 'partial',
  SETTLED: 'settled',
};

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const createId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const asNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const nowIso = () => new Date().toISOString();

const deriveDebtStatus = (remainingBalance, paidAmount = 0, totalDebt = 0) => {
  if (remainingBalance <= 0 || totalDebt <= 0) {
    return ENTITY_STATUSES.SETTLED;
  }

  return paidAmount > 0 ? ENTITY_STATUSES.PARTIAL : ENTITY_STATUSES.OPEN;
};

const buildCollection = (items) => ({
  ids: items.map((item) => item.id),
  entities: items.reduce((accumulator, item) => {
    accumulator[item.id] = item;
    return accumulator;
  }, {}),
});

const createCustomerEntity = (customer, existingDebtIds = []) => {
  const totalDebt = Math.max(0, asNumber(customer.debtAmount));
  const paidAmount = Math.max(0, asNumber(customer.paidAmount));
  const remainingBalance =
    customer.remainingBalance != null
      ? Math.max(0, asNumber(customer.remainingBalance))
      : totalDebt;
  const status =
    customer.status ??
    deriveDebtStatus(remainingBalance, paidAmount, totalDebt);

  return {
    id: customer.id,
    name: customer.name ?? '',
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    currency: customer.currency ?? 'USD',
    notes: customer.notes ?? '',
    totalDebt,
    paidAmount,
    remainingBalance,
    status,
    debtIds: [...existingDebtIds],
    createdAt: customer.createdAt ?? nowIso(),
    updatedAt: customer.updatedAt ?? customer.createdAt ?? nowIso(),
  };
};

const createDebtEntity = ({
  id,
  customerId,
  totalDebt,
  paidAmount = 0,
  remainingBalance,
  currency = 'USD',
  linkedSaleId = null,
  linkedSaleNumber = null,
  linkedSaleDate = null,
  notes = '',
  createdAt,
  updatedAt,
  status,
}) => {
  const normalizedTotalDebt = Math.max(0, asNumber(totalDebt));
  const normalizedPaidAmount = Math.max(0, asNumber(paidAmount));
  const normalizedRemainingBalance =
    remainingBalance != null
      ? Math.max(0, asNumber(remainingBalance))
      : Math.max(0, normalizedTotalDebt - normalizedPaidAmount);

  return {
    id,
    customerId,
    totalDebt: normalizedTotalDebt,
    paidAmount: normalizedPaidAmount,
    remainingBalance: normalizedRemainingBalance,
    status:
      status ??
      deriveDebtStatus(
        normalizedRemainingBalance,
        normalizedPaidAmount,
        normalizedTotalDebt
      ),
    currency,
    linkedSaleId,
    linkedSaleNumber,
    linkedSaleDate,
    notes,
    createdAt: createdAt ?? nowIso(),
    updatedAt: updatedAt ?? createdAt ?? nowIso(),
  };
};

const createRepaymentEntity = ({
  id,
  debtId,
  customerId,
  amount,
  currency = 'USD',
  method = 'cash',
  notes = '',
  linkedSaleId = null,
  linkedSaleNumber = null,
  paidAt,
  createdAt,
  updatedAt,
}) => ({
  id,
  debtId,
  customerId,
  amount: Math.max(0, asNumber(amount)),
  currency,
  method,
  notes,
  linkedSaleId,
  linkedSaleNumber,
  paidAt: paidAt ?? createdAt ?? nowIso(),
  createdAt: createdAt ?? nowIso(),
  updatedAt: updatedAt ?? createdAt ?? nowIso(),
});

const createInitialState = () => {
  const customers = [];
  const debts = [];
  const repayments = [];
  const saleByCustomerId = new Map(
    mockSales
      .filter((sale) => asNumber(sale.dueAmount) > 0)
      .map((sale) => [sale.customerId, sale])
  );

  mockCustomers.forEach((customer) => {
    const sale = saleByCustomerId.get(customer.id);
    const customerDebtAmount = Math.max(0, asNumber(customer.debtAmount));
    const debtIds = [];

    if (customerDebtAmount > 0) {
      const debtId = createId('debt');
      debtIds.push(debtId);
      debts.push(
        createDebtEntity({
          id: debtId,
          customerId: customer.id,
          totalDebt: customerDebtAmount,
          currency: customer.currency ?? 'USD',
          linkedSaleId: sale?.id ?? null,
          linkedSaleNumber: sale?.invoiceNumber ?? null,
          linkedSaleDate: sale?.saleDate ?? null,
          notes: customer.notes ?? '',
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        })
      );
    }

    customers.push(createCustomerEntity(customer, debtIds));
  });

  return {
    customers: buildCollection(customers),
    debts: buildCollection(debts),
    repayments: buildCollection(repayments),
  };
};

const initialState = createInitialState();

const getCustomerDebtSummaries = (state, customerId) => {
  const debtList = state.debts.ids
    .map((debtId) => state.debts.entities[debtId])
    .filter((debt) => debt && debt.customerId === customerId);

  const repaymentList = state.repayments.ids
    .map((repaymentId) => state.repayments.entities[repaymentId])
    .filter((repayment) => repayment && repayment.customerId === customerId);

  const totals = debtList.reduce(
    (accumulator, debt) => {
      accumulator.totalDebt += asNumber(debt.totalDebt);
      accumulator.paidAmount += asNumber(debt.paidAmount);
      accumulator.remainingBalance += asNumber(debt.remainingBalance);
      return accumulator;
    },
    { totalDebt: 0, paidAmount: 0, remainingBalance: 0 }
  );

  const status =
    totals.remainingBalance <= 0
      ? ENTITY_STATUSES.SETTLED
      : totals.paidAmount > 0
        ? ENTITY_STATUSES.PARTIAL
        : ENTITY_STATUSES.OPEN;

  return {
    debtIds: debtList.map((debt) => debt.id),
    debtRecords: debtList,
    repayments: repaymentList,
    totalDebt: totals.totalDebt,
    paidAmount: totals.paidAmount,
    remainingBalance: totals.remainingBalance,
    status,
  };
};

const syncCustomerTotals = (state, customerId) => {
  const customer = state.customers.entities[customerId];
  if (!customer) return;

  const summary = getCustomerDebtSummaries(state, customerId);
  customer.debtIds = summary.debtIds;
  customer.totalDebt = summary.totalDebt;
  customer.paidAmount = summary.paidAmount;
  customer.remainingBalance = summary.remainingBalance;
  customer.status = summary.status;
  customer.updatedAt = nowIso();
};

const upsertCustomer = (state, customerPayload) => {
  const existingById = customerPayload.id
    ? state.customers.entities[customerPayload.id]
    : null;
  const existingByPhone = customerPayload.phone
    ? state.customers.ids
        .map((customerId) => state.customers.entities[customerId])
        .find(
          (customer) =>
            normalizeText(customer.phone) === normalizeText(customerPayload.phone)
        )
    : null;

  const existingCustomer = existingById ?? existingByPhone;

  if (existingCustomer) {
    const updatedCustomer = {
      ...existingCustomer,
      ...customerPayload,
      id: existingCustomer.id,
      updatedAt: customerPayload.updatedAt ?? nowIso(),
    };
    state.customers.entities[existingCustomer.id] = updatedCustomer;
    return updatedCustomer.id;
  }

  const id = customerPayload.id ?? createId('cust');
  state.customers.ids.push(id);
  state.customers.entities[id] = createCustomerEntity(
    {
      id,
      ...customerPayload,
    },
    customerPayload.debtIds ?? []
  );
  return id;
};

const khataSlice = createSlice({
  name: 'khata',
  initialState,
  reducers: {
    createCustomer(state, action) {
      upsertCustomer(state, action.payload ?? {});
    },
    updateCustomer(state, action) {
      const payload = action.payload ?? {};
      if (!payload.id || !state.customers.entities[payload.id]) return;

      const currentCustomer = state.customers.entities[payload.id];
      state.customers.entities[payload.id] = {
        ...currentCustomer,
        ...payload,
        id: currentCustomer.id,
        updatedAt: payload.updatedAt ?? nowIso(),
      };
    },
    deleteCustomer(state, action) {
      const customerId = action.payload;
      if (!customerId || !state.customers.entities[customerId]) return;

      state.customers.ids = state.customers.ids.filter(
        (id) => id !== customerId
      );
      delete state.customers.entities[customerId];

      const debtIdsToDelete = state.debts.ids.filter(
        (debtId) => state.debts.entities[debtId]?.customerId === customerId
      );
      state.debts.ids = state.debts.ids.filter(
        (debtId) => !debtIdsToDelete.includes(debtId)
      );
      debtIdsToDelete.forEach((debtId) => {
        delete state.debts.entities[debtId];
      });

      const repaymentIdsToDelete = state.repayments.ids.filter(
        (repaymentId) =>
          state.repayments.entities[repaymentId]?.customerId === customerId
      );
      state.repayments.ids = state.repayments.ids.filter(
        (repaymentId) => !repaymentIdsToDelete.includes(repaymentId)
      );
      repaymentIdsToDelete.forEach((repaymentId) => {
        delete state.repayments.entities[repaymentId];
      });
    },
    createDebtRecord(state, action) {
      const payload = action.payload ?? {};
      const now = payload.createdAt ?? nowIso();
      const customerPayload = payload.customer ?? {};
      const customerId = upsertCustomer(state, {
        id: payload.customerId ?? customerPayload.id,
        name: customerPayload.name ?? payload.customerName ?? '',
        phone: customerPayload.phone ?? payload.customerPhone ?? '',
        email: customerPayload.email ?? '',
        currency: payload.currency ?? customerPayload.currency ?? 'USD',
        notes: customerPayload.notes ?? '',
        createdAt: customerPayload.createdAt ?? now,
        updatedAt: customerPayload.updatedAt ?? now,
      });

      const debtId = payload.id ?? createId('debt');
      if (!state.debts.entities[debtId]) {
        state.debts.ids.push(debtId);
      }

      state.debts.entities[debtId] = createDebtEntity({
        id: debtId,
        customerId,
        totalDebt: payload.totalDebt ?? payload.dueAmount ?? payload.amount ?? 0,
        paidAmount: payload.paidAmount ?? 0,
        remainingBalance: payload.remainingBalance,
        currency: payload.currency ?? 'USD',
        linkedSaleId: payload.linkedSaleId ?? payload.saleId ?? null,
        linkedSaleNumber:
          payload.linkedSaleNumber ?? payload.invoiceNumber ?? null,
        linkedSaleDate: payload.linkedSaleDate ?? payload.saleDate ?? null,
        notes: payload.notes ?? '',
        createdAt: now,
        updatedAt: payload.updatedAt ?? now,
        status: payload.status,
      });

      syncCustomerTotals(state, customerId);
    },
    updateDebt(state, action) {
      const payload = action.payload ?? {};
      const debt = state.debts.entities[payload.id];
      if (!debt) return;

      const updatedDebt = createDebtEntity({
        ...debt,
        ...payload,
        id: debt.id,
        customerId: debt.customerId,
        totalDebt:
          payload.totalDebt != null ? payload.totalDebt : debt.totalDebt,
        paidAmount:
          payload.paidAmount != null ? payload.paidAmount : debt.paidAmount,
        remainingBalance:
          payload.remainingBalance != null
            ? payload.remainingBalance
            : Math.max(
                0,
                asNumber(
                  payload.totalDebt != null ? payload.totalDebt : debt.totalDebt
                ) -
                  asNumber(
                    payload.paidAmount != null
                      ? payload.paidAmount
                      : debt.paidAmount
                  )
              ),
        updatedAt: payload.updatedAt ?? nowIso(),
      });

      state.debts.entities[debt.id] = updatedDebt;
      syncCustomerTotals(state, debt.customerId);
    },
    addRepayment(state, action) {
      const payload = action.payload ?? {};
      const debt = state.debts.entities[payload.debtId];
      if (!debt) return;

      const amount = Math.max(0, asNumber(payload.amount));
      if (amount <= 0) return;

      const repaymentId = payload.id ?? createId('repayment');
      const repayment = createRepaymentEntity({
        id: repaymentId,
        debtId: debt.id,
        customerId: debt.customerId,
        amount,
        currency: payload.currency ?? debt.currency ?? 'USD',
        method: payload.method ?? 'cash',
        notes: payload.notes ?? '',
        linkedSaleId: payload.linkedSaleId ?? debt.linkedSaleId ?? null,
        linkedSaleNumber:
          payload.linkedSaleNumber ?? debt.linkedSaleNumber ?? null,
        paidAt: payload.paidAt ?? payload.createdAt,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
      });

      if (!state.repayments.entities[repaymentId]) {
        state.repayments.ids.push(repaymentId);
      }
      state.repayments.entities[repaymentId] = repayment;

      const nextPaidAmount = debt.paidAmount + amount;
      const nextRemainingBalance = Math.max(0, debt.remainingBalance - amount);

      state.debts.entities[debt.id] = {
        ...debt,
        paidAmount: nextPaidAmount,
        remainingBalance: nextRemainingBalance,
        status: deriveDebtStatus(
          nextRemainingBalance,
          nextPaidAmount,
          debt.totalDebt
        ),
        updatedAt: nowIso(),
      };

      syncCustomerTotals(state, debt.customerId);
    },
    markDebtSettled(state, action) {
      const payload = action.payload ?? {};
      const debt = state.debts.entities[payload.id];
      if (!debt) return;

      state.debts.entities[debt.id] = {
        ...debt,
        paidAmount: debt.totalDebt,
        remainingBalance: 0,
        status: ENTITY_STATUSES.SETTLED,
        settledAt: payload.settledAt ?? nowIso(),
        settlementNote: payload.settlementNote ?? debt.settlementNote ?? '',
        updatedAt: payload.updatedAt ?? nowIso(),
      };

      syncCustomerTotals(state, debt.customerId);
    },
  },
});

export const {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  createDebtRecord,
  updateDebt,
  addRepayment,
  markDebtSettled,
} = khataSlice.actions;

export const addCustomer = createCustomer;
export const increaseDebt = createDebtRecord;
export const addDebt = createDebtRecord;
export const recordRepayment = addRepayment;

export const selectKhataState = (state) =>
  normalizeKhataPersistedState(state.khata ?? initialState);

export const selectCustomerIds = createSelector(
  [selectKhataState],
  (khata) => khata.customers?.ids ?? EMPTY_ARRAY
);

export const selectCustomerEntities = createSelector(
  [selectKhataState],
  (khata) => khata.customers?.entities ?? EMPTY_OBJECT
);

export const selectDebtIds = createSelector(
  [selectKhataState],
  (khata) => khata.debts?.ids ?? EMPTY_ARRAY
);

export const selectDebtEntities = createSelector(
  [selectKhataState],
  (khata) => khata.debts?.entities ?? EMPTY_OBJECT
);

export const selectRepaymentIds = createSelector(
  [selectKhataState],
  (khata) => khata.repayments?.ids ?? EMPTY_ARRAY
);

export const selectRepaymentEntities = createSelector(
  [selectKhataState],
  (khata) => khata.repayments?.entities ?? EMPTY_OBJECT
);

export const selectAllCustomers = createSelector(
  [selectCustomerIds, selectCustomerEntities],
  (customerIds, customerEntities) =>
    customerIds.map((customerId) => customerEntities[customerId])
);

export const selectCustomerById = createSelector(
  [selectCustomerEntities, (_, customerId) => customerId],
  (customerEntities, customerId) => customerEntities[customerId] ?? null
);

export const selectAllDebts = createSelector(
  [selectDebtIds, selectDebtEntities],
  (debtIds, debtEntities) => debtIds.map((debtId) => debtEntities[debtId])
);

export const selectOpenDebts = createSelector([selectAllDebts], (debts) =>
  debts.filter(
    (debt) =>
      debt &&
      debt.status !== ENTITY_STATUSES.SETTLED &&
      asNumber(debt.remainingBalance) > 0
  )
);

export const selectSettledDebts = createSelector([selectAllDebts], (debts) =>
  debts.filter(
    (debt) =>
      debt &&
      debt.status === ENTITY_STATUSES.SETTLED &&
      asNumber(debt.remainingBalance) <= 0
  )
);

export const selectAllRepayments = createSelector(
  [selectRepaymentIds, selectRepaymentEntities],
  (repaymentIds, repaymentEntities) =>
    repaymentIds.map((repaymentId) => repaymentEntities[repaymentId])
);

export const selectActiveDebts = selectOpenDebts;

export const selectDebtorsSummary = createSelector(
  [selectOpenDebts, selectCustomerEntities],
  (openDebts, customerEntities) => {
    const summaryByCustomer = {};

    openDebts.forEach((debt) => {
      if (!debt) return;

      const customer = customerEntities[debt.customerId] ?? null;
      const key =
        normalizeText(customer?.phone) || debt.customerId || debt.id || 'unknown';

      if (!summaryByCustomer[key]) {
        summaryByCustomer[key] = {
          customer,
          totalDebtUSD: 0,
          totalDebtAFN: 0,
          debtCount: 0,
          debts: [],
        };
      }

      if (debt.currency === 'AFN') {
        summaryByCustomer[key].totalDebtAFN += asNumber(debt.remainingBalance);
      } else {
        summaryByCustomer[key].totalDebtUSD += asNumber(debt.remainingBalance);
      }

      summaryByCustomer[key].debtCount += 1;
      summaryByCustomer[key].debts.push(debt);
    });

    return Object.values(summaryByCustomer);
  }
);

export const selectCustomerDebtRecord = createSelector(
  [
    selectCustomerEntities,
    selectDebtEntities,
    selectRepaymentEntities,
    (_, customerId) => customerId,
  ],
  (customerEntities, debtEntities, repaymentEntities, customerId) => {
    const customer = customerEntities[customerId] ?? null;
    if (!customer) return null;

    const debtRecords = Object.values(debtEntities).filter(
      (debt) => debt.customerId === customerId
    );
    const repayments = Object.values(repaymentEntities).filter(
      (repayment) => repayment.customerId === customerId
    );

    return {
      customer,
      debtRecords,
      repayments,
      totalDebt: debtRecords.reduce((sum, debt) => sum + asNumber(debt.totalDebt), 0),
      paidAmount: debtRecords.reduce(
        (sum, debt) => sum + asNumber(debt.paidAmount),
        0
      ),
      remainingBalance: debtRecords.reduce(
        (sum, debt) => sum + asNumber(debt.remainingBalance),
        0
      ),
      status: customer.status,
    };
  }
);

export const selectDebtors = selectOpenDebts;

export default khataSlice.reducer;
