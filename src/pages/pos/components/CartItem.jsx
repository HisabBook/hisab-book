import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import {
  removeFromCart,
  updateCartItemQty,
} from '../../../redux/slices/posSlice';

const sanitizeQty = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
};

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (nextQty) => {
    dispatch(
      updateCartItemQty({
        cartItemId: item.cartItemId,
        quantity: sanitizeQty(nextQty),
      })
    );
  };

  return (
    <Card
      variant='outlined'
      sx={{ borderRadius: 2, borderColor: 'divider', overflow: 'visible' }}
    >
      <CardContent sx={{ p: 1.5, overflow: 'visible', '&:last-child': { pb: 1.5 } }}>
        <Stack
          direction='row'
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              variant='subtitle2'
              sx={{ overflowWrap: 'anywhere', lineHeight: 1.35 }}
            >
              {item.name}
            </Typography>
            {(item.imei || item.serialNumber) && (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ overflowWrap: 'anywhere', display: 'block', mt: 0.25 }}
              >
                {item.imei ? `IMEI: ${item.imei}` : `Serial: ${item.serialNumber}`}
              </Typography>
            )}
            <Typography variant='body2' fontWeight={700} sx={{ mt: 0.5 }}>
              ${item.sellPrice} each
            </Typography>
          </Box>

          <IconButton
            size='small'
            color='error'
            onClick={() => dispatch(removeFromCart(item.cartItemId))}
            aria-label='delete cart item'
          >
            <DeleteOutlineRoundedIcon fontSize='small' />
          </IconButton>
        </Stack>

        {item.type === 'accessory' && (
          <Stack mt={1.25} spacing={0.75}>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
              <IconButton
                size='small'
                onClick={() => handleQtyChange(item.quantity - 1)}
                aria-label='decrease quantity'
              >
                <RemoveRoundedIcon fontSize='small' />
              </IconButton>
              <TextField
                size='small'
                type='number'
                value={item.quantity}
                onChange={(event) => handleQtyChange(event.target.value)}
                sx={{ width: 96 }}
                slotProps={{
                  htmlInput: { min: 1, inputMode: 'numeric', pattern: '[0-9]*' },
                }}
                onKeyDown={(event) => {
                  if (['e', 'E', '+', '-'].includes(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
              <IconButton
                size='small'
                onClick={() => handleQtyChange(item.quantity + 1)}
                aria-label='increase quantity'
              >
                <AddRoundedIcon fontSize='small' />
              </IconButton>
            </Stack>
            <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
              Total: ${(item.sellPrice * item.quantity).toFixed(2)}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default CartItem;
