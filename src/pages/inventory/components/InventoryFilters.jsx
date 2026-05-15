import { Box, Button, MenuItem, TextField, InputAdornment, Typography } from '@mui/material';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const STOCK_FILTER_OPTIONS = ['Available', 'Sold', 'Low', 'Out'];

const InventoryFilters = ({
  filters,
  onFilterChange,
  onClear,
  availableBrands,
  availableCategories,
}) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <TextField
          size='small'
          label='Search'
          name='search'
          value={filters.search}
          onChange={handleInputChange}
          sx={{ minWidth: 240, flex: '1 1 240px' }}
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
          size='small'
          label='Brand'
          name='brand'
          value={filters.brand}
          onChange={handleInputChange}
          sx={{ minWidth: 140 }}
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

        <TextField
          select
          size='small'
          label='Stock Status'
          name='status'
          value={filters.status}
          onChange={handleInputChange}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value=''>
            <Typography variant='body2' color='text.secondary'>
              All Statuses
            </Typography>
          </MenuItem>
          {STOCK_FILTER_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size='small'
          label='Category'
          name='category'
          value={filters.category}
          onChange={handleInputChange}
          sx={{ minWidth: 150 }}
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

        <TextField
          size='small'
          label='Min Price'
          name='minPrice'
          type='number'
          value={filters.minPrice}
          onChange={handleInputChange}
          sx={{ width: 120 }}
        />
        <TextField
          size='small'
          label='Max Price'
          name='maxPrice'
          type='number'
          value={filters.maxPrice}
          onChange={handleInputChange}
          sx={{ width: 120 }}
        />

        <TextField
          size='small'
          label='From Date Added'
          name='startDate'
          type='date'
          value={filters.startDate}
          onChange={handleInputChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size='small'
          label='To Date Added'
          name='endDate'
          type='date'
          value={filters.endDate}
          onChange={handleInputChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />

        <Button
          variant='text'
          color='secondary'
          disabled={!hasActiveFilters}
          onClick={onClear}
          startIcon={<ClearAllRoundedIcon />}
          sx={{ ml: 'auto', color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryFilters;
