import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Badge,
} from '@mui/material';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { useAppStatus } from '../../hooks/useAppStatus';
import { selectShopProfile } from '../../redux/slices/settingsSlice';
import { selectLowStockAccessories } from '../../redux/slices/inventorySlice';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { selectDebtors } from '../../redux/slices/khataSlice';

export const SIDEBAR_WIDTH = 260;
export const TOPBAR_HEIGHT = 64;

const EMPTY_ARRAY = [];

const buildNavItems = () => [
  {
    labelKey: 'nav.dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: <DashboardRoundedIcon />,
    badgeSelector: null,
  },
  {
    labelKey: 'nav.pos',
    path: ROUTE_PATHS.POS,
    icon: <PointOfSaleRoundedIcon />,
    badgeSelector: null,
  },
  {
    labelKey: 'nav.inventory',
    path: ROUTE_PATHS.INVENTORY,
    icon: <InventoryRoundedIcon />,
    badgeSelector: selectLowStockAccessories,
  },
  {
    labelKey: 'nav.khata',
    path: ROUTE_PATHS.KHATA,
    icon: <AccountBalanceWalletRoundedIcon />,
    badgeSelector: selectDebtors,
  },
  {
    labelKey: 'nav.roznamcha',
    path: ROUTE_PATHS.ROZNAMCHA,
    icon: <ReceiptLongRoundedIcon />,
    badgeSelector: null,
  },
  {
    labelKey: 'nav.reports',
    path: ROUTE_PATHS.REPORTS,
    icon: <BarChartRoundedIcon />,
    badgeSelector: null,
  },
];

const buildBottomNavItems = () => [
  {
    labelKey: 'nav.settings',
    path: ROUTE_PATHS.SETTINGS,
    icon: <SettingsRoundedIcon />,
    badgeSelector: null,
  },
];

const NavItem = ({ item, isActive }) => {
  const { t } = useTranslation();
  const { isRtl } = useAppStatus();
  const navigate = useNavigate();

  const badgeItems = useSelector(item.badgeSelector ?? (() => EMPTY_ARRAY));
  const badgeCount = Array.isArray(badgeItems) ? badgeItems.length : 0;
  const active = isActive(item.path);

  const navActiveColor = '#05D67D';
  const navInactiveIconColor = 'rgba(230, 237, 245, 0.82)';
  const navInactiveTextColor = 'rgba(242, 247, 252, 0.95)';

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={() => navigate(item.path)}
        sx={{
          borderRadius: '10px',
          mx: 1,
          px: 2,
          py: 1.2,
          transition: 'all 0.2s ease',
          color: active ? navActiveColor : navInactiveTextColor,
          backgroundColor: active ? 'rgba(5, 214, 125, 0.15)' : 'transparent',
          '&:hover': {
            backgroundColor: active
              ? 'rgba(5, 214, 125, 0.22)'
              : 'rgba(255, 255, 255, 0.12)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 38,
            color: active ? navActiveColor : navInactiveIconColor,
          }}
        >
          {badgeCount > 0 ? (
            <Badge
              badgeContent={badgeCount}
              color='warning'
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: 14,
                  minWidth: 14,
                },
              }}
            >
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={t(item.labelKey)}
          slotProps={{
            primary: {
              sx: {
                fontWeight: active ? 700 : 500,
                fontSize: '0.92rem',
              },
            },
          }}
        />
        {active && (
          <Box
            sx={{
              width: 4,
              height: 22,
              borderRadius: 2,
              backgroundColor: navActiveColor,
              ml: isRtl ? 0 : 1,
              mr: isRtl ? 1 : 0,
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { isRtl } = useAppStatus();
  const shopProfile = useSelector(selectShopProfile);

  const mainNavItems = useMemo(() => buildNavItems(), []);
  const bottomNavItems = useMemo(() => buildBottomNavItems(), []);
  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant='permanent'
      anchor={isRtl ? 'right' : 'left'}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          backgroundColor: '#05192D', // Using the consistent dark color
          border: 'none',
          boxShadow: isRtl
            ? '-4px 0 20px rgba(5,25,45,0.25)'
            : '4px 0 20px rgba(5,25,45,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2.5,
          height: TOPBAR_HEIGHT,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          direction: 'ltr',
        }}
      >
        <Box
          component='img'
          src='/favicon.svg'
          alt='HisabBook logo'
          sx={{
            width: 30,
            height: 30,
            borderRadius: '8px',
            objectFit: 'contain',
          }}
        />
        <Box>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: 1.1,
            }}
          >
            HisabBook
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ flex: 1, overflowY: 'auto', pt: 1.5 }}
        className='no-scrollbar'
      >
        <Typography
          sx={{
            px: 3,
            mb: 0.75,
            color: 'rgba(255,255,255,0.3)',
            fontWeight: 700,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
          }}
        >
          Main Menu
        </Typography>
        <List>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} isActive={isActive} />
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />
      <Box sx={{ py: 1 }}>
        <List>
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} isActive={isActive} />
          ))}
        </List>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.75,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          src={shopProfile.shopLogo || undefined}
          sx={{
            width: 34,
            height: 34,
            backgroundColor: '#05D67D',
            color: '#05192D',
            fontWeight: 800,
          }}
        >
          {shopProfile.shopName?.charAt(0)?.toUpperCase() || 'H'}
        </Avatar>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {shopProfile.shopName || 'HisabBook Store'}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

