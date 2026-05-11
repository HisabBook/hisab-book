import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  Tab,
  Tabs,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Typography,
  Card,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

// --- (All other imports remain the same) ---
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAppStatus } from '../../hooks/useAppStatus';
import AddPhoneForm from './components/AddPhoneForm.jsx';
import AddLaptopForm from './components/AddLaptopForm.jsx';
import AddAccessoryForm from './components/AddAccessoryForm.jsx';
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
import InventoryFilters from './components/InventoryFilters';

// --- (Helper functions like createNextId and itemTypeConfig remain the same) ---
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

const itemTypeConfig = {
  phones: {
    prefix: 'ph',
    add: addPhone,
    update: updatePhone,
    delete: deletePhone,
    dataSelector: selectAllPhones,
    FormComponent: AddPhoneForm,
  },
  laptops: {
    prefix: 'lp',
    add: addLaptop,
    update: updateLaptop,
    delete: deleteLaptop,
    dataSelector: selectAllLaptops,
    FormComponent: AddLaptopForm,
  },
  accessories: {
    prefix: 'acc',
    add: addAccessory,
    update: updateAccessory,
    delete: deleteAccessory,
    dataSelector: selectAllAccessories,
    FormComponent: AddAccessoryForm,
  },
};

const CustomNoRowsOverlay = () => (
  <EmptyState
    message='No Items Found'
    details='Filter criteria may be too restrictive or no items have been added.'
  />
);

// --- MAIN COMPONENT ---
const InventoryPage = () => {
  const dispatch = useDispatch();
  const { isRtl, isDark } = useAppStatus();

  const [activeTab, setActiveTab] = useState('phones');
  const [formMeta, setFormMeta] = useState({ open: false, item: null });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    status: 'all',
  });

  const phones = useSelector(selectAllPhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);

  const categories = useMemo(
    () => [...new Set(accessories.map((a) => a.category))],
    [accessories]
  );
  const brands = useMemo(() => {
    const allBrands = [
      ...phones.map((p) => p.brand),
      ...laptops.map((l) => l.brand),
    ];
    return [...new Set(allBrands)];
  }, [phones, laptops]);
  const statuses = ['Available', 'Sold'];

  const filteredData = useMemo(() => {
    let sourceData;
    if (activeTab === 'laptops') sourceData = laptops;
    else if (activeTab === 'accessories') sourceData = accessories;
    else sourceData = phones;

    if (!sourceData) return [];

    return sourceData.filter((item) => {
      const brandMatch =
        filters.brand === 'all' || !item.brand || item.brand === filters.brand;
      const statusMatch =
        filters.status === 'all' ||
        !item.stockStatus ||
        item.stockStatus === filters.status;
      const categoryMatch =
        filters.category === 'all' ||
        !item.category ||
        item.category === filters.category;

      switch (activeTab) {
        case 'phones':
        case 'laptops':
          return brandMatch && statusMatch;
        case 'accessories':
          return categoryMatch;
        default:
          return true;
      }
    });
  }, [activeTab, phones, laptops, accessories, filters]);

  const handleClearFilters = () => {
    setFilters({ category: 'all', brand: 'all', status: 'all' });
  };

  const handleOpenForm = (item = null) => setFormMeta({ open: true, item });
  const handleCloseForm = () => setFormMeta({ open: false, item: null });

  const handleSubmit = (formData) => {
    const config = itemTypeConfig[activeTab];
    const isEditMode = !!formMeta.item;
    const action = isEditMode ? config.update : config.add;

    let fullDataSet;
    if (activeTab === 'laptops') fullDataSet = laptops;
    else if (activeTab === 'accessories') fullDataSet = accessories;
    else fullDataSet = phones;

    const payload = isEditMode
      ? formData
      : { ...formData, id: createNextId(fullDataSet, config.prefix) };

    dispatch(action(payload));
    setFeedback(`Item ${isEditMode ? 'updated' : 'added'} successfully.`);
    handleCloseForm();
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    const config = itemTypeConfig[itemToDelete.type];
    dispatch(config.delete(itemToDelete.id));
    setFeedback(`Item deleted successfully.`);
    setItemToDelete(null);
  };

  const columns = useMemo(() => {
    const baseActionColumn = {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={() => handleOpenForm(row)}>
              <EditRoundedIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              color='error'
              onClick={() => setItemToDelete({ ...row, type: activeTab })}
            >
              <DeleteOutlineRoundedIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    };

    const commonColumns = [
      { field: 'brand', headerName: 'Brand', width: 140 },
      {
        field: 'sellPrice',
        headerName: 'Sell Price',
        width: 140,
        renderCell: ({ value, row }) => (
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {row.currency === 'AFN' ? 'AFN ' : '$'}
            {Number(value).toLocaleString()}
          </Typography>
        ),
      },
    ];

    switch (activeTab) {
      case 'phones':
        return [
          { field: 'imei', headerName: 'IMEI', width: 160 },
          { field: 'model', headerName: 'Model', flex: 1, minWidth: 200 },
          ...commonColumns,
          {
            field: 'stockStatus',
            headerName: 'Status',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => <StatusBadge status={value} />,
          },
          baseActionColumn,
        ];
      case 'laptops':
        return [
          { field: 'serialNumber', headerName: 'Serial No.', width: 180 },
          { field: 'model', headerName: 'Model', flex: 1, minWidth: 200 },
          ...commonColumns,
          {
            field: 'stockStatus',
            headerName: 'Status',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => <StatusBadge status={value} />,
          },
          baseActionColumn,
        ];
      case 'accessories':
        return [
          { field: 'name', headerName: 'Name', flex: 1, minWidth: 250 },
          { field: 'category', headerName: 'Category', width: 150 },
          {
            field: 'quantity',
            headerName: 'Qty',
            width: 80,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => (
              <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
            ),
          },
          ...commonColumns,
          baseActionColumn,
        ];
      default:
        return [];
    }
  }, [activeTab, isRtl]);

  const CurrentFormComponent = itemTypeConfig[activeTab].FormComponent;

  return (
    <Stack spacing={2.5}>
      <PageHeader title='Inventory'>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
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
        <Alert
          severity='success'
          onClose={() => setFeedback('')}
          sx={{ mb: 2 }}
        >
          {feedback}
        </Alert>
      )}

      <InventoryFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        brands={brands}
        statuses={statuses}
        onClear={handleClearFilters}
        activeTab={activeTab}
      />

      <Card
        sx={{ height: 'calc(100vh - 340px)', width: '100%', borderRadius: 3 }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[10, 25, 50, 100]}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            [`& .${gridClasses.columnHeaders}`]: {
              backgroundColor: isDark ? '#1A3F5C' : '#F4F6F9',
              fontWeight: 'bold',
            },
            [`& .${gridClasses.cell}`]: {
              borderBottom: `1px solid ${isDark ? '#1A3F5C' : '#E8EDF2'}`,
            },
            [`& .${gridClasses.row}`]: {
              '&:hover': {
                backgroundColor: isDark ? '#0D2137' : '#F8FAFC',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${isDark ? '#1A3F5C' : '#E8EDF2'}`,
            },
            '--DataGrid-overlayHeight': '300px',
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        />
      </Card>

      <Dialog
        open={formMeta.open}
        onClose={handleCloseForm}
        fullWidth
        maxWidth='md'
      >
        <CurrentFormComponent
          mode={formMeta.item ? 'edit' : 'create'}
          initialValues={formMeta.item}
          existingPhones={phones}
          existingLaptops={laptops}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </Dialog>

      <ConfirmDialog
        open={!!itemToDelete}
        title='Confirm Deletion'
        message={`Are you sure you want to permanently delete this item? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
        danger
      />
    </Stack>
  );
};

export default InventoryPage;
