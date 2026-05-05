import { useMemo, useState } from 'react';
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
import { PHONE_BRANDS } from '../../../constants/brands';
import { CONDITIONS, CURRENCIES, STOCK_STATUSES } from '../../../constants/conditions';

const defaultValues = {
  imei: '',
  brand: '',
  model: '',
  color: '',
  ram: '',
  rom: '',
  condition: 'Brand New',
  batteryHealth: 100,
  purchasePrice: '',
  sellPrice: '',
  currency: 'USD',
  stockStatus: 'Available',
  notes: '',
};

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const AddPhoneForm = ({
  mode = 'create',
  initialValues = null,
  existingPhones = [],
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState(() => ({
    ...defaultValues,
    ...(initialValues ?? {}),
    purchasePrice:
      initialValues?.purchasePrice !== undefined
        ? String(initialValues.purchasePrice)
        : '',
    sellPrice:
      initialValues?.sellPrice !== undefined
        ? String(initialValues.sellPrice)
        : '',
    batteryHealth:
      initialValues?.batteryHealth !== undefined
        ? String(initialValues.batteryHealth)
        : '100',
  }));

  const [errors, setErrors] = useState({});

  const existingImeiSet = useMemo(() => {
    return new Set(existingPhones.map((p) => normalize(p.imei)));
  }, [existingPhones]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const imei = values.imei.trim();

    if (!imei) nextErrors.imei = 'IMEI is required.';
    if (imei && !/^\d{15}$/.test(imei)) {
      nextErrors.imei = 'IMEI must be exactly 15 digits.';
    }

    const originalImei = normalize(initialValues?.imei);
    const isDuplicate =
      existingImeiSet.has(normalize(imei)) && normalize(imei) !== originalImei;
    if (imei && isDuplicate) {
      nextErrors.imei = 'This IMEI already exists.';
    }

    if (!values.brand.trim()) nextErrors.brand = 'Brand is required.';
    if (!values.model.trim()) nextErrors.model = 'Model is required.';

    const purchasePrice = Number(values.purchasePrice);
    const sellPrice = Number(values.sellPrice);
    const batteryHealth = Number(values.batteryHealth);

    if (values.purchasePrice === '' || Number.isNaN(purchasePrice) || purchasePrice < 0) {
      nextErrors.purchasePrice = 'Purchase price must be a non-negative number.';
    }

    if (values.sellPrice === '' || Number.isNaN(sellPrice) || sellPrice < 0) {
      nextErrors.sellPrice = 'Sell price must be a non-negative number.';
    }

    if (values.batteryHealth === '' || Number.isNaN(batteryHealth) || batteryHealth < 0 || batteryHealth > 100) {
      nextErrors.batteryHealth = 'Battery health must be between 0 and 100.';
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
      imei: values.imei.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      color: values.color.trim(),
      ram: values.ram.trim(),
      rom: values.rom.trim(),
      condition: values.condition,
      batteryHealth: Number(values.batteryHealth),
      purchasePrice: Number(values.purchasePrice),
      sellPrice: Number(values.sellPrice),
      currency: values.currency,
      stockStatus: values.stockStatus,
      notes: values.notes.trim(),
      dateAdded: initialValues?.dateAdded ?? today,
      createdAt: initialValues?.createdAt ?? nowIso,
      updatedAt: nowIso,
    });
  };

  return (
    <Box component='form' onSubmit={handleSubmit} noValidate>
      <DialogTitle>{mode === 'edit' ? 'Edit Phone' : 'Add Phone'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='IMEI'
              name='imei'
              value={values.imei}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.imei)}
              helperText={errors.imei}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label='Brand'
              name='brand'
              value={values.brand}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.brand)}
              helperText={errors.brand}
            >
              {PHONE_BRANDS.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Model' name='model' value={values.model} onChange={handleChange} fullWidth required error={Boolean(errors.model)} helperText={errors.model} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Color' name='color' value={values.color} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='RAM' name='ram' value={values.ram} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='ROM' name='rom' value={values.rom} onChange={handleChange} fullWidth />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label='Condition'
              name='condition'
              value={values.condition}
              onChange={handleChange}
              fullWidth
            >
              {CONDITIONS.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='Battery Health %'
              name='batteryHealth'
              type='number'
              value={values.batteryHealth}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.batteryHealth)}
              helperText={errors.batteryHealth}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='Purchase Price'
              name='purchasePrice'
              type='number'
              value={values.purchasePrice}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.purchasePrice)}
              helperText={errors.purchasePrice}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='Sell Price'
              name='sellPrice'
              type='number'
              value={values.sellPrice}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.sellPrice)}
              helperText={errors.sellPrice}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label='Currency' name='currency' value={values.currency} onChange={handleChange} fullWidth>
              {CURRENCIES.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label='Stock Status'
              name='stockStatus'
              value={values.stockStatus}
              onChange={handleChange}
              fullWidth
            >
              {STOCK_STATUSES.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label='Notes'
              name='notes'
              value={values.notes}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type='submit' variant='contained'>
          {mode === 'edit' ? 'Save Changes' : 'Add Phone'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddPhoneForm;
