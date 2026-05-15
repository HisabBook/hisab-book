import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Alert, Stack } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import InventoryPageSkeleton from './components/InventoryPageSkeleton';

import InventoryFilters from './components/InventoryFilters';
import InventoryFormDialog from './components/InventoryFormDialog';
import InventoryTable from './components/InventoryTable';
import { useInventoryFilters } from './hooks/useInventoryFilters';

import {
  selectAllPhones,
  selectAllLaptops,
  selectAllAccessories,
  addPhone,
  updatePhone,
  deletePhone,
  addLaptop,
  updateLaptop,
  deleteLaptop,
  addAccessory,
  updateAccessory,
  deleteAccessory,
} from '../../redux/slices/inventorySlice';

const createNextId = (items, prefix) => {
  const maxNum = items.reduce(
    (max, item) =>
      Math.max(max, Number(String(item.id ?? '').replace(`${prefix}_`, '')) || 0),
    0
  );
  return `${prefix}_${String(maxNum + 1).padStart(3, '0')}`;
};

const itemActionConfig = {
  phones: {
    prefix: 'ph',
    add: addPhone,
    update: updatePhone,
    delete: deletePhone,
  },
  laptops: {
    prefix: 'lp',
    add: addLaptop,
    update: updateLaptop,
    delete: deleteLaptop,
  },
  accessories: {
    prefix: 'acc',
    add: addAccessory,
    update: updateAccessory,
    delete: deleteAccessory,
  },
};

const humanTypeLabel = {
  phones: 'Phone',
  laptops: 'Laptop',
  accessories: 'Accessory',
};

const rowItemTypeToKey = {
  phone: 'phones',
  laptop: 'laptops',
  accessory: 'accessories',
};

const deriveAccessoryStatus = (item) => {
  if (item.quantity <= 0) return 'Out';
  if (item.quantity <= item.lowStockThreshold) return 'Low';
  return 'Available';
};

const InventoryPage = () => {
  const dispatch = useDispatch();

  const [formMeta, setFormMeta] = useState({ open: false, itemType: 'phones', item: null });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const phones = useSelector(selectAllPhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);

  const rows = useMemo(() => {
    const phoneRows = phones.map((item) => ({
      ...item,
      itemType: 'phone',
      displayName: item.model,
      quantity: 1,
      category: '',
      sourceType: 'phones',
    }));

    const laptopRows = laptops.map((item) => ({
      ...item,
      itemType: 'laptop',
      displayName: item.model,
      quantity: 1,
      category: '',
      sourceType: 'laptops',
    }));

    const accessoryRows = accessories.map((item) => ({
      ...item,
      itemType: 'accessory',
      displayName: item.name,
      stockStatus: deriveAccessoryStatus(item),
      sourceType: 'accessories',
    }));

    return [...phoneRows, ...laptopRows, ...accessoryRows];
  }, [phones, laptops, accessories]);

  const {
    filters,
    handleFilterChange,
    handleClearFilters,
    filteredData,
    isFiltering,
    availableBrands,
    availableCategories,
  } = useInventoryFilters(rows);

  const handleOpenForm = (itemType = 'phones', item = null) => {
    setFormMeta({ open: true, itemType, item });
  };

  const handleCloseForm = () => {
    setFormMeta({ open: false, itemType: 'phones', item: null });
  };

  const handleEdit = (row) => {
    const itemType = rowItemTypeToKey[row.itemType] || 'phones';
    handleOpenForm(itemType, row);
  };

  const handleSubmit = (formData) => {
    const config = itemActionConfig[formMeta.itemType];
    const isEditMode = !!formMeta.item;
    const sourceItems =
      formMeta.itemType === 'phones'
        ? phones
        : formMeta.itemType === 'laptops'
          ? laptops
          : accessories;

    const action = isEditMode ? config.update : config.add;
    const payload = isEditMode
      ? formData
      : { ...formData, id: createNextId(sourceItems, config.prefix) };

    dispatch(action(payload));
    setFeedback(`${humanTypeLabel[formMeta.itemType]} ${isEditMode ? 'updated' : 'added'} successfully.`);
    handleCloseForm();
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    const sourceType = rowItemTypeToKey[itemToDelete.itemType];
    if (!sourceType) return;

    dispatch(itemActionConfig[sourceType].delete(itemToDelete.id));
    setFeedback('Item deleted successfully.');
    setItemToDelete(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <InventoryPageSkeleton />;
  }

  return (
    <Stack spacing={2.5}>
      <PageHeader title='Inventory'>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Button size='small' variant='outlined' onClick={() => handleOpenForm('phones')}>
            Add Phone
          </Button>
          <Button size='small' variant='outlined' onClick={() => handleOpenForm('laptops')}>
            Add Laptop
          </Button>
          <Button size='small' variant='outlined' onClick={() => handleOpenForm('accessories')}>
            Add Accessory
          </Button>
        </Box>
        <Button variant='contained' startIcon={<AddRoundedIcon />} onClick={() => handleOpenForm('phones')}>
          Quick Add Phone
        </Button>
      </PageHeader>

      {feedback && (
        <Alert severity='success' onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}

      <InventoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        availableBrands={availableBrands}
        availableCategories={availableCategories}
      />

      <InventoryTable data={filteredData} loading={isFiltering} onEdit={handleEdit} onDelete={handleDelete} />

      <InventoryFormDialog
        open={formMeta.open}
        onClose={handleCloseForm}
        itemType={formMeta.itemType}
        itemData={formMeta.item}
        onSubmit={handleSubmit}
        existingPhones={phones}
        existingLaptops={laptops}
      />

      <ConfirmDialog
        open={!!itemToDelete}
        title='Confirm Deletion'
        message='Are you sure you want to permanently delete this item? This action cannot be undone.'
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
        danger
      />
    </Stack>
  );
};

export default InventoryPage;
