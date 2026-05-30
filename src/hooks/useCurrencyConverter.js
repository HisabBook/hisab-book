import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectExchangeRate } from '../redux/slices/settingsSlice';

/* 
A hook that provides a memoized function to convert amounts between currencies.
It uses the global exchange rate from the Redux store.
*/
export const useCurrencyConverter = () => {
  const exchangeRate = useSelector(selectExchangeRate);

  const convert = useCallback(
    (amount, fromCurrency, toCurrency) => {
      if (!Number.isFinite(amount) || fromCurrency === toCurrency) {
        return amount;
      }

      if (fromCurrency === 'USD' && toCurrency === 'AFN') {
        return amount * exchangeRate;
      }

      if (fromCurrency === 'AFN' && toCurrency === 'USD') {
        // Divide-by-zero protection.
        if (exchangeRate === 0) return 0;
        return amount / exchangeRate;
      }

      // Return original amount if conversion is not supported
      return amount;
    },
    [exchangeRate] // Re-create the function only when the exchange rate changes
  );

  return convert;
};
