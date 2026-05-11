// src/pages/inventory/components/InventoryFilters.jsx
// --- CORRECTED AND REFINED FOR LAYOUT ---

import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
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

  // Conditionally render filters based on the active tab for better UX
  const showStatusFilter = activeTab === 'phones' || activeTab === 'laptops';
  const showCategoryFilter = activeTab === 'accessories';
  const hasActiveFilters =
    !!filters.brand || !!filters.category || !!filters.status;

  return (
    // The main container for the filter bar
    <Box sx={{ mb: 2.5 }}>
      {/* Outer Grid to separate filters from the clear button */}
      <Grid
        container
        spacing={2}
        justifyContent='space-between'
        alignItems='center'
      >
        {/* Left side Grid Item containing all the filters */}
        <Grid item xs>
          <Grid container spacing={2}>
            {/* Brand Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                size='small'
                label='Brand'
                name='brand'
                value={filters.brand}
                onChange={handleInputChange}
                // Add a minimum width to prevent squashing on resize
                sx={{ minWidth: 160 }}
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

            {/* Category Filter (Accessories only) */}
            {showCategoryFilter && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Category'
                  name='category'
                  value={filters.category}
                  onChange={handleInputChange}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value=''>
                    <Typography variant='body2' color='text.secondary'>
                      All Categories
                    </Typography>
                  </MenuItem>
                  {availableCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Status Filter (Phones/Laptops only) */}
            {showStatusFilter && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Stock Status'
                  name='status'
                  value={filters.status}
                  onChange={handleInputChange}
                  sx={{ minWidth: 160 }}
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
          </Grid>
        </Grid>

        {/* Right side Grid Item for the clear button */}
        <Grid item xs='auto'>
          <Button
            variant='text'
            color='secondary'
            size='medium'
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
