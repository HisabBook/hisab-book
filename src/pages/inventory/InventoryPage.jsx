import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Tab, Tabs, Alert, Stack } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

// UI & Layout Components
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import InventoryPageSkeleton from './components/InventoryPageSkeleton';

// Page-specific Components & Hooks
import InventoryFilters from './components/InventoryFilters';
import InventoryFormDialog from './components/InventoryFormDialog';
import PhonesTable from './components/PhonesTable';
import LaptopsTable from './components/LaptopsTable';
import AccessoriesTable from './components/AccessoriesTable';
import { useInventoryFilters } from './hooks/useInventoryFilters';

// Redux State & Actions
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
      Math.max(
        max,
        Number(String(item.id ?? '').replace(`${prefix}_`, '')) || 0
      ),
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

const tableComponents = {
  phones: PhonesTable,
  laptops: LaptopsTable,
  accessories: AccessoriesTable,
};

const InventoryPage = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('phones');
  const [formMeta, setFormMeta] = useState({ open: false, item: null });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Selection ---
  const phones = useSelector(selectAllPhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);

  const currentData = useMemo(() => {
    if (activeTab === 'laptops') return laptops;
    if (activeTab === 'accessories') return accessories;
    return phones;
  }, [activeTab, phones, laptops, accessories]);

  const {
    filters,
    handleFilterChange,
    handleClearFilters,
    filteredData,
    isFiltering,
    availableBrands,
    availableCategories,
  } = useInventoryFilters(currentData, activeTab);

  // --- Handlers ---
  const handleTabChange = (_, value) => {
    setActiveTab(value);
    handleClearFilters();
  };

  const handleOpenForm = (item = null) => setFormMeta({ open: true, item });
  const handleCloseForm = () => setFormMeta({ open: false, item: null });

  const handleSubmit = (formData) => {
    const config = itemActionConfig[activeTab];
    const isEditMode = !!formMeta.item;
    const action = isEditMode ? config.update : config.add;
    const payload = isEditMode
      ? formData
      : { ...formData, id: createNextId(currentData, config.prefix) };
    dispatch(action(payload));
    setFeedback(`Item ${isEditMode ? 'updated' : 'added'} successfully.`);
    handleCloseForm();
  };

  const handleDelete = (item) => {
    setItemToDelete({ ...item, type: activeTab });
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    const config = itemActionConfig[itemToDelete.type];
    dispatch(config.delete(itemToDelete.id));
    setFeedback('Item deleted successfully.');
    setItemToDelete(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const CurrentTable = tableComponents[activeTab];

  if (isLoading) {
    return <InventoryPageSkeleton />;
  }

  return (
    <Stack spacing={2.5}>
      <PageHeader title='Inventory'>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab value='phones' label={`Phones (${phones.length})`} />
            <Tab value='laptops' label={`Laptops (${laptops.length})`} />
            <Tab
              value='accessories'
              label={`Accessories (${accessories.length})`}
            />
          </Tabs>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddRoundedIcon />}
          onClick={() => handleOpenForm()}
        >
          Add {activeTab.slice(0, -1)}
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
        activeTab={activeTab}
      />

      <CurrentTable
        data={filteredData}
        loading={isFiltering}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
      />

      <InventoryFormDialog
        open={formMeta.open}
        onClose={handleCloseForm}
        itemType={activeTab}
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
