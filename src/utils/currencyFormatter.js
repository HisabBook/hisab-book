export const formatCurrency = (amount, currency, locale = 'en-US') => {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return '—';
  }

  // Define the primary currency for special formatting.
  const primaryCurrency = 'USD';

  // Create a fallback currency if the provided one is invalid.
  const validCurrency = currency || primaryCurrency;

  const isPrimary = validCurrency === primaryCurrency;

  const formatOptions = isPrimary
    ? { style: 'currency', currency: primaryCurrency }
    : {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      };

  const formattedAmount = new Intl.NumberFormat(locale, formatOptions).format(
    amount
  );

  return isPrimary ? formattedAmount : `${validCurrency} ${formattedAmount}`;
};
