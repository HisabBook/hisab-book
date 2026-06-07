import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import { selectPrimaryCurrency } from '../../redux/slices/settingsSlice';
import { formatCurrency } from '../../utils/currencyFormatter';

const CurrencyDisplay = ({ amount, currency, sx, variant = 'body2' }) => {
  const primaryCurrency = useSelector(selectPrimaryCurrency);
  const convert = useCurrencyConverter();

  const displayAmount = convert(amount, currency, primaryCurrency);
  const displayString = formatCurrency(displayAmount, primaryCurrency);

  return (
    <Typography variant={variant} sx={sx}>
      {displayString}
    </Typography>
  );
};

export default CurrencyDisplay;
