// src/pages/pos/POSPage.jsx

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Backdrop,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import SearchBar from './components/SearchBar';
import CartPanel from './components/CartPanel';
import POSPageSkeleton from './components/POSPageSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import {
  addToCart,
  selectCartItems,
  selectIsFinalizingCheckout,
  selectTransactionType,
} from '../../redux/slices/posSlice';
import {
  selectAllAccessories,
  selectAllLaptops,
  selectAvailablePhones,
} from '../../redux/slices/inventorySlice';

const normalize = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const getItemTypeLabel = (itemType) => {
  if (itemType === 'laptop') return 'Serial';
  if (itemType === 'phone') return 'IMEI';
  return 'ID';
};

const POSPage = () => {
  const dispatch = useDispatch();
  // Redux state
  const phones = useSelector(selectAvailablePhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);
  const cartItems = useSelector(selectCartItems);
  const transactionType = useSelector(selectTransactionType);
  const isFinalizingCheckout = useSelector(selectIsFinalizingCheckout);

  // Local state
  const [query, setQuery] = useState('');
  const [scanFeedback, setScanFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Memoized full inventory pool for searching
  const inventoryPool = useMemo(() => {
    const availableLaptops = laptops.filter(
      (laptop) => laptop.stockStatus === 'Available'
    );
    const availableAccessories = accessories.filter(
      (item) => item.quantity > 0
    );

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

  // Memoized search results
  const filteredInventory = useMemo(() => {
    const trimmed = normalize(query);
    if (!trimmed) return inventoryPool;
    return inventoryPool.filter((item) =>
      normalize(item.searchText).includes(trimmed)
    );
  }, [inventoryPool, query]);

  // Effect for "instant add" on exact IMEI/serial scan
  useEffect(() => {
    const trimmed = normalize(query);
    if (!trimmed || trimmed.length < 5) return;

    const exactMatch = inventoryPool.find(
      (item) => item.identifier && normalize(item.identifier) === trimmed
    );

    if (exactMatch) {
      dispatch(addToCart(exactMatch.cartPayload));
      setScanFeedback(`Added: ${exactMatch.label}`);
      setQuery('');
    }
  }, [dispatch, inventoryPool, query]);

  // Effect to make the scan feedback chip disappear
  useEffect(() => {
    if (scanFeedback) {
      const timer = setTimeout(() => setScanFeedback(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [scanFeedback]);

  // Effect for initial page load skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (item) => dispatch(addToCart(item.cartPayload));
  const hasSearchResults = filteredInventory.length > 0;

  if (isLoading) {
    return <POSPageSkeleton />;
  }

  return (
    <>
      <Backdrop
        open={isFinalizingCheckout}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          alignItems: 'stretch',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 7fr) minmax(0, 5fr)',
          },
          pointerEvents: isFinalizingCheckout ? 'none' : 'auto',
          height: { xs: 'auto', md: 'calc(100dvh - 120px)' },
          overflow: { xs: 'visible', md: 'hidden' },
          p: { xs: 1, sm: 1.5, md: 2 },
          borderRadius: 4,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            minHeight: 0,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box>
            <Typography variant='h6' fontWeight={800}>
              Point of Sale
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Fast IMEI / serial scan and smart item search.
            </Typography>
          </Box>

          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder='Search by brand, model, accessory name, IMEI or serial...'
          />

          <Box
            sx={{
              minHeight: { xs: 320, md: 0 },
              flex: 1,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
              p: 1.25,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1.25,
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                {hasSearchResults
                  ? `${filteredInventory.length} items found`
                  : 'No matches'}
              </Typography>
              {!!scanFeedback && (
                <Chip
                  size='small'
                  label={scanFeedback}
                  color='success'
                  variant='outlined'
                  onDelete={() => setScanFeedback('')}
                />
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'grid',
                gap: 1,
                overflowY: 'auto',
                pr: 0.5,
                alignContent: 'start',
              }}
            >
              {hasSearchResults ? (
                filteredInventory.map((item) => (
                  <Box
                    key={`${item.type}_${item.id}`}
                    onClick={() => handleAddToCart(item)}
                    sx={{
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 1.25,
                      bgcolor: 'background.paper',
                      transition:
                        'transform 120ms ease, border-color 120ms ease',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.light',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1.25,
                        minWidth: 0,
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant='subtitle2'
                          fontWeight={700}
                          sx={{ overflowWrap: 'anywhere' }}
                        >
                          {item.label}
                        </Typography>
                        <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                          <Typography variant='caption' color='text.secondary'>
                            {item.cartPayload.brand || 'Unknown brand'}
                          </Typography>
                          {item.identifier && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {getItemTypeLabel(item.type)}: {item.identifier}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      <Stack
                        spacing={0.6}
                        alignItems='flex-end'
                        sx={{ flexShrink: 0 }}
                      >
                        <Chip
                          size='small'
                          label={item.type}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Typography variant='h6' fontWeight={800}>
                          ${item.sellPrice}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    minHeight: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmptyState
                    icon={
                      <ManageSearchRoundedIcon
                        sx={{ fontSize: 54, opacity: 0.5 }}
                      />
                    }
                    message='No search results'
                    details='Try a brand, model, IMEI, or serial number.'
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ minWidth: 0, height: '100%', minHeight: 0, overflow: 'hidden' }}
        >
          <CartPanel cartItems={cartItems} transactionType={transactionType} />
        </Box>
      </Box>
    </>
  );
};

export default POSPage;
