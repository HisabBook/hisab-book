import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { nanoid } from '@reduxjs/toolkit';

import DataGridContainer from '../../../components/ui/DataGridContainer';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../utils/currencyFormatter';

const ExpenseTable = ({ data, loading, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getRowId = (row) => row.id || nanoid();

  const columns = useMemo(
    () => [
      {
        field: 'date',
        headerName: t('common.date'),
        width: 130,
        renderCell: ({ value }) => (
          <Typography variant='body2'>
            {value ? new Date(value).toLocaleDateString() : '—'}
          </Typography>
        ),
      },
      { field: 'category', headerName: t('common.category'), width: 150 },
      {
        field: 'description',
        headerName: t('common.description'),
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'amount',
        headerName: t('common.amount'),
        width: 150,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }) => (
          <Typography sx={{ fontWeight: 600 }}>
            {formatCurrency(row.amount, row.currency)}
          </Typography>
        ),
      },
      {
        field: 'actions',
        headerName: t('common.actions'),
        width: 100,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) =>
          row.id ? (
            <Box>
              <Tooltip title={t('common.edit')}>
                <IconButton size='small' onClick={() => onEdit(row)}>
                  <EditRoundedIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('common.delete')}>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => onDelete(row)}
                >
                  <DeleteOutlineRoundedIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          ) : null,
      },
    ],
    [t, onEdit, onDelete]
  );
  if (isMobile) {
    if (!data.length && !loading) {
      return (
        <EmptyState
          message={t('roznamcha.empty.title')}
          details={t('roznamcha.empty.details')}
        />
      );
    }
    return (
      <Stack spacing={1.5}>
        {data.map((row) => {
          const rowId = getRowId(row);
          return (
            <Card key={rowId}>
              <CardContent>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {row.description || 'No Description'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {row.category} &bull;{' '}
                  {row.date
                    ? new Date(row.date).toLocaleDateString()
                    : 'No Date'}
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, color: 'primary.main', my: 1 }}
                >
                  {formatCurrency(row.amount, row.currency)}
                </Typography>
                {row.id && (
                  <Stack direction='row' spacing={1}>
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => onEdit(row)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      onClick={() => onDelete(row)}
                    >
                      {t('common.delete')}
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  }

  return (
    <DataGridContainer
      rows={data}
      columns={columns}
      loading={loading}
      getRowId={getRowId}
      initialState={{
        sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
      }}
      slots={{
        noRowsOverlay: () => (
          <EmptyState
            message={t('roznamcha.empty.title')}
            details={t('roznamcha.empty.details')}
          />
        ),
      }}
      autoHeight
      pageSizeOptions={[10, 25, 50]}
    />
  );
};

export default ExpenseTable;
