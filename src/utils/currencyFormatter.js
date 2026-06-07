export const formatCurrency = (amount, currency, locale = 'en-US') => {
  if (typeof amount !== 'number') {
    return '';
  }

  const formatOptions =
    currency === 'USD'
      ? { style: 'currency', currency: 'USD' }
      : {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };

  const formattedAmount = new Intl.NumberFormat(locale, formatOptions).format(
    amount
  );

  // Add the 'AFN' prefix manually as it's not a standard Intl currency symbol
  return currency === 'AFN' ? `AFN ${formattedAmount}` : formattedAmount;
};
