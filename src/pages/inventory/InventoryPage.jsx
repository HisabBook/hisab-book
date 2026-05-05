import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  Divider,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import AddPhoneForm from './components/AddPhoneForm.jsx';
import AddLaptopForm from './components/AddLaptopForm.jsx';
import AddAccessoryForm from './components/AddAccessoryForm.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import {
  addAccessory,
  addLaptop,
  addPhone,
  deleteAccessory,
  deleteLaptop,
  deletePhone,
  selectAllAccessories,
  selectAllLaptops,
  selectAllPhones,
  updateAccessory,
  updateLaptop,
  updatePhone,
} from '../../redux/slices/inventorySlice';

const createNextId = (items, prefix) => {
  const maxNum = items.reduce((maxValue, item) => {
    const itemId = String(item.id ?? '');
    if (!itemId.startsWith(prefix)) return maxValue;
    const num = Number(itemId.replace(`${prefix}_`, ''));
    if (!Number.isNaN(num)) return Math.max(maxValue, num);
    return maxValue;
  }, 0);

  return `${prefix}_${String(maxNum + 1).padStart(3, '0')}`;
};

const InventoryPage = () => {
  const dispatch = useDispatch();
  const phones = useSelector(selectAllPhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);

  const [activeTab, setActiveTab] = useState('phones');
  const [formState, setFormState] = useState({ open: false, type: null, mode: 'create', item: null });
  const [deleteState, setDeleteState] = useState({ open: false, type: null, item: null });
  const [feedback, setFeedback] = useState({ type: 'success', text: '' });

  const counts = useMemo(
    () => ({
      phones: phones.length,
      laptops: laptops.length,
      accessories: accessories.length,
    }),
    [phones.length, laptops.length, accessories.length]
  );

  const openCreateModal = (type) => {
    setFormState({ open: true, type, mode: 'create', item: null });
  };

  const openEditModal = (type, item) => {
    setFormState({ open: true, type, mode: 'edit', item });
  };

  const closeFormModal = () => {
    setFormState({ open: false, type: null, mode: 'create', item: null });
  };

  const showSuccess = (text) => {
    setFeedback({ type: 'success', text });
  };

  const handlePhoneSubmit = (data) => {
    if (formState.mode === 'create') {
      dispatch(addPhone({ ...data, id: createNextId(phones, 'ph') }));
      showSuccess('Phone added successfully.');
    } else {
      dispatch(updatePhone(data));
      showSuccess('Phone updated successfully.');
    }
    closeFormModal();
  };

  const handleLaptopSubmit = (data) => {
    if (formState.mode === 'create') {
      dispatch(addLaptop({ ...data, id: createNextId(laptops, 'lp') }));
      showSuccess('Laptop added successfully.');
    } else {
      dispatch(updateLaptop(data));
      showSuccess('Laptop updated successfully.');
    }
    closeFormModal();
  };

  const handleAccessorySubmit = (data) => {
    if (formState.mode === 'create') {
      dispatch(addAccessory({ ...data, id: createNextId(accessories, 'acc') }));
      showSuccess('Accessory added successfully.');
    } else {
      dispatch(updateAccessory(data));
      showSuccess('Accessory updated successfully.');
    }
    closeFormModal();
  };

  const openDeleteConfirm = (type, item) => {
    setDeleteState({ open: true, type, item });
  };

  const closeDeleteConfirm = () => {
    setDeleteState({ open: false, type: null, item: null });
  };

  const handleDelete = () => {
    if (!deleteState.item) return;

    if (deleteState.type === 'phone') {
      dispatch(deletePhone(deleteState.item.id));
      showSuccess('Phone deleted successfully.');
    } else if (deleteState.type === 'laptop') {
      dispatch(deleteLaptop(deleteState.item.id));
      showSuccess('Laptop deleted successfully.');
    } else if (deleteState.type === 'accessory') {
      dispatch(deleteAccessory(deleteState.item.id));
      showSuccess('Accessory deleted successfully.');
    }

    closeDeleteConfirm();
  };

  const renderPhonesTable = () => (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>IMEI</TableCell>
            <TableCell>Brand / Model</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell align='right'>Sell Price</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {phones.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.imei}</TableCell>
              <TableCell>{`${item.brand} ${item.model}`}</TableCell>
              <TableCell>{item.condition}</TableCell>
              <TableCell>
                <Chip
                  size='small'
                  label={item.stockStatus}
                  color={item.stockStatus === 'Sold' ? 'default' : 'success'}
                />
              </TableCell>
              <TableCell align='right'>{`${item.sellPrice} ${item.currency}`}</TableCell>
              <TableCell align='right'>
                <Stack direction='row' spacing={1} justifyContent='flex-end'>
                  <Button size='small' startIcon={<EditRoundedIcon />} onClick={() => openEditModal('phone', item)}>
                    Edit
                  </Button>
                  <Button
                    size='small'
                    color='error'
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => openDeleteConfirm('phone', item)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderLaptopsTable = () => (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Serial Number</TableCell>
            <TableCell>Brand / Model</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell align='right'>Sell Price</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {laptops.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.serialNumber}</TableCell>
              <TableCell>{`${item.brand} ${item.model}`}</TableCell>
              <TableCell>{item.condition}</TableCell>
              <TableCell>
                <Chip
                  size='small'
                  label={item.stockStatus}
                  color={item.stockStatus === 'Sold' ? 'default' : 'success'}
                />
              </TableCell>
              <TableCell align='right'>{`${item.sellPrice} ${item.currency}`}</TableCell>
              <TableCell align='right'>
                <Stack direction='row' spacing={1} justifyContent='flex-end'>
                  <Button size='small' startIcon={<EditRoundedIcon />} onClick={() => openEditModal('laptop', item)}>
                    Edit
                  </Button>
                  <Button
                    size='small'
                    color='error'
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => openDeleteConfirm('laptop', item)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAccessoriesTable = () => (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Low Stock Threshold</TableCell>
            <TableCell align='right'>Sell Price</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accessories.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.lowStockThreshold}</TableCell>
              <TableCell align='right'>{`${item.sellPrice} ${item.currency}`}</TableCell>
              <TableCell align='right'>
                <Stack direction='row' spacing={1} justifyContent='flex-end'>
                  <Button
                    size='small'
                    startIcon={<EditRoundedIcon />}
                    onClick={() => openEditModal('accessory', item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size='small'
                    color='error'
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => openDeleteConfirm('accessory', item)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const currentCreateType =
    activeTab === 'phones' ? 'phone' : activeTab === 'laptops' ? 'laptop' : 'accessory';

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' spacing={1.5}>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            Inventory Management
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Manage unique and bulk stock with safe CRUD operations.
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<AddRoundedIcon />}
          onClick={() => openCreateModal(currentCreateType)}
        >
          {currentCreateType === 'phone'
            ? 'Add Phone'
            : currentCreateType === 'laptop'
              ? 'Add Laptop'
              : 'Add Accessory'}
        </Button>
      </Stack>

      {feedback.text && (
        <Alert severity={feedback.type} onClose={() => setFeedback({ type: 'success', text: '' })}>
          {feedback.text}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack direction='row' spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Chip label={`Phones: ${counts.phones}`} color='primary' variant='outlined' />
            <Chip label={`Laptops: ${counts.laptops}`} color='primary' variant='outlined' />
            <Chip
              label={`Accessories: ${counts.accessories}`}
              color='primary'
              variant='outlined'
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 2 }}>
            <Tab value='phones' label='Phones' />
            <Tab value='laptops' label='Laptops' />
            <Tab value='accessories' label='Accessories' />
          </Tabs>

          {activeTab === 'phones' && renderPhonesTable()}
          {activeTab === 'laptops' && renderLaptopsTable()}
          {activeTab === 'accessories' && renderAccessoriesTable()}
        </CardContent>
      </Card>

      <Dialog open={formState.open} onClose={closeFormModal} fullWidth maxWidth='md'>
        {formState.type === 'phone' && (
          <AddPhoneForm
            mode={formState.mode}
            initialValues={formState.item}
            existingPhones={phones}
            onSubmit={handlePhoneSubmit}
            onCancel={closeFormModal}
          />
        )}
        {formState.type === 'laptop' && (
          <AddLaptopForm
            mode={formState.mode}
            initialValues={formState.item}
            existingLaptops={laptops}
            onSubmit={handleLaptopSubmit}
            onCancel={closeFormModal}
          />
        )}
        {formState.type === 'accessory' && (
          <AddAccessoryForm
            mode={formState.mode}
            initialValues={formState.item}
            onSubmit={handleAccessorySubmit}
            onCancel={closeFormModal}
          />
        )}
      </Dialog>

      <ConfirmDialog
        open={deleteState.open}
        title='Delete Item'
        message='This action cannot be undone. Do you want to continue?'
        confirmText='Delete'
        cancelText='Cancel'
        danger
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirm}
      />
    </Stack>
  );
};

export default InventoryPage;
