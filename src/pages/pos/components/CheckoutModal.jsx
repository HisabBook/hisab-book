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
  CircularProgress,
} from '@mui/material';
import {
  closeCheckout,
  selectCustomer,
  selectIsFinalizingCheckout,
  selectSelectedCurrency,
  setIsFinalizingCheckout,
  setSelectedCurrency,
} from '../../../redux/slices/posSlice';
import {
  selectExchangeRate,
  selectShopSettings,
} from '../../../redux/slices/settingsSlice';
import { useCheckout } from '../../../hooks/useCheckout';
import { generateInvoicePDF } from '../../../utils/generateInvoicePDF'; // Use correct path

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const amountPattern = /^\d*\.?\d*$/;

const CheckoutModal = ({ open, onPdfReady }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const customer = useSelector(selectCustomer);
  const exchangeRate = useSelector(selectExchangeRate);
  const shopSettings = useSelector(selectShopSettings); // For PDF
  const isFinalizingCheckout = useSelector(selectIsFinalizingCheckout);
  const selectedCurrencyFromStore = useSelector(selectSelectedCurrency);

  // The logic hook
  const { pricing, finalizeCheckout } = useCheckout();

  // Local state for the modal's form
  const [selectedCurrency, setSelectedCurrencyLocal] = useState('USD');
  const [amountPaidInput, setAmountPaidInput] = useState('');
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (open) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAmountPaidInput('');
      setSelectedCurrencyLocal(selectedCurrencyFromStore);
      setSubmitError('');
    }
  }, [customer.name, customer.phone, open, selectedCurrencyFromStore]);

  // Memoized calculations for display
  const netTotal = useMemo(
    () =>
      round2(
        pricing.netTotalUSD * (selectedCurrency === 'AFN' ? exchangeRate : 1)
      ),
    [exchangeRate, pricing.netTotalUSD, selectedCurrency]
  );
  const amountPaid = useMemo(
    () => round2(Number(amountPaidInput) || 0),
    [amountPaidInput]
  );
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

  const handleClose = () => {
    if (isFinalizingCheckout) return;
    dispatch(closeCheckout());
  };

  const handleAmountChange = (event) => {
    const next = event.target.value;
    if (next === '' || amountPattern.test(next)) {
      setAmountPaidInput(next);
    }
  };

  const handleFinalize = async () => {
    if (isFinalizingCheckout) return;
    setSubmitError('');
    dispatch(setIsFinalizingCheckout(true));
    try {
      const result = await finalizeCheckout({
        selectedCurrency,
        amountPaid,
        customerName: name,
        customerPhone: phone,
      });

      if (result.ok) {
        const pdfData = await generateInvoicePDF(
          result.sale,
          shopSettings,
          t,
          i18n
        );
        if (typeof onPdfReady === 'function') {
          onPdfReady(pdfData);
        }
      } else {
        setSubmitError(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Checkout finalization failed', error);
      setSubmitError(
        t(
          'pos.invoiceFailed',
          'An unexpected error occurred. Please try again.'
        )
      );
    } finally {
      // Always turn off the loading state
      dispatch(setIsFinalizingCheckout(false));
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
            onChange={(_, v) => {
              if (!v) return;
              setSelectedCurrencyLocal(v);
              dispatch(setSelectedCurrency(v));
            }}
            disabled={isFinalizingCheckout}
          >
            <ToggleButton value='USD'>USD</ToggleButton>
            <ToggleButton value='AFN'>AFN</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label={t('pos.amountPaid', 'Amount Paid')}
            value={amountPaidInput}
            onChange={handleAmountChange}
            inputMode='decimal'
            disabled={isFinalizingCheckout}
          />

          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Stack spacing={0.5}>
              <Typography variant='body2'>
                {t('common.total', 'Total')}: {netTotal.toFixed(2)}{' '}
                {selectedCurrency}
              </Typography>
              <Typography
                variant='body2'
                color={hasDebt ? 'warning.main' : 'text.secondary'}
              >
                {t('pos.dueAmount', 'Due Amount')}: {dueAmount.toFixed(2)}{' '}
                {selectedCurrency}
              </Typography>
              <Typography variant='body2' color='info.main'>
                {t('pos.returnChange', 'Return Change')}:{' '}
                {changeAmount.toFixed(2)} {selectedCurrency}
              </Typography>
            </Stack>
          </Box>

          <TextField
            label={t('pos.customerName', 'Customer Name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={hasDebt}
            error={customerRequiredError && !name.trim()}
            disabled={isFinalizingCheckout}
          />
          <TextField
            label={t('pos.customerPhone', 'Customer Phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required={hasDebt}
            error={customerRequiredError && !phone.trim()}
            disabled={isFinalizingCheckout}
          />

          {hasDebt && (
            <Alert severity='warning'>
              {t(
                'pos.debtWillBeRecorded',
                'Remaining amount will be recorded in Khata.'
              )}
            </Alert>
          )}
          {!!submitError && <Alert severity='error'>{submitError}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose} disabled={isFinalizingCheckout}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          variant='contained'
          onClick={handleFinalize}
          disabled={customerRequiredError || isFinalizingCheckout}
          startIcon={
            isFinalizingCheckout ? (
              <CircularProgress size={20} color='inherit' />
            ) : null
          }
        >
          {isFinalizingCheckout
            ? t('common.processing', 'Processing...')
            : t('common.confirm', 'Confirm Sale')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutModal;
