import { useMemo } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import DataGridContainer from '../../../components/ui/DataGridContainer';
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/ui/EmptyState';

const CustomNoRowsOverlay = () => (
  <EmptyState
    message='No Inventory Items Found'
    details='Add items or adjust your filters to see results.'
  />
);

const formatCurrency = (value, currency) => {
  const prefix = currency === 'AFN' ? 'AFN ' : '$';
  return `${prefix}${Number(value ?? 0).toLocaleString()}`;
};

const InventoryTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = useMemo(
    () => [
      {
        field: 'itemType',
        headerName: 'Item Type',
        width: 130,
        valueFormatter: (value) =>
          typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '',
      },
      { field: 'displayName', headerName: 'Name/Model', flex: 1, minWidth: 220 },
      { field: 'brand', headerName: 'Brand', width: 140 },
      {
        field: 'stockStatus',
        headerName: 'Stock/Status',
        width: 140,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => <StatusBadge status={value || 'Unknown'} />,
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        width: 100,
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => <Typography sx={{ fontWeight: 600 }}>{value}</Typography>,
      },
      {
        field: 'sellPrice',
        headerName: 'Sell Price',
        width: 140,
        type: 'number',
        renderCell: ({ value, row }) => (
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {formatCurrency(value, row.currency)}
          </Typography>
        ),
      },
      {
        field: 'dateAdded',
        headerName: 'Date Added',
        width: 130,
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
              <IconButton size='small' color='error' onClick={() => onDelete(row)}>
                <DeleteOutlineRoundedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataGridContainer
      rows={data}
      columns={columns}
      loading={loading}
      getRowId={(row) => `${row.itemType}::${row.id}`}
      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
      pageSizeOptions={[10, 25, 50, 100]}
      slots={{ noRowsOverlay: CustomNoRowsOverlay }}
      disableRowSelectionOnClick
    />
  );
};

export default InventoryTable;
