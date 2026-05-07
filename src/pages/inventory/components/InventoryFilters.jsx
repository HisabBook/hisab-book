import { Box, Stack, TextField, MenuItem, Button, IconButton, Tooltip } from '@mui/material';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';

const InventoryFilters = ({ filters, setFilters, categories, brands, statuses, types, onClear }) => {
  
  const handleChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2, mb: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        
        {/* Item Type Filter */}
        <TextField
          select
          fullWidth
          label="Item Type"
          size="small"
          value={filters.itemType}
          onChange={handleChange('itemType')}
        >
          <MenuItem value="all">All Types</MenuItem>
          {types.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>

        {/* Category Filter */}
        <TextField
          select
          fullWidth
          label="Category"
          size="small"
          value={filters.category}
          onChange={handleChange('category')}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        {/* Brand Filter */}
        <TextField
          select
          fullWidth
          label="Brand"
          size="small"
          value={filters.brand}
          onChange={handleChange('brand')}
        >
          <MenuItem value="all">All Brands</MenuItem>
          {brands.map((b) => (
            <MenuItem key={b} value={b}>{b}</MenuItem>
          ))}
        </TextField>

        {/* Stock Status Filter */}
        <TextField
          select
          fullWidth
          label="Status"
          size="small"
          value={filters.status}
          onChange={handleChange('status')}
        >
          <MenuItem value="all">All Status</MenuItem>
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        {/* Clear Action */}
        <Tooltip title="Clear All Filters">
          <IconButton color="error" onClick={onClear}>
            <FilterAltOffRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default InventoryFilters;