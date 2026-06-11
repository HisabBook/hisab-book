import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import {
  selectAllCustomers,
  selectAllDebts,
  selectCustomerEntities,
  selectOpenDebts,
  selectSettledDebts,
} from '../../redux/slices/khataSlice';

const formatMoney = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const statusColor = (status) => {
  if (status === 'settled') return 'success';
  if (status === 'partial') return 'warning';
  return 'error';
};

const SummaryCard = ({ label, value, helper }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.25,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}
  >
    <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant='h5' sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
    <Typography variant='caption' color='text.secondary'>
      {helper}
    </Typography>
  </Paper>
);

const KhataPage = () => {
  const customers = useSelector(selectAllCustomers);
  const debts = useSelector(selectAllDebts);
  const openDebts = useSelector(selectOpenDebts);
  const settledDebts = useSelector(selectSettledDebts);
  const customerEntities = useSelector(selectCustomerEntities);

  const totalOutstanding = openDebts.reduce(
    (sum, debt) => sum + (Number(debt.remainingBalance) || 0),
    0
  );
  const currency = debts[0]?.currency ?? customers[0]?.currency ?? 'USD';

  return (
    <Box>
      <PageHeader title='Khata' />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <SummaryCard
          label='Customers'
          value={customers.length}
          helper='Stored in normalized customer entities'
        />
        <SummaryCard
          label='Open debts'
          value={openDebts.length}
          helper={formatMoney(totalOutstanding, currency)}
        />
        <SummaryCard
          label='Settled debts'
          value={settledDebts.length}
          helper='Ready for history and reporting'
        />
      </Stack>

      {debts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            minHeight: 320,
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
        <Stack spacing={2}>
          {debts.map((debt) => {
            const customer = customerEntities[debt.customerId];
            return (
              <Paper
                key={debt.id}
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography variant='h6' sx={{ fontWeight: 700 }}>
                      {customer?.name || 'Unknown customer'}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {customer?.phone || 'No phone'} ·{' '}
                      {debt.linkedSaleNumber || 'Manual debt'}
                    </Typography>
                  </Box>

                  <Stack
                    direction='row'
                    spacing={1}
                    alignItems='center'
                    flexWrap='wrap'
                  >
                    <Chip
                      label={debt.status}
                      color={statusColor(debt.status)}
                      size='small'
                    />
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {formatMoney(debt.remainingBalance, debt.currency)}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Total: {formatMoney(debt.totalDebt, debt.currency)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Paid: {formatMoney(debt.paidAmount, debt.currency)}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Created: {new Date(debt.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Updated: {new Date(debt.updatedAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default KhataPage;
