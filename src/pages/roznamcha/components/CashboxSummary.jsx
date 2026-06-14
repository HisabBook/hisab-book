import { useSelector } from 'react-redux';
import { Grid, Paper, Stack, Typography, useTheme, Box } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import SouthWestRoundedIcon from '@mui/icons-material/SouthWestRounded';

import { selectTodayCashboxSummary } from '../../../redux/slices/roznamchaSlice';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { KPICard } from '../../../components/ui/KPICard';

const CashboxSummary = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const summary = useSelector(selectTodayCashboxSummary);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: isDark ? 'background.paper' : 'rgba(244, 246, 248, 0.7)',
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            Expected Cash in Drawer (Today)
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            This is the system-calculated cash based on today's sales,
            repayments, and expenses.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <KPICard
              title='Net Cash (USD)'
              value={formatCurrency(summary.usd, 'USD')}
              color={summary.usd >= 0 ? 'success.main' : 'error.main'}
              icon={
                <AccountBalanceWalletRoundedIcon
                  sx={{ fontSize: 32, opacity: 0.8 }}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <KPICard
              title='Net Cash (AFN)'
              value={formatCurrency(summary.afn, 'AFN')}
              color={summary.afn >= 0 ? 'success.main' : 'error.main'}
              icon={
                <AccountBalanceWalletRoundedIcon
                  sx={{ fontSize: 32, opacity: 0.8 }}
                />
              }
            />
          </Grid>
        </Grid>

        {/* Detailed Breakdown */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Stack spacing={0.5}>
              <Typography variant='caption' color='text.secondary'>
                USD Inflow
              </Typography>
              <Typography sx={{ fontWeight: 600, color: 'success.dark' }}>
                <NorthEastRoundedIcon
                  fontSize='inherit'
                  sx={{ verticalAlign: 'middle', mr: 0.5 }}
                />
                {formatCurrency(summary.inflows.usd, 'USD')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Stack spacing={0.5}>
              <Typography variant='caption' color='text.secondary'>
                USD Outflow
              </Typography>
              <Typography sx={{ fontWeight: 600, color: 'error.dark' }}>
                <SouthWestRoundedIcon
                  fontSize='inherit'
                  sx={{ verticalAlign: 'middle', mr: 0.5 }}
                />
                {formatCurrency(summary.outflows.usd, 'USD')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Stack spacing={0.5}>
              <Typography variant='caption' color='text.secondary'>
                AFN Inflow
              </Typography>
              <Typography sx={{ fontWeight: 600, color: 'success.dark' }}>
                <NorthEastRoundedIcon
                  fontSize='inherit'
                  sx={{ verticalAlign: 'middle', mr: 0.5 }}
                />
                {formatCurrency(summary.inflows.afn, 'AFN')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Stack spacing={0.5}>
              <Typography variant='caption' color='text.secondary'>
                AFN Outflow
              </Typography>
              <Typography sx={{ fontWeight: 600, color: 'error.dark' }}>
                <SouthWestRoundedIcon
                  fontSize='inherit'
                  sx={{ verticalAlign: 'middle', mr: 0.5 }}
                />
                {formatCurrency(summary.outflows.afn, 'AFN')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default CashboxSummary;
