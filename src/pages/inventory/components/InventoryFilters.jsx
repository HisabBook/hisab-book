import {
  Box,
  Button,
  Grid,
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
      <Grid container spacing={2} alignItems='center'>
        {/* Search, Brand, and other filters remain the same... */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size='small'
            label='Search by IMEI, Model, Name...'
            name='search'
            value={filters.search}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchRoundedIcon fontSize='small' />
                </InputAdornment>
              ),
              sx: {
                '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
                  {
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: (theme) => theme.palette.text.primary,
                    transition: 'background-color 5000s ease-in-out 0s',
                    boxShadow: 'none',
                  },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md='auto'>
          <TextField
            select
            size='small'
            label='Brand'
            name='brand'
            value={filters.brand}
            onChange={handleInputChange}
            sx={{ minWidth: 140 }}
            displayEmpty
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
        </Grid>

        {showStatusFilter && (
          <Grid item xs={12} sm={4} md='auto'>
            <TextField
              select
              size='small'
              label='Stock Status'
              name='status'
              value={filters.status}
              onChange={handleInputChange}
              sx={{ minWidth: 140 }}
              displayEmpty
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
          </Grid>
        )}

        <Grid item xs={6} sm='auto'>
          <TextField
            size='small'
            label='Min Price'
            name='minPrice'
            type='number'
            value={filters.minPrice}
            onChange={handleInputChange}
            sx={{ width: 110 }}
          />
        </Grid>
        <Grid item xs={6} sm='auto'>
          <TextField
            size='small'
            label='Max Price'
            name='maxPrice'
            type='number'
            value={filters.maxPrice}
            onChange={handleInputChange}
            sx={{ width: 110 }}
          />
        </Grid>

        {/* --- START OF THE FORCEFUL FIX --- */}
        <Grid item xs={6} sm='auto'>
          <TextField
            size='small'
            label='From Date Added'
            name='startDate'
            type='date'
            value={filters.startDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }} // Keep this for semantic correctness
            sx={{
              minWidth: 150,
              // This targets the label of THIS specific text field
              '& .MuiInputLabel-root': {
                // This is the transform for a shrunken "small" label.
                // We add !important to ensure it overrides any other style.
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
        </Grid>
        <Grid item xs={6} sm='auto'>
          <TextField
            size='small'
            label='To Date Added'
            name='endDate'
            type='date'
            value={filters.endDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }} // Keep this for semantic correctness
            sx={{
              minWidth: 150,
              // This targets the label of THIS specific text field
              '& .MuiInputLabel-root': {
                // This is the transform for a shrunken "small" label.
                // We add !important to ensure it overrides any other style.
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
        </Grid>
        {/* --- END OF THE FORCEFUL FIX --- */}

        <Grid item xs md='auto' sx={{ ml: 'auto' }}>
          <Button
            variant='text'
            color='secondary'
            disabled={!hasActiveFilters}
            onClick={onClear}
            startIcon={<ClearAllRoundedIcon />}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryFilters;
