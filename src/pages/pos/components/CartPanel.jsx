import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import CartItem from './CartItem';
import TradeInForm from './TradeInForm';
import CheckoutModal from './CheckoutModal';
import { setCurrentInvoicePdf } from '../invoicePreviewStore';
import { useCheckout } from '../../../hooks/useCheckout';
import {
  clearCart,
  openCheckout,
  selectCustomer,
  selectIsCheckoutOpen,
  selectIsFinalizingCheckout,
  setCustomer,
  setTransactionType,
} from '../../../redux/slices/posSlice';

const STORAGE_KEY = 'hisabbook:lastInvoicePdf';

const CartPanel = ({ cartItems, transactionType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customer = useSelector(selectCustomer);
  const isCheckoutOpen = useSelector(selectIsCheckoutOpen);
  const isFinalizingCheckout = useSelector(selectIsFinalizingCheckout);

  // We get the multi-currency aware pricing directly from the hook.
  // This correctly handles currency conversion and negative balances.
  const { pricing } = useCheckout();
  const subtotal = pricing.subtotalUSD;
  const tradeInValue = pricing.tradeInUSD;
  const payable = pricing.netTotalUSD;

  const handlePdfReady = (pdf) => {
    if (!pdf?.blobUrl) return;
    const payload = {
      blobUrl: pdf.blobUrl,
      fileName: pdf.fileName || 'invoice.pdf',
    };
    setCurrentInvoicePdf(payload);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Session storage can fail in private mode or low-quota environments.
    }
    navigate(ROUTE_PATHS.INVOICE_PREVIEW, { replace: true, state: payload });
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant='h6' fontWeight={700}>
              Active Cart
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Manage customer info, products, and totals instantly.
            </Typography>
          </Box>

          <ToggleButtonGroup
            exclusive
            fullWidth
            value={transactionType}
            onChange={(_, value) =>
              value && dispatch(setTransactionType(value))
            }
            size='small'
            disabled={isFinalizingCheckout}
          >
            <ToggleButton value='Standard'>Standard</ToggleButton>
            <ToggleButton value='Exchange'>Exchange</ToggleButton>
          </ToggleButtonGroup>

          <Stack spacing={1.25}>
            <TextField
              size='small'
              label='Customer Name'
              value={customer.name}
              onChange={(e) => dispatch(setCustomer({ name: e.target.value }))}
              disabled={isFinalizingCheckout}
            />
            <TextField
              size='small'
              label='Customer Phone'
              value={customer.phone}
              onChange={(e) => dispatch(setCustomer({ phone: e.target.value }))}
              disabled={isFinalizingCheckout}
            />
          </Stack>

          {transactionType === 'Exchange' && <TradeInForm />}

          <Divider />

          <Stack
            spacing={1.25}
            sx={{ maxHeight: { xs: 300, md: 360 }, overflowY: 'auto', pr: 0.5 }}
          >
            {cartItems.map((item) => (
              <CartItem key={item.cartItemId} item={item} />
            ))}
            {!cartItems.length && (
              <Typography variant='body2' color='text.secondary'>
                Cart is empty.
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1} sx={{ pt: 0.5 }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography variant='body2' color='text.secondary'>
                Subtotal
              </Typography>
              <Typography variant='body2' fontWeight={600}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Stack>

            {transactionType === 'Exchange' && (
              <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                <Typography variant='body2' color='text.secondary'>
                  Trade-in Deduction
                </Typography>
                <Typography
                  variant='body2'
                  fontWeight={600}
                  color='text.secondary'
                >
                  -${tradeInValue.toFixed(2)}
                </Typography>
              </Stack>
            )}

            <Stack
              direction='row'
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant='subtitle2' fontWeight={700}>
                {payable < 0 ? 'Refund to Customer' : 'Total Payable'}
              </Typography>
              <Typography
                variant='h6'
                fontWeight={800}
                color={payable < 0 ? 'success.main' : 'text.primary'}
              >
                {payable < 0
                  ? `$${Math.abs(payable).toFixed(2)}`
                  : `$${payable.toFixed(2)}`}
              </Typography>
            </Stack>
          </Stack>

          <Button
            variant='contained'
            size='large'
            onClick={() => dispatch(openCheckout())}
            disabled={!cartItems.length || isFinalizingCheckout}
          >
            Checkout
          </Button>

          <Button
            variant='outlined'
            color='error'
            size='large'
            onClick={() => dispatch(clearCart())}
            disabled={!cartItems.length || isFinalizingCheckout}
          >
            Clear Cart
          </Button>
        </Stack>
      </CardContent>

      <CheckoutModal open={isCheckoutOpen} onPdfReady={handlePdfReady} />
    </Card>
  );
};

export default CartPanel;
