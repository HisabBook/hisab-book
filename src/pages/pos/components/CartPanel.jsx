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

  // We get the multi-currency aware pricing directly from the hook.
  // This correctly handles currency conversion and negative balances.
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
        borderRadius: 3,
        bgcolor: isDark ? 'rgba(7, 25, 44, 0.96)' : theme.palette.background.paper,
        color: isDark ? 'common.white' : 'text.primary',
        border: '1px solid',
        borderColor: isDark ? 'rgba(148, 163, 184, 0.14)' : theme.palette.divider,
        boxShadow: isDark ? '0 20px 60px rgba(2, 8, 23, 0.35)' : theme.shadows[2],
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack spacing={2}>
          <Box>
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
              bgcolor: isDark ? 'rgba(15, 30, 49, 0.9)' : theme.palette.action.hover,
              borderRadius: 2,
              p: 0.4,
              '& .MuiToggleButton-root': {
                color: isDark ? 'rgba(226, 232, 240, 0.82)' : 'text.primary',
                border: 0,
                textTransform: 'none',
                fontWeight: 700,
              },
              '& .Mui-selected': {
                bgcolor: isDark ? 'rgba(59, 130, 246, 0.22) !important' : 'rgba(5, 214, 125, 0.12) !important',
                color: isDark ? 'common.white' : 'text.primary',
              },
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
              onChange={(e) => dispatch(setCustomer({ name: e.target.value }))}
              disabled={isFinalizingCheckout}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? 'rgba(15, 30, 49, 0.82)' : theme.palette.background.paper,
                  borderRadius: 2,
                  color: isDark ? 'common.white' : 'text.primary',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
                },
              }}
            />
            <TextField
              size='small'
              label='Customer Phone'
              value={customer.phone}
              onChange={(e) => dispatch(setCustomer({ phone: e.target.value }))}
              disabled={isFinalizingCheckout}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? 'rgba(15, 30, 49, 0.82)' : theme.palette.background.paper,
                  borderRadius: 2,
                  color: isDark ? 'common.white' : 'text.primary',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
                },
              }}
            />
          </Stack>

          {transactionType === 'Exchange' && <TradeInForm />}

          <Divider />

          <Stack
            spacing={1.25}
            sx={{
              minHeight: { xs: 260, md: 380 },
              maxHeight: { xs: 340, md: 440 },
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: 0.5,
              minWidth: 0,
            }}
          >
            {hasItems ? (
              cartItems.map((item) => <CartItem key={item.cartItemId} item={item} />)
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

          <Divider />

          <Stack spacing={1} sx={{ pt: 0.5 }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography variant='body2' color={isDark ? 'text.secondary' : 'text.secondary'}>
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
                  color={isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'}
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
                color={payable < 0 ? 'success.light' : isDark ? 'common.white' : 'text.primary'}
              >
                {payable < 0
                  ? `$${Math.abs(payable).toFixed(2)}`
                  : `$${payable.toFixed(2)}`}
              </Typography>
            </Stack>
          </Stack>

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
              borderColor: isDark ? 'rgba(248, 113, 113, 0.35)' : theme.palette.error.main,
            }}
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
