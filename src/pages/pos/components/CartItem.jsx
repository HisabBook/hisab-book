import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, updateCartQty } from '../../../redux/slices/posSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isAccessory = item.type === 'accessory';
  const identifier = item.imei || item.serialNumber || item.identifier || '';
  const identifierLabel =
    item.type === 'laptop'
      ? 'Serial'
      : item.type === 'phone'
        ? 'IMEI'
        : 'Identifier';

  const qty = Number(item.quantity) || 1;
  const unit = Number(item.sellPrice) || 0;
  const lineTotal = unit * qty;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: isDark ? 'rgba(148, 163, 184, 0.14)' : theme.palette.divider,
        borderRadius: 2,
        p: 1,
        display: 'grid',
        gap: 0.75,
        minWidth: 0,
        bgcolor: isDark ? 'rgba(14, 30, 48, 0.95)' : theme.palette.background.paper,
        boxShadow: isDark ? '0 8px 24px rgba(2, 8, 23, 0.18)' : theme.shadows[1],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
          minWidth: 0,
        }}
      >
        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant='subtitle2'
            sx={{
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              color: isDark ? 'common.white' : 'text.primary',
            }}
          >
            {item.name}
          </Typography>
          {item.brand && (
            <Typography
              variant='caption'
              sx={{
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                color: isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary',
              }}
            >
              Brand: {item.brand}
            </Typography>
          )}
          {item.model && (
            <Typography
              variant='caption'
              sx={{
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                color: isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary',
              }}
            >
              Model: {item.model}
            </Typography>
          )}
          {identifier && (
            <Typography
              variant='caption'
              sx={{
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                color: isDark ? 'rgba(226, 232, 240, 0.58)' : 'text.secondary',
              }}
            >
              {identifierLabel}: {identifier}
            </Typography>
          )}
        </Stack>
        <IconButton
          size='small'
          color='error'
          onClick={() => dispatch(removeFromCart(item.cartItemId))}
          sx={{ flexShrink: 0 }}
        >
          <DeleteIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          minWidth: 0,
        }}
      >
        {isAccessory ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Button
              size='small'
              variant='outlined'
              sx={{
                color: isDark ? 'rgba(226, 232, 240, 0.9)' : 'text.primary',
                borderColor: isDark ? 'rgba(148, 163, 184, 0.22)' : theme.palette.divider,
              }}
              onClick={() =>
                dispatch(
                  updateCartQty({
                    cartItemId: item.cartItemId,
                    quantity: qty - 1,
                  })
                )
              }
              disabled={qty <= 1}
            >
              -
            </Button>
              <Typography variant='body2' sx={{ minWidth: 22, textAlign: 'center', color: isDark ? 'common.white' : 'text.primary' }}>
              {qty}
            </Typography>
            <Button
              size='small'
              variant='outlined'
              sx={{
                color: isDark ? 'rgba(226, 232, 240, 0.9)' : 'text.primary',
                borderColor: isDark ? 'rgba(148, 163, 184, 0.22)' : theme.palette.divider,
              }}
              onClick={() =>
                dispatch(
                  updateCartQty({
                    cartItemId: item.cartItemId,
                    quantity: qty + 1,
                  })
                )
              }
            >
              +
            </Button>
          </Box>
        ) : (
          <Typography variant='body2' sx={{ minWidth: 0, color: isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary' }}>
            Qty: {qty}
          </Typography>
        )}

        <Typography
          variant='body2'
          fontWeight={700}
          sx={{
            textAlign: 'right',
            whiteSpace: 'nowrap',
            color: isDark ? 'common.white' : 'text.primary',
          }}
        >
          {item.currency || 'USD'} {lineTotal.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CartItem;
