import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Backdrop,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import SearchBar from './components/SearchBar';
import CartPanel from './components/CartPanel';
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

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const getItemTypeLabel = (item) => {
  if (item.type === 'phone') return 'phone';
  if (item.type === 'laptop') return 'laptop';
  return 'accessory';
};

const POSPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const phones = useSelector(selectAvailablePhones);
  const laptops = useSelector(selectAllLaptops);
  const accessories = useSelector(selectAllAccessories);
  const cartItems = useSelector(selectCartItems);
  const transactionType = useSelector(selectTransactionType);
  const isFinalizingCheckout = useSelector(selectIsFinalizingCheckout);

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

  const hasSearchResults = filteredInventory.length > 0;

  return (
    <>
      <Backdrop
        open={isFinalizingCheckout}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal - 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
          pointerEvents: isFinalizingCheckout ? 'none' : 'auto',
          minHeight: 'calc(100vh - 120px)',
          p: { xs: 1, sm: 1.5, md: 2 },
          borderRadius: 4,
          bgcolor: isDark ? 'rgba(2, 12, 27, 0.94)' : theme.palette.background.paper,
          border: '1px solid',
          borderColor: isDark ? 'rgba(148, 163, 184, 0.12)' : theme.palette.divider,
          backgroundImage: isDark
            ? 'radial-gradient(circle at top left, rgba(5, 214, 125, 0.08), transparent 30%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 28%)'
            : 'none',
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            display: 'grid',
            gap: 1.5,
            gridTemplateRows: 'auto auto 1fr',
          }}
        >
          <Box>
            <Typography
              variant='h6'
              fontWeight={800}
              color={isDark ? 'common.white' : 'text.primary'}
            >
              Point of Sale
            </Typography>
            <Typography
              variant='body2'
              color={isDark ? 'rgba(226, 232, 240, 0.68)' : 'text.secondary'}
            >
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
              minHeight: { xs: 320, md: '100%' },
              borderRadius: 3,
              border: '1px solid',
              borderColor: isDark ? 'rgba(148, 163, 184, 0.12)' : theme.palette.divider,
              bgcolor: isDark ? 'rgba(9, 28, 51, 0.75)' : theme.palette.background.paper,
              p: 1.25,
              overflow: 'hidden',
              display: 'grid',
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
              <Typography
                variant='body2'
                color={isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary'}
              >
                {hasSearchResults ? `${filteredInventory.length} items found` : 'No matches'}
              </Typography>
              {!!scanFeedback && (
                <Chip
                  size='small'
                  label={scanFeedback}
                  color='success'
                  variant='outlined'
                  sx={{
                    borderColor: isDark ? 'rgba(5, 214, 125, 0.35)' : 'rgba(5, 214, 125, 0.22)',
                    color: isDark ? 'rgba(167, 243, 208, 0.95)' : theme.palette.primary.main,
                    bgcolor: 'rgba(5, 214, 125, 0.08)',
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 0.5,
                alignContent: 'start',
                minHeight: 0,
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
                      borderColor: isDark ? 'rgba(148, 163, 184, 0.12)' : theme.palette.divider,
                      borderRadius: 2,
                      p: 1.25,
                      bgcolor: isDark ? 'rgba(10, 35, 61, 0.96)' : theme.palette.background.default,
                      transition: 'transform 120ms ease, border-color 120ms ease, background-color 120ms ease',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(24, 53, 86, 0.95)' : 'rgba(5, 214, 125, 0.05)',
                        borderColor: 'rgba(5, 214, 125, 0.34)',
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
                          color={isDark ? 'common.white' : 'text.primary'}
                          sx={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                        >
                          {item.label}
                        </Typography>
                        <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                          <Typography
                            variant='caption'
                            color={isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'}
                            sx={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                          >
                            {item.cartPayload.brand || 'Unknown brand'}
                          </Typography>
                          {item.identifier && (
                            <Typography
                              variant='caption'
                              color={isDark ? 'rgba(226, 232, 240, 0.58)' : 'text.secondary'}
                              sx={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                            >
                              {getItemTypeLabel(item)} ID: {item.identifier}
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <Stack spacing={0.6} alignItems='flex-end' sx={{ flexShrink: 0 }}>
                        <Chip
                          size='small'
                          label={item.type}
                          sx={{
                            bgcolor: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(5, 25, 45, 0.06)',
                            color: isDark ? 'rgba(226, 232, 240, 0.82)' : 'text.primary',
                            textTransform: 'lowercase',
                          }}
                        />
                        <Typography
                          variant='h6'
                          fontWeight={800}
                          color={isDark ? 'common.white' : 'text.primary'}
                        >
                          ${item.sellPrice}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ minHeight: 280 }}>
                  <EmptyState
                    icon={
                      <ManageSearchRoundedIcon
                        sx={{ fontSize: 54, mb: 1.5, opacity: 0.55 }}
                      />
                    }
                    color={isDark ? 'rgba(226, 232, 240, 0.72)' : 'text.secondary'}
                    message='No search results'
                    details='Try a brand, model, accessory name, IMEI, or serial number.'
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <CartPanel cartItems={cartItems} transactionType={transactionType} />
        </Box>
      </Box>
    </>
  );
};

export default POSPage;

