import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { EXPENSE_CATEGORIES, CURRENCIES } from '../../../constants/conditions';

const defaultValues = {
  description: '',
  category: 'Other',
  amount: '',
  currency: 'AFN',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

const ExpenseFormDialog = ({ open, initialData, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(
      initialData ? { ...defaultValues, ...initialData } : defaultValues
    );
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors = {};
    if (!values.description.trim())
      newErrors.description = t('roznamcha.errors.descRequired');
    const amount = Number(values.amount);
    if (!values.amount || isNaN(amount) || amount <= 0)
      newErrors.amount = t('roznamcha.errors.amountInvalid');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...values, amount: Number(values.amount) });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      component='form'
      onSubmit={handleSubmit}
    >
      <DialogTitle>
        {initialData ? t('roznamcha.editExpense') : t('roznamcha.addExpense')}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label={t('common.description')}
              name='description'
              value={values.description}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t('common.category')}
              name='category'
              value={values.category}
              onChange={handleChange}
              fullWidth
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('common.date')}
              name='date'
              type='date'
              value={values.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('common.amount')}
              name='amount'
              type='number'
              value={values.amount}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t('common.currency')}
              name='currency'
              value={values.currency}
              onChange={handleChange}
              fullWidth
            >
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t('common.notes')}
              name='notes'
              value={values.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button type='submit' variant='contained'>
          {initialData ? t('common.save') : t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseFormDialog;
