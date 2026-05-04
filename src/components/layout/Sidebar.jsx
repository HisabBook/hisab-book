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
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';

import {
  selectLanguage,
  selectShopProfile,
} from '../../redux/slices/settingsSlice';
import { selectLowStockAccessories } from '../../redux/slices/inventorySlice';
import { selectDebtors } from '../../redux/slices/khataSlice';

export const SIDEBAR_WIDTH = 260;
export const TOPBAR_HEIGHT = 64;

const buildNavItems = () => [
  {
    labelKey: 'nav.dashboard',
    path: '/dashboard',
    icon: <DashboardRoundedIcon />,
    badgeSelector: null,
  },
  {
    labelKey: 'nav.pos',
    path: '/pos',
    icon: <PointOfSaleRoundedIcon />,
    badgeSelector: null,
  },
  {
    labelKey: 'nav.inventory',
    path: '/inventory',
    icon: <InventoryRoundedIcon />,
    badgeSelector: selectLowStockAccessories,
  },
  {
    labelKey: 'nav.khata',
    path: '/khata',
    icon: <AccountBalanceWalletRoundedIcon />,
    badgeSelector: selectDebtors,
  },
  {
    labelKey: 'nav.roznamcha',
    path: '/roznamcha',
    icon: <ReceiptLongRoundedIcon />,
    badgeSelector: null,
  },
  {
    labelKey: 'nav.reports',
    path: '/reports',
    icon: <BarChartRoundedIcon />,
    badgeSelector: null,
  },
];

const buildBottomNavItems = () => [
  {
    labelKey: 'nav.settings',
    path: '/settings',
    icon: <SettingsRoundedIcon />,
    badgeSelector: null,
  },
];

const NavItem = ({ item, isActive, t, isRtl }) => {
  const badgeItems = useSelector(item.badgeSelector ?? (() => null));
  const badgeCount = Array.isArray(badgeItems) ? badgeItems.length : 0;
  const active = isActive(item.path);
  const navigate = useNavigate();

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
              fontSize: '0.9rem',
              fontWeight: active ? 700 : 500,
              fontFamily: isRtl
                ? '"Vazirmatn", "Tahoma", sans-serif'
                : 'inherit',
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
  const { t } = useTranslation();
  const shopProfile = useSelector(selectShopProfile);
  const language = useSelector(selectLanguage);
  const isRtl = language === 'fa' || language === 'ps';

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
          backgroundColor: '#05192D',
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
          gap: 1.5,
          px: 2.5,
          height: TOPBAR_HEIGHT,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          direction: 'ltr',
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #05D67D 0%, #04B569 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(5,214,125,0.35)',
          }}
        >
          <StorefrontRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
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
          <Typography
            sx={{ color: '#05D67D', fontSize: '0.68rem', fontWeight: 500 }}
          >
            Smart POS & Inventory
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
            <NavItem
              key={item.path}
              item={item}
              isActive={isActive}
              t={t}
              isRtl={isRtl}
            />
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />
      <Box sx={{ py: 1 }}>
        <List>
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isActive={isActive}
              t={t}
              isRtl={isRtl}
            />
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
          <Typography
            sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem' }}
          >
            Administrator
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
