import React from 'react';
import { Card } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useAppStatus } from '../../hooks/useAppStatus';

const DataGridContainer = ({ sx, ...dataGridProps }) => {
  const { isRtl, isDark } = useAppStatus();

  return (
    <Card
      sx={{
        flexGrow: 1,
        display: 'flex',
        minHeight: { xs: 420, md: 500 },
        overflow: 'hidden',
        ...sx,
      }}
    >
      <DataGrid
        // Pass all the props like rows, columns, loading, etc.
        {...dataGridProps}
        // Centralized styling for all grids
        sx={{
          border: 'none',
          [`& .${gridClasses.columnHeaders}`]: {
            backgroundColor: isDark ? '#1A3F5C' : '#F4F6F9',
            fontWeight: 'bold',
          },
          [`& .${gridClasses.cell}`]: {
            borderBottom: `1px solid ${isDark ? '#1A3F5C' : '#E8EDF2'}`,
          },
          [`& .${gridClasses.row}`]: {
            '&:hover': {
              backgroundColor: isDark ? '#0D2137' : '#F8FAFC',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${isDark ? '#1A3F5C' : '#E8EDF2'}`,
          },
          '--DataGrid-overlayHeight': '300px',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      />
    </Card>
  );
};

export default DataGridContainer;
