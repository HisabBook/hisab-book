import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { closeCheckout, selectCustomer } from '../../../redux/slices/posSlice';
import { selectExchangeRate } from '../../../redux/slices/settingsSlice';
import { useCheckout } from '../../settings/hooks/useCheckout';

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const amountPattern = /^\d*\.?\d*$/;

const CheckoutModal = ({ open }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const customer = useSelector(selectCustomer);
  const exchangeRate = useSelector(selectExchangeRate);
  const { pricing, finalizeCheckout } = useCheckout();

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amountPaidInput, setAmountPaidInput] = useState('');
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [submitError, setSubmitError] = useState('');

  const netTotal = useMemo(() => {
    const value =
      selectedCurrency === 'AFN' ? pricing.netTotalUSD * exchangeRate : pricing.netTotalUSD;
    return round2(value);
  }, [exchangeRate, pricing.netTotalUSD, selectedCurrency]);

  const amountPaid = useMemo(() => round2(Number(amountPaidInput) || 0), [amountPaidInput]);
  const dueAmount = useMemo(
    () => (amountPaid >= netTotal ? 0 : round2(netTotal - amountPaid)),
    [amountPaid, netTotal]
  );
  const changeAmount = useMemo(
    () => (amountPaid > netTotal ? round2(amountPaid - netTotal) : 0),
    [amountPaid, netTotal]
  );
  const hasDebt = dueAmount > 0;
  const customerRequiredError = hasDebt && (!name.trim() || !phone.trim());

  useEffect(() => {
    if (!open) return;
    setName(customer.name || '');
    setPhone(customer.phone || '');
    setAmountPaidInput('');
    setSelectedCurrency('USD');
    setSubmitError('');
  }, [customer.name, customer.phone, open]);

  const handleClose = () => {
    dispatch(closeCheckout());
    setSubmitError('');
  };

  const handleAmountChange = (event) => {
    const next = event.target.value.trim();
    if (!amountPattern.test(next)) return;
    if ((next.match(/\./g) || []).length > 1) return;
    setAmountPaidInput(next);
  };

  const handleFinalize = () => {
    setSubmitError('');
    const result = finalizeCheckout({
      selectedCurrency,
      amountPaid,
      customerName: name,
      customerPhone: phone,
    });
    if (!result.ok) {
      setSubmitError(t('pos.customerDebtRequired', 'Customer name and phone are required for debt sales.'));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>{t('pos.checkout', 'Checkout')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={selectedCurrency}
            onChange={(_, value) => value && setSelectedCurrency(value)}
          >
            <ToggleButton value='USD'>USD</ToggleButton>
            <ToggleButton value='AFN'>AFN</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label={t('pos.amountPaid', 'Amount Paid')}
            value={amountPaidInput}
            onChange={handleAmountChange}
            inputMode='decimal'
          />

          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Stack spacing={0.5}>
              <Typography variant='body2'>
                {t('common.total', 'Total')}: {netTotal.toFixed(2)} {selectedCurrency}
              </Typography>
              <Typography variant='body2' color={hasDebt ? 'warning.main' : 'success.main'}>
                {t('pos.dueAmount', 'Due Amount')}: {dueAmount.toFixed(2)} {selectedCurrency}
              </Typography>
              <Typography variant='body2' color='info.main'>
                {t('pos.returnChange', 'Return Change')}: {changeAmount.toFixed(2)} {selectedCurrency}
              </Typography>
            </Stack>
          </Box>

          <TextField
            label={t('pos.customerName', 'Customer Name')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required={hasDebt}
            error={customerRequiredError && !name.trim()}
          />
          <TextField
            label={t('pos.customerPhone', 'Customer Phone')}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required={hasDebt}
            error={customerRequiredError && !phone.trim()}
          />

          {hasDebt && (
            <Alert severity='warning'>
              {t('pos.debtWillBeRecorded', 'Remaining amount will be recorded in Khata.')}
            </Alert>
          )}

          {!!submitError && <Alert severity='error'>{submitError}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common.cancel', 'Cancel')}</Button>
        <Button variant='contained' onClick={handleFinalize} disabled={customerRequiredError}>
          {t('common.confirm', 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutModal;
