
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

import { selectTodayCashboxSummary } from '../../../redux/slices/roznamchaSlice';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { KPICard } from '../../../components/ui/KPICard';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

const RoznamchaSummary = ({ expenses, primaryCurrency }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cashbox = useSelector(selectTodayCashboxSummary);
  const convert = useCurrencyConverter();

  // --- Calculation for Expense Cards ---
  const expenseSummaries = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekStr = startOfWeek.toISOString().slice(0, 10);

    let todayTotal = 0;
    let weeklyTotal = 0;
    let filteredTotal = 0;

    (expenses || []).forEach((expense) => {
      const amountInPrimary = convert(
        expense.amount,
        expense.currency,
        primaryCurrency
      );
      filteredTotal += amountInPrimary;

      if (expense.date === today) {
        todayTotal += amountInPrimary;
      }
      if (expense.date >= startOfWeekStr) {
        weeklyTotal += amountInPrimary;
      }
    });

    return { todayTotal, weeklyTotal, filteredTotal };
  }, [expenses, convert, primaryCurrency]);

  return (
    <Stack spacing={3}>
      {/* === Section 1: Expected Cash in Drawer === */}
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
            <Grid item xs={12} sm={6}>
              <KPICard
                title='Net Cash (USD)'
                value={formatCurrency(cashbox.usd, 'USD')}
                color={cashbox.usd >= 0 ? 'success.main' : 'error.main'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KPICard
                title='Net Cash (AFN)'
                value={formatCurrency(cashbox.afn, 'AFN')}
                color={cashbox.afn >= 0 ? 'success.main' : 'error.main'}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant='caption' color='text.secondary'>
                USD Inflow
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'success.dark',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendingUpRoundedIcon fontSize='inherit' />
                {formatCurrency(cashbox.inflows.usd, 'USD')}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant='caption' color='text.secondary'>
                USD Outflow
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'error.dark',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendingDownRoundedIcon fontSize='inherit' />
                {formatCurrency(cashbox.outflows.usd, 'USD')}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant='caption' color='text.secondary'>
                AFN Inflow
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'success.dark',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendingUpRoundedIcon fontSize='inherit' />
                {formatCurrency(cashbox.inflows.afn, 'AFN')}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant='caption' color='text.secondary'>
                AFN Outflow
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: 'error.dark',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendingDownRoundedIcon fontSize='inherit' />
                {formatCurrency(cashbox.outflows.afn, 'AFN')}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      {/* === Section 2: Expense Summary Cards === */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Today's Expenses"
            value={formatCurrency(expenseSummaries.todayTotal, primaryCurrency)}
            color='warning.main'
            icon={<TodayRoundedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="This Week's Expenses"
            value={formatCurrency(
              expenseSummaries.weeklyTotal,
              primaryCurrency
            )}
            color='info.main'
            icon={<DateRangeRoundedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <KPICard
            title='Total (Filtered)'
            value={formatCurrency(
              expenseSummaries.filteredTotal,
              primaryCurrency
            )}
            color='text.secondary'
            icon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default RoznamchaSummary;
