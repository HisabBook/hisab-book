import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import EmptyState from '../../../components/ui/EmptyState';
import CartItem from './CartItem';
import TradeInForm from './TradeInForm';
import CheckoutModal from './CheckoutModal';
import {
  clearCart,
  openCheckout,
  selectCustomer,
  selectIsCheckoutOpen,
  selectTradeIn,
  setCustomer,
  setTransactionType,
} from '../../../redux/slices/posSlice';

const CartPanel = ({ cartItems, transactionType }) => {
  const dispatch = useDispatch();
  const customer = useSelector(selectCustomer);
  const tradeIn = useSelector(selectTradeIn);
  const isCheckoutOpen = useSelector(selectIsCheckoutOpen);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.sellPrice * item.quantity, 0),
    [cartItems]
  );
  const tradeInValue = Number(tradeIn.tradeInValue) || 0;
  const payable = Math.max(0, subtotal - (transactionType === 'Exchange' ? tradeInValue : 0));

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
            onChange={(_, value) => value && dispatch(setTransactionType(value))}
            aria-label='transaction type'
            size='small'
          >
            <ToggleButton value='Standard'>Standard</ToggleButton>
            <ToggleButton value='Exchange'>Exchange</ToggleButton>
          </ToggleButtonGroup>

          <Stack spacing={1.25}>
            <TextField
              size='small'
              label='Customer Name'
              value={customer.name}
              onChange={(event) => dispatch(setCustomer({ name: event.target.value }))}
            />
            <TextField
              size='small'
              label='Customer Phone'
              value={customer.phone}
              onChange={(event) => dispatch(setCustomer({ phone: event.target.value }))}
            />
          </Stack>

          {transactionType === 'Exchange' && <TradeInForm />}

          <Divider />

          <Stack
            spacing={1.25}
            sx={{
              maxHeight: { xs: 300, md: 360 },
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            {cartItems.length === 0 ? (
              <Box sx={{ minHeight: 160 }}>
                <EmptyState
                  message='Cart is empty'
                  details='Select items from the inventory list to begin checkout.'
                />
              </Box>
            ) : (
              cartItems.map((item) => <CartItem key={item.cartItemId} item={item} />)
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
                <Typography variant='body2' color='text.secondary'>Trade-in Deduction</Typography>
                <Typography variant='body2' fontWeight={600}>-${tradeInValue.toFixed(2)}</Typography>
              </Stack>
            )}

            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography variant='subtitle2' fontWeight={700}>
                Total Payable
              </Typography>
              <Typography variant='h6' fontWeight={800}>
                ${payable.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>

          <Button
            variant='contained'
            size='large'
            onClick={() => dispatch(openCheckout())}
            disabled={!cartItems.length}
          >
            Checkout
          </Button>

          <Button
            variant='outlined'
            color='error'
            size='large'
            onClick={() => dispatch(clearCart())}
            disabled={!cartItems.length}
          >
            Clear Cart
          </Button>
        </Stack>
      </CardContent>
      <CheckoutModal open={isCheckoutOpen} />
    </Card>
  );
};

export default CartPanel;
