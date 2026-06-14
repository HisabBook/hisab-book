import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import {
  addRepayment,
  selectAllCustomers,
  selectAllDebts,
  selectAllRepayments,
  selectCustomerDebtRecord,
} from '../../redux/slices/khataSlice';

const formatMoney = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDateTime = (value) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const statusMeta = (status) => {
  if (status === 'settled') {
    return {
      label: 'Settled',
      color: 'success',
      icon: <CheckCircleRoundedIcon fontSize='small' />,
      tint: 'rgba(46, 125, 50, 0.12)',
      border: 'rgba(46, 125, 50, 0.22)',
    };
  }

  if (status === 'partial') {
    return {
      label: 'Partial',
      color: 'warning',
      icon: <HourglassBottomRoundedIcon fontSize='small' />,
      tint: 'rgba(237, 108, 2, 0.12)',
      border: 'rgba(237, 108, 2, 0.22)',
    };
  }

  return {
    label: 'Unpaid',
    color: 'error',
    icon: <TrendingDownRoundedIcon fontSize='small' />,
    tint: 'rgba(211, 47, 47, 0.12)',
    border: 'rgba(211, 47, 47, 0.24)',
  };
};

const moneyBreakdown = (entries) => {
  const parts = Object.entries(entries)
    .filter(([, amount]) => amount > 0)
    .map(([currency, amount]) => `${formatMoney(amount, currency)}`);

  return parts.length > 0 ? parts.join(' | ') : formatMoney(0, 'USD');
};

const SummaryCard = ({ label, value, helper, icon, tint }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      background:
        'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,251,253,0.96))',
      minHeight: 126,
    }}
  >
    <Stack spacing={1.5}>
      <Box
        sx={{
          width: 42,
          height: 42,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          bgcolor: tint ?? 'rgba(25, 118, 210, 0.1)',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant='h5' sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {helper}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const CustomerLedgerRow = ({ record, active, onClick }) => {
  const meta = statusMeta(record.status);

  return (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemButton
        selected={active}
        onClick={onClick}
        sx={{
          alignItems: 'flex-start',
          gap: 1.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: active ? meta.border : 'divider',
          bgcolor: active ? meta.tint : 'background.paper',
          px: 1.75,
          py: 1.5,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            bgcolor: meta.tint,
          },
          '&:hover': {
            bgcolor: meta.tint,
          },
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: meta.tint,
            color: meta.color === 'success' ? 'success.main' : `${meta.color}.main`,
            border: '1px solid',
            borderColor: meta.border,
            fontWeight: 700,
          }}
        >
          {(record.customer?.name || '?')
            .split(' ')
            .map((part) => part[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </Avatar>

        <ListItemText
          disableTypography
          primary={
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent='space-between'
            >
              <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>
                {record.customer?.name || 'Unknown customer'}
              </Typography>
              <Chip
                icon={meta.icon}
                label={meta.label}
                color={meta.color}
                size='small'
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          }
          secondary={
            <Stack spacing={0.75} sx={{ mt: 0.75 }}>
              <Typography variant='body2' color='text.secondary'>
                <PhoneRoundedIcon
                  fontSize='inherit'
                  sx={{ verticalAlign: 'text-bottom', mr: 0.5 }}
                />
                {record.customer?.phone || 'No phone'}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ flexWrap: 'wrap' }}
              >
                <Chip
                  size='small'
                  label={`Owed ${formatMoney(record.totalDebt, record.customer?.currency || 'USD')}`}
                  variant='outlined'
                  color='error'
                />
                <Chip
                  size='small'
                  label={`Paid ${formatMoney(record.paidAmount, record.customer?.currency || 'USD')}`}
                  variant='outlined'
                  color='success'
                />
                <Chip
                  size='small'
                  label={`Remaining ${formatMoney(
                    record.remainingBalance,
                    record.customer?.currency || 'USD'
                  )}`}
                  variant='outlined'
                  color={record.remainingBalance > 0 ? 'error' : 'success'}
                />
              </Stack>
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

const DebtTimeline = ({ debt, repayments }) => {
  const meta = statusMeta(debt.status);
  const timeline = useMemo(() => {
    const orderedRepayments = [...repayments].sort(
      (a, b) => new Date(a.paidAt || a.createdAt) - new Date(b.paidAt || b.createdAt)
    );

    const items = [
      {
        id: `${debt.id}-created`,
        type: 'created',
        timestamp: debt.createdAt,
        title: debt.linkedSaleNumber || 'Manual debt',
        amount: debt.totalDebt,
        balanceAfter: debt.totalDebt,
        status: debt.totalDebt <= 0 ? 'settled' : 'open',
        note: debt.notes || '',
      },
    ];

    let runningPaid = 0;
    orderedRepayments.forEach((repayment) => {
      runningPaid += Number(repayment.amount) || 0;
      const remainingBalance = Math.max(0, Number(debt.totalDebt) - runningPaid);
      const paymentStatus =
        remainingBalance <= 0 ? 'settled' : runningPaid > 0 ? 'partial' : 'open';

      items.push({
        id: repayment.id,
        type: 'repayment',
        timestamp: repayment.paidAt || repayment.createdAt,
        title: 'Repayment received',
        amount: repayment.amount,
        balanceAfter: remainingBalance,
        status: paymentStatus,
        note: repayment.notes || '',
        method: repayment.method || 'cash',
        linkedSaleNumber: repayment.linkedSaleNumber || null,
      });
    });

    return items.sort(
      (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    );
  }, [debt, repayments]);

  return (
    <Stack spacing={1.5}>
      <Paper
        variant='outlined'
        sx={{
          p: 1.75,
          borderRadius: 2.5,
          borderColor: meta.border,
          bgcolor: meta.tint,
        }}
      >
        <Stack spacing={1.25}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent='space-between'
          >
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>
                {debt.linkedSaleNumber || 'Manual debt'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Created {formatDateTime(debt.createdAt)}
              </Typography>
            </Box>
            <Chip icon={meta.icon} label={meta.label} color={meta.color} />
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ flexWrap: 'wrap' }}
          >
            <Chip
              size='small'
              icon={<AccountBalanceRoundedIcon />}
              label={`Total ${formatMoney(debt.totalDebt, debt.currency)}`}
            />
            <Chip
              size='small'
              icon={<PaymentsRoundedIcon />}
              label={`Paid ${formatMoney(debt.paidAmount, debt.currency)}`}
            />
            <Chip
              size='small'
              icon={<TrendingDownRoundedIcon />}
              label={`Balance ${formatMoney(debt.remainingBalance, debt.currency)}`}
            />
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={1}>
        {timeline.map((item) => {
          const itemMeta = statusMeta(item.status);

          return (
            <Paper
              key={item.id}
              variant='outlined'
              sx={{
                p: 1.5,
                borderRadius: 2.25,
                borderColor: itemMeta.border,
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent='space-between'
                  spacing={1}
                >
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 800 }}>
                      {item.title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatDateTime(item.timestamp)}
                    </Typography>
                  </Box>
                  <Chip
                    size='small'
                    icon={itemMeta.icon}
                    label={itemMeta.label}
                    color={itemMeta.color}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Chip
                    size='small'
                    label={
                      item.type === 'repayment'
                        ? `Payment ${formatMoney(item.amount, debt.currency)}`
                        : `Debt ${formatMoney(item.amount, debt.currency)}`
                    }
                  />
                  <Chip
                    size='small'
                    label={`Balance after ${formatMoney(item.balanceAfter, debt.currency)}`}
                    variant='outlined'
                  />
                  {item.type === 'repayment' && item.method ? (
                    <Chip size='small' label={item.method} variant='outlined' />
                  ) : null}
                </Stack>
                {item.note ? (
                  <Typography variant='caption' color='text.secondary'>
                    {item.note}
                  </Typography>
                ) : null}
                {item.linkedSaleNumber ? (
                  <Typography variant='caption' color='text.secondary'>
                    Linked sale: {item.linkedSaleNumber}
                  </Typography>
                ) : null}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
};

const KhataPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const customers = useSelector(selectAllCustomers);
  const debts = useSelector(selectAllDebts);
  const repayments = useSelector(selectAllRepayments);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedDebtId, setSelectedDebtId] = useState('');
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentNote, setRepaymentNote] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const customerRecords = useMemo(() => {
    return customers.map((customer) => {
      const customerDebts = debts.filter((debt) => debt?.customerId === customer.id);
      const customerRepayments = repayments.filter(
        (repayment) => repayment?.customerId === customer.id
      );
      const totalDebt = customerDebts.reduce(
        (sum, debt) => sum + (Number(debt?.totalDebt) || 0),
        0
      );
      const paidAmount = customerDebts.reduce(
        (sum, debt) => sum + (Number(debt?.paidAmount) || 0),
        0
      );
      const remainingBalance = customerDebts.reduce(
        (sum, debt) => sum + (Number(debt?.remainingBalance) || 0),
        0
      );
      const status =
        remainingBalance <= 0
          ? 'settled'
          : paidAmount > 0
            ? 'partial'
            : 'open';

      const lastActivityAt = customerRepayments.reduce((latest, repayment) => {
        const candidate = repayment.updatedAt || repayment.createdAt || repayment.paidAt;
        if (!candidate) return latest;
        if (!latest) return candidate;
        return new Date(candidate) > new Date(latest) ? candidate : latest;
      }, customer.updatedAt || customer.createdAt || null);

      return {
        id: customer.id,
        customer,
        debts: customerDebts,
        repayments: customerRepayments,
        totalDebt,
        paidAmount,
        remainingBalance,
        status,
        lastActivityAt,
      };
    });
  }, [customers, debts, repayments]);

  useEffect(() => {
    if (!selectedCustomerId && customerRecords.length > 0) {
      setSelectedCustomerId(customerRecords[0].id);
    }
  }, [customerRecords, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customerRecords
      .filter((record) => {
        if (statusFilter !== 'all' && record.status !== statusFilter) {
          return false;
        }

        if (!query) return true;

        return (
          record.customer?.name?.toLowerCase().includes(query) ||
          record.customer?.phone?.toLowerCase().includes(query) ||
          record.debts.some(
            (debt) =>
              debt?.linkedSaleNumber?.toLowerCase().includes(query) ||
              debt?.notes?.toLowerCase().includes(query)
          )
        );
      })
      .sort((a, b) => {
        const aTime = new Date(a.lastActivityAt || a.customer?.updatedAt || 0).getTime();
        const bTime = new Date(b.lastActivityAt || b.customer?.updatedAt || 0).getTime();
        return bTime - aTime;
      });
  }, [customerRecords, search, statusFilter]);

  useEffect(() => {
    if (
      filteredCustomers.length > 0 &&
      !filteredCustomers.some((record) => record.id === selectedCustomerId)
    ) {
      setSelectedCustomerId(filteredCustomers[0].id);
    }
  }, [filteredCustomers, selectedCustomerId]);

  const selectedCustomerRecord =
    filteredCustomers.find((record) => record.id === selectedCustomerId) || null;

  const selectedCustomerDetail = useSelector((state) =>
    selectedCustomerId ? selectCustomerDebtRecord(state, selectedCustomerId) : null
  );

  const detailCustomer = selectedCustomerDetail?.customer ?? selectedCustomerRecord?.customer;
  const detailDebts = selectedCustomerDetail?.debtRecords ?? selectedCustomerRecord?.debts ?? [];
  const detailRepayments =
    selectedCustomerDetail?.repayments ?? selectedCustomerRecord?.repayments ?? [];

  const activeDebt = useMemo(() => {
    if (!detailDebts.length) return null;
    const byId =
      detailDebts.find((debt) => debt.id === selectedDebtId) ||
      detailDebts.find((debt) => debt.status !== 'settled') ||
      [...detailDebts].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )[0];
    return byId || null;
  }, [detailDebts, selectedDebtId]);

  useEffect(() => {
    if (!detailDebts.length) {
      setSelectedDebtId('');
      return;
    }

    if (!detailDebts.some((debt) => debt.id === selectedDebtId)) {
      const preferred =
        detailDebts.find((debt) => debt.status !== 'settled') || detailDebts[0];
      setSelectedDebtId(preferred.id);
    }
  }, [detailDebts, selectedDebtId]);

  useEffect(() => {
    setFeedback(null);
    setRepaymentAmount('');
    setRepaymentNote('');
  }, [selectedCustomerId, selectedDebtId]);

  const outstandingByCurrency = useMemo(
    () =>
      customerRecords.reduce((accumulator, record) => {
        const currency = record.customer?.currency || 'USD';
        accumulator[currency] = (accumulator[currency] || 0) + record.remainingBalance;
        return accumulator;
      }, {}),
    [customerRecords]
  );

  const settledByCurrency = useMemo(
    () =>
      customerRecords.reduce((accumulator, record) => {
        const currency = record.customer?.currency || 'USD';
        accumulator[currency] =
          (accumulator[currency] || 0) + (record.totalDebt - record.remainingBalance);
        return accumulator;
      }, {}),
    [customerRecords]
  );

  const totalCustomers = customerRecords.length;

  const handleSubmitRepayment = (forceFull = false) => {
    if (!activeDebt) {
      setFeedback({
        type: 'error',
        message: 'Please select a debt record first.',
      });
      return;
    }

    const amount = forceFull
      ? Number(activeDebt.remainingBalance) || 0
      : Number(repaymentAmount) || 0;

    if (amount <= 0) {
      setFeedback({
        type: 'error',
        message: 'Repayment amount must be greater than zero.',
      });
      return;
    }

    if (amount > Number(activeDebt.remainingBalance) || amount > Number(activeDebt.remainingBalance)) {
      setFeedback({
        type: 'error',
        message: 'Repayment cannot exceed the remaining balance.',
      });
      return;
    }

    dispatch(
      addRepayment({
        debtId: activeDebt.id,
        amount,
        currency: activeDebt.currency,
        method: 'cash',
        notes: repaymentNote.trim(),
        paidAt: new Date().toISOString(),
      })
    );

    const nextRemaining = Math.max(0, Number(activeDebt.remainingBalance) - amount);
    setFeedback({
      type: 'success',
      message:
        nextRemaining <= 0
          ? 'Payment recorded and the debt is now settled.'
          : 'Partial repayment recorded successfully.',
    });
    setRepaymentAmount('');
    setRepaymentNote('');
  };

  const selectedDebtRepayments = useMemo(
    () =>
      detailRepayments
        .filter((repayment) => repayment.debtId === activeDebt?.id)
        .sort(
          (a, b) =>
            new Date(a.paidAt || a.createdAt || 0) - new Date(b.paidAt || b.createdAt || 0)
        ),
    [detailRepayments, activeDebt]
  );

  const selectedDebtMeta = activeDebt ? statusMeta(activeDebt.status) : null;

  const drawerContent = detailCustomer ? (
    <Stack spacing={2.25} sx={{ p: 2.25 }}>
      <Box>
        <Stack direction='row' spacing={1.25} alignItems='center'>
          <Avatar
            sx={{
              width: 54,
              height: 54,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              fontWeight: 800,
            }}
          >
            {(detailCustomer?.name || '?')
              .split(' ')
              .map((part) => part[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant='h6' sx={{ fontWeight: 800 }}>
              {detailCustomer?.name || 'Unknown customer'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {detailCustomer?.phone || 'No phone'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Stack spacing={1.25}>
        <SummaryCard
          label='Total owed'
          value={formatMoney(
            selectedCustomerDetail?.totalDebt ?? 0,
            detailCustomer?.currency || 'USD'
          )}
          helper='All debt records combined'
          icon={<AccountBalanceRoundedIcon sx={{ color: 'error.main' }} />}
          tint='rgba(211, 47, 47, 0.1)'
        />
        <SummaryCard
          label='Amount paid'
          value={formatMoney(
            selectedCustomerDetail?.paidAmount ?? 0,
            detailCustomer?.currency || 'USD'
          )}
          helper='Repayments and paid amount'
          icon={<PaymentsRoundedIcon sx={{ color: 'success.main' }} />}
          tint='rgba(46, 125, 50, 0.1)'
        />
        <SummaryCard
          label='Remaining balance'
          value={formatMoney(
            selectedCustomerDetail?.remainingBalance ?? 0,
            detailCustomer?.currency || 'USD'
          )}
          helper='Outstanding amount'
          icon={<TrendingDownRoundedIcon sx={{ color: 'warning.main' }} />}
          tint='rgba(237, 108, 2, 0.1)'
        />
      </Stack>

      <Paper variant='outlined' sx={{ p: 1.75, borderRadius: 2.5 }}>
        <Stack spacing={1}>
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            Debt selection
          </Typography>

          <FormControl size='small' fullWidth>
            <Select
              value={activeDebt?.id || ''}
              onChange={(event) => setSelectedDebtId(event.target.value)}
            >
              {detailDebts.map((debt) => {
                const meta = statusMeta(debt.status);
                return (
                  <MenuItem key={debt.id} value={debt.id}>
                    {debt.linkedSaleNumber || 'Manual debt'} - {meta.label} - {formatMoney(
                      debt.remainingBalance,
                      debt.currency
                    )}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ flexWrap: 'wrap' }}
          >
            <Chip label={`${detailDebts.length} debt records`} size='small' />
            <Chip label={`${detailRepayments.length} repayments`} size='small' />
            <Chip
              label={`Last activity ${formatDateTime(
                selectedCustomerDetail?.lastActivityAt
              )}`}
              size='small'
              variant='outlined'
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper variant='outlined' sx={{ p: 1.75, borderRadius: 2.5 }}>
        <Stack spacing={1.5}>
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            Record repayment
          </Typography>

          {selectedDebtMeta ? (
            <Chip
              icon={selectedDebtMeta.icon}
              label={`Selected debt is ${selectedDebtMeta.label}`}
              color={selectedDebtMeta.color}
              size='small'
            />
          ) : null}

          {feedback ? <Alert severity={feedback.type}>{feedback.message}</Alert> : null}

          {!activeDebt ? (
            <EmptyState
              message='No active debt selected'
              details='Choose a debt record to record a repayment.'
            />
          ) : activeDebt.remainingBalance <= 0 ? (
            <Alert severity='success'>This debt is already settled.</Alert>
          ) : (
            <Stack spacing={1.5}>
              <TextField
                label='Repayment amount'
                type='number'
                value={repaymentAmount}
                onChange={(event) => setRepaymentAmount(event.target.value)}
                inputProps={{
                  min: 0,
                  max: activeDebt.remainingBalance,
                  step: '0.01',
                }}
                helperText={`Remaining balance: ${formatMoney(
                  activeDebt.remainingBalance,
                  activeDebt.currency
                )}`}
                fullWidth
              />

              <TextField
                label='Optional note'
                value={repaymentNote}
                onChange={(event) => setRepaymentNote(event.target.value)}
                multiline
                minRows={2}
                fullWidth
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                <Button
                  variant='contained'
                  onClick={() => handleSubmitRepayment(false)}
                  disabled={Number(repaymentAmount) <= 0}
                  fullWidth
                >
                  Record payment
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => handleSubmitRepayment(true)}
                  fullWidth
                >
                  Settle balance
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper variant='outlined' sx={{ p: 1.75, borderRadius: 2.5 }}>
        <Stack spacing={1}>
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            Debt history timeline
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Repayments are append-only in this workflow. Reversals require a compensating entry.
          </Typography>
        </Stack>
      </Paper>

      {activeDebt ? (
        <DebtTimeline
          debt={activeDebt}
          repayments={selectedDebtRepayments}
        />
      ) : (
        <Paper variant='outlined' sx={{ p: 2 }}>
          <EmptyState
            message='Select a debt'
            details='Choose a debt record to review history and repayments.'
          />
        </Paper>
      )}

      {detailDebts.length > 1 ? (
        <Paper variant='outlined' sx={{ p: 1.75, borderRadius: 2.5 }}>
          <Stack spacing={1}>
            <Typography variant='body2' sx={{ fontWeight: 700 }}>
              Full customer history
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              This customer has multiple debt records. The timeline above follows the selected debt.
            </Typography>
          </Stack>

          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            {detailDebts.map((debt) => {
              const meta = statusMeta(debt.status);
              const repaymentCount = detailRepayments.filter(
                (repayment) => repayment.debtId === debt.id
              ).length;

              return (
                <Paper
                  key={debt.id}
                  variant='outlined'
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    borderColor: meta.border,
                    bgcolor: meta.tint,
                  }}
                >
                  <Stack spacing={0.75}>
                    <Stack direction='row' justifyContent='space-between' spacing={1}>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {debt.linkedSaleNumber || 'Manual debt'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatDateTime(debt.createdAt)}
                        </Typography>
                      </Box>
                      <Chip icon={meta.icon} label={meta.label} color={meta.color} size='small' />
                    </Stack>
                    <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        size='small'
                        label={formatMoney(debt.remainingBalance, debt.currency)}
                        variant='outlined'
                      />
                      <Chip
                        size='small'
                        label={`${repaymentCount} repayments`}
                        variant='outlined'
                      />
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  ) : (
    <EmptyState
      message='Select a customer'
      details='Choose a row from the ledger to inspect full debt history.'
    />
  );

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader title='Khata Ledger' />

      <Box
        sx={{
          mb: 3,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <SummaryCard
          label='Customers with debt history'
          value={totalCustomers}
          helper='Unique customer accounts'
          icon={<PersonRoundedIcon sx={{ color: 'primary.main' }} />}
          tint='rgba(25, 118, 210, 0.1)'
        />
        <SummaryCard
          label='Total outstanding balance'
          value={moneyBreakdown(outstandingByCurrency)}
          helper='Unpaid amount across all open balances'
          icon={<TrendingDownRoundedIcon sx={{ color: 'error.main' }} />}
          tint='rgba(211, 47, 47, 0.1)'
        />
        <SummaryCard
          label='Total settled amount'
          value={moneyBreakdown(settledByCurrency)}
          helper='Amount already recovered through repayments'
          icon={<CheckCircleRoundedIcon sx={{ color: 'success.main' }} />}
          tint='rgba(46, 125, 50, 0.1)'
        />
      </Box>

      {!isReady ? (
        <Stack spacing={2}>
          <Skeleton variant='rounded' height={56} />
          <Skeleton variant='rounded' height={160} />
          <Skeleton variant='rounded' height={160} />
        </Stack>
      ) : totalCustomers === 0 ? (
        <Paper
          elevation={0}
          sx={{
            minHeight: 360,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <EmptyState
            message='No Khata records yet'
            details='New debt records created from POS will appear here automatically.'
          />
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)',
            },
            alignItems: 'start',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={1.5}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography variant='h6' sx={{ fontWeight: 800 }}>
                      Customer ledger
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Search by name, phone, or invoice number. Red rows are unpaid,
                      green rows are settled.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${filteredCustomers.length} results`}
                    variant='outlined'
                    color='primary'
                  />
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems='stretch'
                >
                  <TextField
                    fullWidth
                    size='small'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Search customer or invoice'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchRoundedIcon fontSize='small' />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl size='small' sx={{ minWidth: { xs: '100%', sm: 180 } }}>
                    <Select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                    >
                      <MenuItem value='all'>All status</MenuItem>
                      <MenuItem value='open'>Unpaid</MenuItem>
                      <MenuItem value='partial'>Partial</MenuItem>
                      <MenuItem value='settled'>Settled</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ p: 1.5 }}>
              <List disablePadding>
                {filteredCustomers.map((record) => (
                  <CustomerLedgerRow
                    key={record.id}
                    record={record}
                    active={record.id === selectedCustomerId}
                    onClick={() => setSelectedCustomerId(record.id)}
                  />
                ))}
              </List>

              {filteredCustomers.length === 0 && (
                <Box sx={{ py: 6 }}>
                  <EmptyState
                    message='No matching customers'
                    details='Try a different search term or clear the status filter.'
                  />
                </Box>
              )}
            </Box>
          </Paper>

          {isDesktop ? (
            <Paper
              elevation={0}
              sx={{
                position: 'sticky',
                top: 24,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                minHeight: 520,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                  Customer details
                </Typography>
              </Box>
              {drawerContent}
            </Paper>
          ) : (
            <Drawer
              anchor='bottom'
              open={Boolean(selectedCustomerId)}
              onClose={() => setSelectedCustomerId('')}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  maxHeight: '82vh',
                },
              }}
            >
              <Box sx={{ p: 2, pb: 0 }}>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'
                  sx={{ mb: 1 }}
                >
                  <Typography variant='h6' sx={{ fontWeight: 800 }}>
                    Customer details
                  </Typography>
                  <IconButton onClick={() => setSelectedCustomerId('')}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Stack>
              </Box>
              <Box sx={{ overflowY: 'auto' }}>{drawerContent}</Box>
            </Drawer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default KhataPage;
