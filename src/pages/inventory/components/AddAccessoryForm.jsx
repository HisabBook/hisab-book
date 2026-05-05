import { useState } from 'react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { ACCESSORY_CATEGORIES } from '../../../constants/categories';
import { CURRENCIES } from '../../../constants/conditions';

const defaultValues = {
  name: '',
  category: 'Case',
  brand: '',
  compatibleWith: '',
  quantity: '',
  lowStockThreshold: '',
  purchasePrice: '',
  sellPrice: '',
  currency: 'USD',
};

const AddAccessoryForm = ({ mode = 'create', initialValues = null, onSubmit, onCancel }) => {
  const [values, setValues] = useState(() => ({
    ...defaultValues,
    ...(initialValues ?? {}),
    quantity:
      initialValues?.quantity !== undefined ? String(initialValues.quantity) : '',
    lowStockThreshold:
      initialValues?.lowStockThreshold !== undefined
        ? String(initialValues.lowStockThreshold)
        : '',
    purchasePrice:
      initialValues?.purchasePrice !== undefined
        ? String(initialValues.purchasePrice)
        : '',
    sellPrice:
      initialValues?.sellPrice !== undefined ? String(initialValues.sellPrice) : '',
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.category.trim()) nextErrors.category = 'Category is required.';

    const quantity = Number(values.quantity);
    const threshold = Number(values.lowStockThreshold);
    const purchasePrice = Number(values.purchasePrice);
    const sellPrice = Number(values.sellPrice);

    if (values.quantity === '' || Number.isNaN(quantity) || quantity < 0) {
      nextErrors.quantity = 'Quantity must be a non-negative number.';
    }
    if (
      values.lowStockThreshold === '' ||
      Number.isNaN(threshold) ||
      threshold < 0
    ) {
      nextErrors.lowStockThreshold =
        'Low stock threshold must be a non-negative number.';
    }
    if (values.purchasePrice === '' || Number.isNaN(purchasePrice) || purchasePrice < 0) {
      nextErrors.purchasePrice = 'Purchase price must be a non-negative number.';
    }
    if (values.sellPrice === '' || Number.isNaN(sellPrice) || sellPrice < 0) {
      nextErrors.sellPrice = 'Sell price must be a non-negative number.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const nowIso = new Date().toISOString();
    const today = nowIso.slice(0, 10);

    onSubmit({
      ...(initialValues ?? {}),
      name: values.name.trim(),
      category: values.category,
      brand: values.brand.trim(),
      compatibleWith: values.compatibleWith.trim(),
      quantity: Number(values.quantity),
      lowStockThreshold: Number(values.lowStockThreshold),
      purchasePrice: Number(values.purchasePrice),
      sellPrice: Number(values.sellPrice),
      currency: values.currency,
      dateAdded: initialValues?.dateAdded ?? today,
      createdAt: initialValues?.createdAt ?? nowIso,
      updatedAt: nowIso,
    });
  };

  return (
    <Box component='form' onSubmit={handleSubmit} noValidate>
      <DialogTitle>{mode === 'edit' ? 'Edit Accessory' : 'Add Accessory'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Name' name='name' value={values.name} onChange={handleChange} fullWidth required error={Boolean(errors.name)} helperText={errors.name} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label='Category' name='category' value={values.category} onChange={handleChange} fullWidth required error={Boolean(errors.category)} helperText={errors.category}>
              {ACCESSORY_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Brand' name='brand' value={values.brand} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Compatible With' name='compatibleWith' value={values.compatibleWith} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Quantity' name='quantity' type='number' value={values.quantity} onChange={handleChange} fullWidth required error={Boolean(errors.quantity)} helperText={errors.quantity} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Low Stock Threshold' name='lowStockThreshold' type='number' value={values.lowStockThreshold} onChange={handleChange} fullWidth required error={Boolean(errors.lowStockThreshold)} helperText={errors.lowStockThreshold} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Purchase Price' name='purchasePrice' type='number' value={values.purchasePrice} onChange={handleChange} fullWidth required error={Boolean(errors.purchasePrice)} helperText={errors.purchasePrice} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Sell Price' name='sellPrice' type='number' value={values.sellPrice} onChange={handleChange} fullWidth required error={Boolean(errors.sellPrice)} helperText={errors.sellPrice} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label='Currency' name='currency' value={values.currency} onChange={handleChange} fullWidth>
              {CURRENCIES.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type='submit' variant='contained'>
          {mode === 'edit' ? 'Save Changes' : 'Add Accessory'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddAccessoryForm;
