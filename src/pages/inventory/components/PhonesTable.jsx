import React, { useMemo } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import DataGridContainer from '../../../components/ui/DataGridContainer';
import { useAppStatus } from '../../../hooks/useAppStatus';
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/ui/EmptyState';

const CustomNoRowsOverlay = () => (
  <EmptyState
    message='No Phones Found'
    details='Try adjusting your search or filter criteria.'
  />
);

const PhonesTable = ({ data, loading, onEdit, onDelete }) => {
  const { isRtl } = useAppStatus();

  const columns = useMemo(
    () => [
      { field: 'imei', headerName: 'IMEI', width: 160 },
      { field: 'model', headerName: 'Model', flex: 1, minWidth: 200 },
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
        field: 'stockStatus',
        headerName: 'Status',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ value }) => <StatusBadge status={value} />,
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

export default PhonesTable;
