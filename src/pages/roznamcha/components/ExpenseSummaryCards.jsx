import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

import { KPICard } from '../../../components/ui/KPICard';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { selectPrimaryCurrency } from '../../../redux/slices/settingsSlice';
import { formatCurrency } from '../../../utils/currencyFormatter';
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const ExpenseSummaryCards = ({ expenses }) => {
  const { t } = useTranslation();
  const convert = useCurrencyConverter();
  const primaryCurrency = useSelector(selectPrimaryCurrency);

  const summaries = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    // Adjust to make Saturday the start of the week if culturally appropriate, or Sunday
    startOfWeek.setDate(today.getDate() - today.getDay());

    let totalExpense = 0;
    let todayExpense = 0;
    let weeklyExpense = 0;

    (expenses || []).forEach((expense) => {
      // Ensure amount is a number before converting
      const amount = Number(expense.amount);
      if (!Number.isFinite(amount)) return;

      const amountInPrimary = convert(
        amount,
        expense.currency,
        primaryCurrency
      );
      totalExpense += amountInPrimary;

      const expenseDate = new Date(expense.date);
      if (expenseDate >= today) {
        todayExpense += amountInPrimary;
      }
      if (expenseDate >= startOfWeek) {
        weeklyExpense += amountInPrimary;
      }
    });

    return {
      totalExpense: round2(totalExpense),
      todayExpense: round2(todayExpense),
      weeklyExpense: round2(weeklyExpense),
    };
  }, [expenses, convert, primaryCurrency]);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title={t('roznamcha.summary.today')}
          value={formatCurrency(summaries.todayExpense, primaryCurrency)}
          color='warning.main'
          icon={<TodayRoundedIcon sx={{ fontSize: 36 }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPICard
          title={t('roznamcha.summary.thisWeek')}
          value={formatCurrency(summaries.weeklyExpense, primaryCurrency)}
          color='info.main'
          icon={<DateRangeRoundedIcon sx={{ fontSize: 36 }} />}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <KPICard
          title={t('roznamcha.summary.totalFiltered')}
          value={formatCurrency(summaries.totalExpense, primaryCurrency)}
          color='text.secondary'
          icon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: 36 }} />}
        />
      </Grid>
    </Grid>
  );
};

export default ExpenseSummaryCards;
