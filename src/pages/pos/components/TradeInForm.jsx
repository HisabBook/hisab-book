import { useDispatch, useSelector } from 'react-redux';
import { Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { selectTradeIn, setTradeIn } from '../../../redux/slices/posSlice';

const TradeInForm = () => {
  const dispatch = useDispatch();
  const tradeIn = useSelector(selectTradeIn);

  return (
    <Stack spacing={1.25}>
      <TextField
        size='small'
        label='Trade-in Value'
        value={tradeIn.tradeInValue}
        onChange={(e) => dispatch(setTradeIn({ tradeInValue: e.target.value }))}
        inputMode='decimal'
      />
      <ToggleButtonGroup
        exclusive
        size='small'
        value={tradeIn.currency}
        onChange={(_, value) => value && dispatch(setTradeIn({ currency: value }))}
      >
        <ToggleButton value='USD'>USD</ToggleButton>
        <ToggleButton value='AFN'>AFN</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

export default TradeInForm;
