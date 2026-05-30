import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import { selectPrimaryCurrency } from '../../redux/slices/settingsSlice';

/**
 * A component to display a price, automatically converting and formatting it
 * based on the user's preferred primary currency.
 **/
const CurrencyDisplay = ({ amount, currency, sx, variant = 'body2' }) => {
  const primaryCurrency = useSelector(selectPrimaryCurrency);
  const convert = useCurrencyConverter();

  const displayAmount = convert(amount, currency, primaryCurrency);

  const formatOptions =
    primaryCurrency === 'USD'
      ? { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }
      : {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };

  const formattedAmount = new Intl.NumberFormat('en-US', formatOptions).format(
    displayAmount
  );

  // For AFN, Intl doesn't have a standard symbol, so we add it manually.
  const displayString =
    primaryCurrency === 'AFN' ? `AFN ${formattedAmount}` : formattedAmount;

  return (
    <Typography variant={variant} sx={sx}>
      {displayString}
    </Typography>
  );
};

export default CurrencyDisplay;
