import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, updateCartItemQty } from '../../../redux/slices/posSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const isAccessory = item.type === 'accessory';

  const qty = Number(item.quantity) || 1;
  const unit = Number(item.sellPrice) || 0;
  const lineTotal = unit * qty;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 1,
        display: 'grid',
        gap: 0.75,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant='subtitle2' sx={{ overflowWrap: 'anywhere' }}>
            {item.name}
          </Typography>
          {item.imei && (
            <Typography variant='caption' color='text.secondary'>
              IMEI: {item.imei}
            </Typography>
          )}
          {item.serialNumber && (
            <Typography variant='caption' color='text.secondary'>
              Serial: {item.serialNumber}
            </Typography>
          )}
        </Box>
        <IconButton
          size='small'
          color='error'
          onClick={() => dispatch(removeFromCart(item.cartItemId))}
        >
          <DeleteIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        {isAccessory ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Button
              size='small'
              variant='outlined'
              onClick={() => dispatch(updateCartItemQty({ cartItemId: item.cartItemId, quantity: qty - 1 }))}
              disabled={qty <= 1}
            >
              -
            </Button>
            <Typography variant='body2' sx={{ minWidth: 22, textAlign: 'center' }}>
              {qty}
            </Typography>
            <Button
              size='small'
              variant='outlined'
              onClick={() => dispatch(updateCartItemQty({ cartItemId: item.cartItemId, quantity: qty + 1 }))}
            >
              +
            </Button>
          </Box>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            Qty: {qty}
          </Typography>
        )}

        <Typography variant='body2' fontWeight={700}>
          {item.currency || 'USD'} {lineTotal.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CartItem;
