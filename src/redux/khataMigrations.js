const asNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const nowIso = () => new Date().toISOString();

const indexById = (items) => ({
  ids: items.map((item) => item.id),
  entities: items.reduce((accumulator, item) => {
    accumulator[item.id] = item;
    return accumulator;
  }, {}),
});

const isNormalizedCollection = (collection) =>
  Boolean(
    collection &&
      Array.isArray(collection.ids) &&
      collection.entities &&
      !Array.isArray(collection.entities)
  );

const deriveStatus = (remainingBalance, paidAmount, totalDebt) => {
  if (remainingBalance <= 0 || totalDebt <= 0) return 'settled';
  return paidAmount > 0 ? 'partial' : 'open';
};

const normalizeLegacyCustomers = (customers = []) => {
  const normalizedCustomers = [];
  const normalizedDebts = [];

  customers.forEach((customer) => {
    const totalDebt = Math.max(0, asNumber(customer.debtAmount));
    const paidAmount = Math.max(0, asNumber(customer.paidAmount));
    const remainingBalance =
      customer.remainingBalance != null
        ? Math.max(0, asNumber(customer.remainingBalance))
        : totalDebt;
    const debtIds = [];

    if (totalDebt > 0) {
      const debtId = `debt_${customer.id}`;
      debtIds.push(debtId);
      normalizedDebts.push({
        id: debtId,
        customerId: customer.id,
        totalDebt,
        paidAmount,
        remainingBalance,
        status: deriveStatus(remainingBalance, paidAmount, totalDebt),
        currency: customer.currency ?? 'USD',
        linkedSaleId: customer.linkedSaleId ?? null,
        linkedSaleNumber: customer.linkedSaleNumber ?? null,
        linkedSaleDate: customer.linkedSaleDate ?? null,
        notes: customer.notes ?? '',
        createdAt: customer.createdAt ?? nowIso(),
        updatedAt: customer.updatedAt ?? customer.createdAt ?? nowIso(),
      });
    }

    normalizedCustomers.push({
      id: customer.id,
      name: customer.name ?? '',
      phone: customer.phone ?? '',
      email: customer.email ?? '',
      currency: customer.currency ?? 'USD',
      notes: customer.notes ?? '',
      totalDebt,
      paidAmount,
      remainingBalance,
      status: deriveStatus(remainingBalance, paidAmount, totalDebt),
      debtIds,
      createdAt: customer.createdAt ?? nowIso(),
      updatedAt: customer.updatedAt ?? customer.createdAt ?? nowIso(),
    });
  });

  return {
    customers: indexById(normalizedCustomers),
    debts: indexById(normalizedDebts),
    repayments: { ids: [], entities: {} },
  };
};

export const normalizeKhataPersistedState = (khataState) => {
  if (!khataState) {
    return {
      customers: { ids: [], entities: {} },
      debts: { ids: [], entities: {} },
      repayments: { ids: [], entities: {} },
    };
  }

  if (Array.isArray(khataState.customers)) {
    return normalizeLegacyCustomers(khataState.customers);
  }

  const customers = isNormalizedCollection(khataState.customers)
    ? khataState.customers
    : { ids: [], entities: {} };

  const debts = isNormalizedCollection(khataState.debts)
    ? khataState.debts
    : { ids: [], entities: {} };

  const repayments = isNormalizedCollection(khataState.repayments)
    ? khataState.repayments
    : { ids: [], entities: {} };

  if (
    customers === khataState.customers &&
    debts === khataState.debts &&
    repayments === khataState.repayments
  ) {
    return khataState;
  }

  return { ...khataState, customers, debts, repayments };
};

export const migratePersistedRootState = (state) => ({
  ...state,
  khata: normalizeKhataPersistedState(state?.khata),
});
