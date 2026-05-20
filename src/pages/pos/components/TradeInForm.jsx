import { Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectTradeIn, setTradeIn } from '../../../redux/slices/posSlice';

const TradeInForm = () => {
  const dispatch = useDispatch();
  const tradeIn = useSelector(selectTradeIn);

  return (
    <Stack spacing={1.25}>
      <Typography variant='subtitle2' fontWeight={700}>
        Trade-in Device Details
      </Typography>
      <TextField
        size='small'
        label='Brand'
        value={tradeIn.brand}
        onChange={(event) => dispatch(setTradeIn({ brand: event.target.value }))}
      />
      <TextField
        size='small'
        label='Model'
        value={tradeIn.model}
        onChange={(event) => dispatch(setTradeIn({ model: event.target.value }))}
      />
      <TextField
        size='small'
        label='Old Phone IMEI'
        value={tradeIn.imei}
        onChange={(event) => dispatch(setTradeIn({ imei: event.target.value }))}
      />
      <TextField
        size='small'
        label='Trade-in Value (USD)'
        type='number'
        value={tradeIn.tradeInValue}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          dispatch(setTradeIn({ tradeInValue: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 }));
        }}
        inputProps={{ min: 0, inputMode: 'decimal' }}
        onKeyDown={(event) => {
          if (['e', 'E', '+', '-'].includes(event.key)) {
            event.preventDefault();
          }
        }}
      />
    </Stack>
  );
};

export default TradeInForm;
