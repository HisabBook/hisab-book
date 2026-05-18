import React, { useMemo } from 'react';
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

import DataGridContainer from '../../../components/ui/DataGridContainer';
import { useAppStatus } from '../../../hooks/useAppStatus';
import EmptyState from '../../../components/ui/EmptyState';

const CustomNoRowsOverlay = () => (
  <EmptyState
    message='No Accessories Found'
    details='Try adding a new accessory or adjusting your filters.'
  />
);

const AccessoriesTable = ({ data, loading, onEdit, onDelete }) => {
  const { isRtl } = useAppStatus();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 250 },
      { field: 'category', headerName: 'Category', width: 150 },
      {
        field: 'quantity',
        headerName: 'Qty',
        width: 80,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => (
          <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        ),
      },
      { field: 'brand', headerName: 'Brand', width: 140 },
      {
        field: 'sellPrice',
        headerName: 'Sell Price',
        width: 140,
        renderCell: ({ value, row }) => (
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {row.currency === 'AFN' ? 'AFN ' : '$'}
            {Number(value).toLocaleString()}
          </Typography>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <Box>
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => onEdit(row)}>
                <EditRoundedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                color='error'
                onClick={() => onDelete(row)}
              >
                <DeleteOutlineRoundedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [isRtl, onEdit, onDelete]
  );

  if (isMobile) {
    if (!data.length) {
      return <CustomNoRowsOverlay />;
    }

    return (
      <Stack spacing={1.25}>
        {data.map((row) => (
          <Card key={row.id} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Category: {row.category}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Brand: {row.brand}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Qty: {row.quantity}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {row.currency === 'AFN' ? 'AFN ' : '$'}
                  {Number(row.sellPrice ?? 0).toLocaleString()}
                </Typography>
                <Stack direction='row' spacing={1} sx={{ pt: 0.5 }}>
                  <Button size='small' variant='outlined' onClick={() => onEdit(row)}>
                    Edit
                  </Button>
                  <Button
                    size='small'
                    color='error'
                    variant='outlined'
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <DataGridContainer
      rows={data}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id}
      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
      pageSizeOptions={[10, 25, 50, 100]}
      slots={{ noRowsOverlay: CustomNoRowsOverlay }}
      disableRowSelectionOnClick
    />
  );
};

export default AccessoriesTable;
