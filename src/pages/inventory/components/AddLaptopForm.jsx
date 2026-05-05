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
import { LAPTOP_BRANDS } from '../../../constants/brands';
import { CONDITIONS, CURRENCIES, STOCK_STATUSES } from '../../../constants/conditions';

const defaultValues = {
  serialNumber: '',
  brand: '',
  model: '',
  cpu: '',
  gpu: '',
  ram: '',
  storage: '',
  storageType: '',
  screenSize: '',
  condition: 'Brand New',
  purchasePrice: '',
  sellPrice: '',
  currency: 'USD',
  stockStatus: 'Available',
  notes: '',
};

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const AddLaptopForm = ({
  mode = 'create',
  initialValues = null,
  existingLaptops = [],
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
  }));
  const [errors, setErrors] = useState({});

  const existingSerialSet = useMemo(() => {
    return new Set(existingLaptops.map((l) => normalize(l.serialNumber)));
  }, [existingLaptops]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.serialNumber.trim()) {
      nextErrors.serialNumber = 'Serial number is required.';
    }

    const originalSerial = normalize(initialValues?.serialNumber);
    const duplicateSerial =
      existingSerialSet.has(normalize(values.serialNumber)) &&
      normalize(values.serialNumber) !== originalSerial;
    if (duplicateSerial) {
      nextErrors.serialNumber = 'This serial number already exists.';
    }

    if (!values.brand.trim()) nextErrors.brand = 'Brand is required.';
    if (!values.model.trim()) nextErrors.model = 'Model is required.';

    const purchasePrice = Number(values.purchasePrice);
    const sellPrice = Number(values.sellPrice);

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
      serialNumber: values.serialNumber.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      cpu: values.cpu.trim(),
      gpu: values.gpu.trim(),
      ram: values.ram.trim(),
      storage: values.storage.trim(),
      storageType: values.storageType.trim(),
      screenSize: values.screenSize.trim(),
      condition: values.condition,
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
      <DialogTitle>{mode === 'edit' ? 'Edit Laptop' : 'Add Laptop'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label='Serial Number'
              name='serialNumber'
              value={values.serialNumber}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.serialNumber)}
              helperText={errors.serialNumber}
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
              {LAPTOP_BRANDS.map((brand) => (
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
            <TextField label='CPU' name='cpu' value={values.cpu} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='GPU' name='gpu' value={values.gpu} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='RAM' name='ram' value={values.ram} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Storage' name='storage' value={values.storage} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Storage Type' name='storageType' value={values.storageType} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label='Screen Size' name='screenSize' value={values.screenSize} onChange={handleChange} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label='Condition' name='condition' value={values.condition} onChange={handleChange} fullWidth>
              {CONDITIONS.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label='Stock Status' name='stockStatus' value={values.stockStatus} onChange={handleChange} fullWidth>
              {STOCK_STATUSES.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField label='Notes' name='notes' value={values.notes} onChange={handleChange} fullWidth multiline minRows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type='submit' variant='contained'>
          {mode === 'edit' ? 'Save Changes' : 'Add Laptop'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddLaptopForm;
