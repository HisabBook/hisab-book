import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Alert } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { nanoid } from '@reduxjs/toolkit';

import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
  selectAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../../redux/slices/roznamchaSlice';

import ExpenseFormDialog from './components/ExpenseFormDialog';
import ExpenseTable from './components/ExpenseTable';
import ExpenseSummaryCards from './components/ExpenseSummaryCards';
import ExpenseFilters from './components/ExpenseFilters';
import { useExpenseFilters } from './hooks/useExpenseFilters';

const RoznamchaPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // --- Local State Management
  const [formMeta, setFormMeta] = useState({ open: false, data: null });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');

  // --- Redux Data & Filtering
  const allExpenses = useSelector(selectAllExpenses);
  const {
    filters,
    handleFilterChange,
    handleClearFilters,
    filteredData,
    isFiltering,
  } = useExpenseFilters(allExpenses);

  // --- Handlers
  const handleOpenForm = (data = null) => setFormMeta({ open: true, data });
  const handleCloseForm = () => setFormMeta({ open: false, data: null });

  const handleSubmit = (formData) => {
    const isEditMode = !!formMeta.data;
    if (isEditMode) {
      dispatch(
        updateExpense({ ...formData, updatedAt: new Date().toISOString() })
      );
      setFeedback(t('roznamcha.feedback.updated'));
    } else {
      const now = new Date().toISOString();
      dispatch(
        addExpense({
          ...formData,
          id: `exp_${nanoid()}`,
          createdAt: now,
          updatedAt: now,
        })
      );
      setFeedback(t('roznamcha.feedback.added'));
    }
    handleCloseForm();
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    dispatch(deleteExpense(itemToDelete.id));
    setFeedback(t('roznamcha.feedback.deleted'));
    setItemToDelete(null);
  };

  return (
    <>
      <Stack spacing={3}>
        <PageHeader title={t('roznamcha.title')}>
          <Button
            variant='contained'
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={() => handleOpenForm()}
          >
            {t('roznamcha.addExpense')}
          </Button>
        </PageHeader>

        {feedback && (
          <Alert severity='success' onClose={() => setFeedback('')}>
            {feedback}
          </Alert>
        )}

        {/* Summary Cards and Filters */}
        <ExpenseSummaryCards expenses={filteredData} />
        <ExpenseFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* Data Table */}
        <ExpenseTable
          data={filteredData}
          loading={isFiltering}
          onEdit={handleOpenForm}
          onDelete={setItemToDelete}
        />
      </Stack>

      {/* Dialogs */}
      <ExpenseFormDialog
        open={formMeta.open}
        initialData={formMeta.data}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!itemToDelete}
        title={t('roznamcha.delete.title')}
        message={t('roznamcha.delete.message')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
        danger
      />
    </>
  );
};

export default RoznamchaPage;
