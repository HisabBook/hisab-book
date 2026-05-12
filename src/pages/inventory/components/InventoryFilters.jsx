import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
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
        {/* --- ROW 1: Search and Main Dropdowns --- */}
        <Grid item xs={12} md={4}>
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
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md>
          <TextField
            select
            fullWidth
            size='small'
            label='Brand'
            name='brand'
            value={filters.brand}
            onChange={handleInputChange}
          >
            <MenuItem value=''>All Brands</MenuItem>
            {availableBrands.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {showCategoryFilter && (
          <Grid item xs={12} sm={6} md>
            <TextField
              select
              fullWidth
              size='small'
              label='Category'
              name='category'
              value={filters.category}
              onChange={handleInputChange}
            >
              <MenuItem value=''>All Categories</MenuItem>
              {availableCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        {showStatusFilter && (
          <Grid item xs={12} sm={6} md>
            <TextField
              select
              fullWidth
              size='small'
              label='Stock Status'
              name='status'
              value={filters.status}
              onChange={handleInputChange}
            >
              <MenuItem value=''>All Statuses</MenuItem>
              {STOCK_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {/* --- ROW 2: Price and Date Ranges --- */}
        <Grid item xs={6} sm={3} md>
          <TextField
            fullWidth
            size='small'
            label='Min Price'
            name='minPrice'
            type='number'
            value={filters.minPrice}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6} sm={3} md>
          <TextField
            fullWidth
            size='small'
            label='Max Price'
            name='maxPrice'
            type='number'
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6} sm={3} md>
          <TextField
            fullWidth
            size='small'
            label='From Date'
            name='startDate'
            type='date'
            value={filters.startDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md>
          <TextField
            fullWidth
            size='small'
            label='To Date'
            name='endDate'
            type='date'
            value={filters.endDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* --- Clear Button --- */}
        <Grid item>
          <Button
            variant='text'
            disabled={!hasActiveFilters}
            onClick={onClear}
            startIcon={<ClearAllRoundedIcon />}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryFilters;
