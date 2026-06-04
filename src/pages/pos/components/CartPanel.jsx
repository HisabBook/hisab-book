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
  useTheme,
} from '@mui/material';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import EmptyState from '../../../components/ui/EmptyState';
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const customer = useSelector(selectCustomer);
  const isCheckoutOpen = useSelector(selectIsCheckoutOpen);
  const isFinalizingCheckout = useSelector(selectIsFinalizingCheckout);

  const { pricing } = useCheckout();
  const subtotal = pricing.subtotalUSD;
  const tradeInValue = pricing.tradeInUSD;
  const payable = pricing.netTotalUSD;
  const hasItems = cartItems.length > 0;

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
    <Card
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        bgcolor: isDark
          ? 'rgba(7, 25, 44, 0.96)'
          : theme.palette.background.paper,
        color: isDark ? 'common.white' : 'text.primary',
        border: '1px solid',
        borderColor: isDark
          ? 'rgba(148, 163, 184, 0.14)'
          : theme.palette.divider,
        boxShadow: isDark
          ? '0 20px 60px rgba(2, 8, 23, 0.35)'
          : theme.shadows[2],
        overflow: 'hidden',
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, md: 2 },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* --- TOP SECTION (Not scrollable) --- */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant='h6'
            fontWeight={800}
            color={isDark ? 'common.white' : 'text.primary'}
          >
            Active Cart
          </Typography>
          <Typography
            variant='body2'
            color={isDark ? 'rgba(226, 232, 240, 0.68)' : 'text.secondary'}
          >
            Manage customer info, products, and totals instantly.
          </Typography>
        </Box>

        {/* --- MIDDLE SCROLLABLE SECTION --- */}
        {/* NEW: This Box will contain all the content that needs to scroll */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
          <Stack spacing={2}>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={transactionType}
              onChange={(_, value) =>
                value && dispatch(setTransactionType(value))
              }
              size='small'
              disabled={isFinalizingCheckout}
              sx={{
                bgcolor: isDark
                  ? 'rgba(15, 30, 49, 0.9)'
                  : theme.palette.action.hover,
                borderRadius: 2,
                p: 0.4,
                // ... (rest of the sx props are fine)
              }}
            >
              <ToggleButton value='Standard'>Standard</ToggleButton>
              <ToggleButton value='Exchange'>Exchange</ToggleButton>
            </ToggleButtonGroup>

            <Stack spacing={1.25}>
              <TextField
                size='small'
                label='Customer Name'
                value={customer.name}
                onChange={(e) =>
                  dispatch(setCustomer({ name: e.target.value }))
                }
                disabled={isFinalizingCheckout}
                // ... (sx props are fine)
              />
              <TextField
                size='small'
                label='Customer Phone'
                value={customer.phone}
                onChange={(e) =>
                  dispatch(setCustomer({ phone: e.target.value }))
                }
                disabled={isFinalizingCheckout}
                // ... (sx props are fine)
              />
            </Stack>

            {transactionType === 'Exchange' && <TradeInForm />}

            {hasItems && <Divider />}

            {/* The list of cart items */}
            {hasItems ? (
              cartItems.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))
            ) : (
              <EmptyState
                icon={
                  <ShoppingCartCheckoutRoundedIcon
                    sx={{ fontSize: 52, mb: 1.5, opacity: 0.55 }}
                  />
                }
                color={isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'}
                message='Cart is empty'
                details='Select items from the inventory list to begin checkout.'
              />
            )}
          </Stack>
        </Box>

        {/* --- BOTTOM STICKY FOOTER SECTION --- */}
        {/* NEW: This section is now outside the scrollable Box */}
        <Box sx={{ pt: 2 }}>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1}>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography variant='body2' color='text.secondary'>
                Subtotal
              </Typography>
              <Typography
                variant='body2'
                fontWeight={600}
                color={isDark ? 'common.white' : 'text.primary'}
              >
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
                  color={
                    isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'
                  }
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
                color={
                  payable < 0
                    ? 'success.light'
                    : isDark
                      ? 'common.white'
                      : 'text.primary'
                }
              >
                {payable < 0
                  ? `$${Math.abs(payable).toFixed(2)}`
                  : `$${payable.toFixed(2)}`}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            {hasItems && (
              <Button
                variant='contained'
                color='primary'
                size='large'
                onClick={() => dispatch(openCheckout())}
                disabled={isFinalizingCheckout}
              >
                Checkout
              </Button>
            )}

            <Button
              variant='outlined'
              color='error'
              size='large'
              onClick={() => dispatch(clearCart())}
              disabled={!hasItems || isFinalizingCheckout}
              sx={{
                color: 'error.main',
                borderColor: isDark
                  ? 'rgba(248, 113, 113, 0.35)'
                  : 'error.main',
              }}
            >
              Clear Cart
            </Button>
          </Stack>
        </Box>
      </CardContent>

      <CheckoutModal open={isCheckoutOpen} onPdfReady={handlePdfReady} />
    </Card>
  );
};

export default CartPanel;
