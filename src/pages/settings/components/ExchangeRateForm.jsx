import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  InputAdornment,
  Fade,
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import {
  selectExchangeRate,
  setExchangeRate,
} from '../../../redux/slices/settingsSlice';

const ExchangeRateForm = () => {
  const dispatch = useDispatch();
  const currentRate = useSelector(selectExchangeRate);

  const [rate, setRate] = useState(currentRate);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Sync local state if Redux state changes from another source
    setRate(currentRate);
  }, [currentRate]);

  const handleSave = () => {
    const numericRate = parseFloat(rate);
    if (!Number.isFinite(numericRate) || numericRate <= 0) {
      setError('Rate must be a positive number.');
      return;
    }

    setError('');
    dispatch(setExchangeRate(numericRate));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000); // Hide success message after 2s
  };

  return (
    <Card>
      <CardHeader
        title='Currency & Exchange Rate'
        subheader='Set the daily conversion rate from USD to AFN.'
      />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>$1 USD =</Typography>
          <TextField
            type='number'
            size='small'
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: <InputAdornment position='end'>AFN</InputAdornment>,
              inputProps: {
                step: '0.01',
              },
            }}
            sx={{ maxWidth: 180 }}
          />
          <Button
            variant='contained'
            onClick={handleSave}
            disabled={rate === currentRate}
          >
            Save Rate
          </Button>
          <Fade in={showSuccess}>
            <CheckCircleOutlineRoundedIcon color='success' />
          </Fade>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExchangeRateForm;
