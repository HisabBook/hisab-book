import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { selectTradeIn, setTradeIn } from '../../../redux/slices/posSlice';
import { PHONE_BRANDS } from '../../../constants/brands';
import { CURRENCIES } from '../../../constants/conditions';

const TradeInForm = () => {
  const dispatch = useDispatch();
  const tradeIn = useSelector(selectTradeIn);

  // Generic handler to dispatch updates to the tradeIn state
  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(setTradeIn({ [name]: value }));
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
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant='subtitle2' fontWeight={700}>
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
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                {tradeIn.currency === 'USD' ? '$' : 'AFN'}
              </InputAdornment>
            ),
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
