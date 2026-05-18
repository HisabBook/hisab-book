import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { STOCK_STATUSES } from '../../../constants/conditions';

const InventoryFilters = ({
  filters,
  onFilterChange,
  onClear,
  availableBrands,
  availableCategories,
  activeTab,
}) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  const showStatusFilter = activeTab === 'phones' || activeTab === 'laptops';
  const showCategoryFilter = activeTab === 'accessories';
  const hasActiveFilters =
    !!filters.search ||
    !!filters.brand ||
    !!filters.category ||
    !!filters.status ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    !!filters.startDate ||
    !!filters.endDate;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr repeat(7, minmax(110px, 1fr))' },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          size='small'
          label='Search by IMEI, Model, Name...'
          name='search'
          value={filters.search}
          onChange={handleInputChange}
          sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchRoundedIcon fontSize='small' />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          fullWidth
          size='small'
          label='Brand'
          name='brand'
          value={filters.brand}
          onChange={handleInputChange}
          sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
          slotProps={{
            inputLabel: { shrink: true },
            select: {
              displayEmpty: true,
              renderValue: (selected) => selected || 'All Brands',
            },
          }}
        >
          <MenuItem value=''>
            <Typography variant='body2' color='text.secondary'>
              All Brands
            </Typography>
          </MenuItem>
          {availableBrands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </TextField>

        {showStatusFilter && (
          <TextField
            select
            fullWidth
            size='small'
            label='Stock Status'
            name='status'
            value={filters.status}
            onChange={handleInputChange}
            sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
            slotProps={{
              inputLabel: { shrink: true },
              select: {
                displayEmpty: true,
                renderValue: (selected) => selected || 'All Statuses',
              },
            }}
          >
            <MenuItem value=''>
              <Typography variant='body2' color='text.secondary'>
                All Statuses
              </Typography>
            </MenuItem>
            {STOCK_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        )}

        {showCategoryFilter && (
          <TextField
            select
            fullWidth
            size='small'
            label='Category'
            name='category'
            value={filters.category}
            onChange={handleInputChange}
            sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
            slotProps={{
              inputLabel: { shrink: true },
              select: {
                displayEmpty: true,
                renderValue: (selected) => selected || 'All Categories',
              },
            }}
          >
            <MenuItem value=''>
              <Typography variant='body2' color='text.secondary'>
                All Categories
              </Typography>
            </MenuItem>
            {availableCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          fullWidth
          size='small'
          label='Min Price'
          name='minPrice'
          type='number'
          value={filters.minPrice}
          onChange={handleInputChange}
          sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
        />

        <TextField
          fullWidth
          size='small'
          label='Max Price'
          name='maxPrice'
          type='number'
          value={filters.maxPrice}
          onChange={handleInputChange}
          sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
        />

        <TextField
          fullWidth
          size='small'
          label='From Date Added'
          name='startDate'
          type='date'
          value={filters.startDate}
          onChange={handleInputChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{
            gridColumn: { xs: '1 / -1', md: 'auto' },
            '& .MuiInputLabel-root': {
              transform: 'translate(14px, -9px) scale(0.75) !important',
            },
            '& .MuiInputBase-input': {
              colorScheme: (theme) => theme.palette.mode,
              '&::-webkit-calendar-picker-indicator': {
                filter: (theme) =>
                  theme.palette.mode === 'dark' ? 'invert(0.8)' : 'none',
              },
            },
          }}
        />

        <TextField
          fullWidth
          size='small'
          label='To Date Added'
          name='endDate'
          type='date'
          value={filters.endDate}
          onChange={handleInputChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{
            gridColumn: { xs: '1 / -1', md: 'auto' },
            '& .MuiInputLabel-root': {
              transform: 'translate(14px, -9px) scale(0.75) !important',
            },
            '& .MuiInputBase-input': {
              colorScheme: (theme) => theme.palette.mode,
              '&::-webkit-calendar-picker-indicator': {
                filter: (theme) =>
                  theme.palette.mode === 'dark' ? 'invert(0.8)' : 'none',
              },
            },
          }}
        />

        <Button
          variant='text'
          color='secondary'
          disabled={!hasActiveFilters}
          onClick={onClear}
          startIcon={<ClearAllRoundedIcon />}
          sx={{
            color: 'text.secondary',
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'center', md: 'flex-start' },
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryFilters;
