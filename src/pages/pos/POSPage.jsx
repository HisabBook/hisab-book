import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import SearchBar from './components/SearchBar';
import CartPanel from './components/CartPanel';
import EmptyState from '../../components/ui/EmptyState';
import {
  addToCart,
  selectCartItems,
  selectTransactionType,
} from '../../redux/slices/posSlice';
import {
  selectAllAccessories,
  selectAllLaptops,
  selectAvailablePhones,
} from '../../redux/slices/inventorySlice';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const POSPage = () => {
  const dispatch = useDispatch();
  const phones = useSelector(selectAvailablePhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);
  const cartItems = useSelector(selectCartItems);
  const transactionType = useSelector(selectTransactionType);

  const [query, setQuery] = useState('');
  const [scanFeedback, setScanFeedback] = useState('');

  const inventoryPool = useMemo(() => {
    const availableLaptops = laptops.filter((laptop) => laptop.stockStatus === 'Available');
    const availableAccessories = accessories.filter((item) => item.quantity > 0);

    return [
      ...phones.map((phone) => ({
        id: phone.id,
        type: 'phone',
        label: `${phone.brand} ${phone.model}`,
        identifier: phone.imei,
        sellPrice: phone.sellPrice,
        cartPayload: {
          itemId: phone.id,
          type: 'phone',
          name: `${phone.brand} ${phone.model}`,
          brand: phone.brand,
          model: phone.model,
          imei: phone.imei,
          sellPrice: phone.sellPrice,
          currency: phone.currency,
          quantity: 1,
        },
        searchText: `${phone.brand} ${phone.model} ${phone.imei}`,
      })),
      ...availableLaptops.map((laptop) => ({
        id: laptop.id,
        type: 'laptop',
        label: `${laptop.brand} ${laptop.model}`,
        identifier: laptop.serialNumber,
        sellPrice: laptop.sellPrice,
        cartPayload: {
          itemId: laptop.id,
          type: 'laptop',
          name: `${laptop.brand} ${laptop.model}`,
          brand: laptop.brand,
          model: laptop.model,
          serialNumber: laptop.serialNumber,
          sellPrice: laptop.sellPrice,
          currency: laptop.currency,
          quantity: 1,
        },
        searchText: `${laptop.brand} ${laptop.model} ${laptop.serialNumber}`,
      })),
      ...availableAccessories.map((item) => ({
        id: item.id,
        type: 'accessory',
        label: item.name,
        identifier: null,
        sellPrice: item.sellPrice,
        cartPayload: {
          itemId: item.id,
          type: 'accessory',
          name: item.name,
          brand: item.brand,
          sellPrice: item.sellPrice,
          currency: item.currency,
          quantity: 1,
          availableQty: item.quantity,
        },
        searchText: `${item.name} ${item.brand}`,
      })),
    ];
  }, [phones, laptops, accessories]);

  const filteredInventory = useMemo(() => {
    const trimmed = normalize(query);
    if (!trimmed) return inventoryPool;

    return inventoryPool.filter((item) => normalize(item.searchText).includes(trimmed));
  }, [inventoryPool, query]);

  useEffect(() => {
    const trimmed = normalize(query);
    if (!trimmed) return;

    const exactMatch = inventoryPool.find(
      (item) => item.identifier && normalize(item.identifier) === trimmed
    );

    if (exactMatch) {
      dispatch(addToCart(exactMatch.cartPayload));
      setScanFeedback(`Scanned: ${exactMatch.label}`);
      setQuery('');
    }
  }, [dispatch, inventoryPool, query]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item.cartPayload));
  };

  const getItemDetails = (item) => {
    if (item.identifier) {
      return `${item.type === 'laptop' ? 'Serial' : 'IMEI'}: ${item.identifier}`;
    }

    const detailParts = [item.cartPayload?.brand, item.cartPayload?.model].filter(Boolean);
    if (detailParts.length > 0) return detailParts.join(' - ');
    return 'In stock';
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant='h5' fontWeight={700}>
                  POS Workspace
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Fast IMEI / Serial scan and smart item search.
                </Typography>
              </Box>

              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder='Search by brand, model, accessory name, IMEI or serial...'
              />

              {scanFeedback && (
                <Alert severity='success' onClose={() => setScanFeedback('')}>
                  {scanFeedback}
                </Alert>
              )}

              <Divider />

              <Stack spacing={1.25} sx={{ maxHeight: { xs: 420, md: 560 }, overflowY: 'auto', pr: 0.5 }}>
                {!query.trim() && (
                  <Typography variant='caption' color='text.secondary'>
                    {inventoryPool.length} items ready for checkout.
                  </Typography>
                )}

                {query.trim() && filteredInventory.length === 0 ? (
                  <Box sx={{ minHeight: 220 }}>
                    <EmptyState
                      message='No matching inventory found'
                      details='Try another brand/model/IMEI or check spelling.'
                    />
                  </Box>
                ) : (
                  filteredInventory.map((item) => (
                    <Card
                      key={`${item.type}_${item.id}`}
                      variant='outlined'
                      onClick={() => handleAddToCart(item)}
                      sx={{
                        cursor: 'pointer',
                        overflow: 'visible',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                      }}
                    >
                      <CardContent
                        sx={{
                          py: 1.25,
                          minHeight: 78,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 0.75,
                          overflow: 'visible',
                          '&:last-child': { pb: 1.25 },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr) auto',
                            columnGap: 1,
                            alignItems: 'start',
                          }}
                        >
                          <Typography
                            variant='subtitle2'
                            sx={{ minWidth: 0, overflowWrap: 'anywhere', lineHeight: 1.35 }}
                          >
                            {item.label}
                          </Typography>
                          <Chip size='small' label={item.type} />
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            component='div'
                            sx={{
                              minWidth: 0,
                              fontSize: '0.8rem',
                              color: 'text.secondary',
                              overflowWrap: 'anywhere',
                              lineHeight: 1.35,
                              flex: 1,
                            }}
                          >
                            {getItemDetails(item)}
                          </Typography>
                          <Typography
                            component='div'
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 700,
                              color: 'text.primary',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            ${item.sellPrice}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <CartPanel cartItems={cartItems} transactionType={transactionType} />
      </Box>
    </Box>
  );
};

export default POSPage;
