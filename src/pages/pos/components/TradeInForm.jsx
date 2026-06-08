import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  selectTradeIn,
  setSelectedCurrency,
  setTradeIn,
} from '../../../redux/slices/posSlice';
import { PHONE_BRANDS } from '../../../constants/brands';
import { CURRENCIES } from '../../../constants/conditions';

const TradeInForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const tradeIn = useSelector(selectTradeIn);

  // Generic handler to dispatch updates to the tradeIn state
  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(setTradeIn({ [name]: value }));
    if (name === 'currency') {
      dispatch(setSelectedCurrency(value));
    }
  };

  // Specific handler for the trade-in value to ensure it's a valid number
  const handleValueChange = (event) => {
    const value = event.target.value;
    // Allow empty string for clearing the field, but store 0 in Redux
    const numericValue = Number(value);
    if (value === '' || (Number.isFinite(numericValue) && numericValue >= 0)) {
      dispatch(setTradeIn({ tradeInValue: numericValue }));
    }
  };

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: isDark ? 'rgba(148, 163, 184, 0.14)' : theme.palette.divider,
        borderRadius: 2,
        bgcolor: isDark ? 'rgba(15, 30, 49, 0.82)' : theme.palette.background.paper,
      }}
    >
      <Typography variant='subtitle2' fontWeight={700} color={isDark ? 'common.white' : 'text.primary'}>
        Trade-in Device Details
      </Typography>

      <TextField
        select
        fullWidth
        size='small'
        label='Brand'
        name='brand'
        value={tradeIn.brand}
        onChange={handleChange}
        InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(10, 35, 61, 0.92)' : theme.palette.background.paper,
            borderRadius: 2,
            color: isDark ? 'common.white' : 'text.primary',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
          },
        }}
      >
        {PHONE_BRANDS.map((brand) => (
          <MenuItem key={brand} value={brand}>
            {brand}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        size='small'
        label='Model'
        name='model'
        value={tradeIn.model}
        onChange={handleChange}
        InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(10, 35, 61, 0.92)' : theme.palette.background.paper,
            borderRadius: 2,
            color: isDark ? 'common.white' : 'text.primary',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
          },
        }}
      />

      <TextField
        fullWidth
        size='small'
        label='Trade-in Device IMEI'
        name='imei'
        value={tradeIn.imei}
        onChange={handleChange}
        required
        inputProps={{ maxLength: 15 }}
        InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(10, 35, 61, 0.92)' : theme.palette.background.paper,
            borderRadius: 2,
            color: isDark ? 'common.white' : 'text.primary',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
          },
        }}
      />

      <Stack direction='row' spacing={1}>
        <TextField
          fullWidth
          size='small'
          label='Trade-in Value'
          name='tradeInValue'
          type='number'
          value={tradeIn.tradeInValue || ''}
          onChange={handleValueChange}
          required
          InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                {tradeIn.currency === 'USD' ? '$' : 'AFN'}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: isDark ? 'rgba(10, 35, 61, 0.92)' : theme.palette.background.paper,
              borderRadius: 2,
              color: isDark ? 'common.white' : 'text.primary',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
            },
          }}
        />
        <TextField
          select
          size='small'
          label='Currency'
          name='currency'
          value={tradeIn.currency}
          onChange={handleChange}
          sx={{ minWidth: 100 }}
          InputLabelProps={{ sx: { color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' } }}
          SelectProps={{
            sx: {
              bgcolor: isDark ? 'rgba(10, 35, 61, 0.92)' : theme.palette.background.paper,
              color: isDark ? 'common.white' : 'text.primary',
              borderRadius: 2,
            },
          }}
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
};

export default TradeInForm;
