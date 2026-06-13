import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import { EXPENSE_CATEGORIES } from '../../../constants/categories';
import { CURRENCIES } from '../../../constants/conditions';

const ExpenseFilters = ({ filters, onFilterChange, onClear }) => {
  const { t } = useTranslation();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== '');

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr) auto',
        },
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      <TextField
        fullWidth
        size='small'
        label={t('roznamcha.filters.startDate')}
        name='startDate'
        type='date'
        value={filters.startDate}
        onChange={handleInputChange}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        fullWidth
        size='small'
        label={t('roznamcha.filters.endDate')}
        name='endDate'
        type='date'
        value={filters.endDate}
        onChange={handleInputChange}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        select
        fullWidth
        size='small'
        label={t('common.category')}
        name='category'
        value={filters.category}
        onChange={handleInputChange}
        SelectProps={{ displayEmpty: true }}
        renderValue={(selected) => selected || t('common.all')}
      >
        <MenuItem value=''>{t('common.all')}</MenuItem>
        {EXPENSE_CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        size='small'
        label={t('common.currency')}
        name='currency'
        value={filters.currency}
        onChange={handleInputChange}
        SelectProps={{ displayEmpty: true }}
        renderValue={(selected) => selected || t('common.all')}
      >
        <MenuItem value=''>{t('common.all')}</MenuItem>
        {CURRENCIES.map((cur) => (
          <MenuItem key={cur} value={cur}>
            {cur}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant='text'
        color='secondary'
        disabled={!hasActiveFilters}
        onClick={onClear}
        startIcon={<ClearAllRoundedIcon />}
        sx={{ justifySelf: 'start' }}
      >
        {t('common.clear')}
      </Button>
    </Box>
  );
};

export default ExpenseFilters;
