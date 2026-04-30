import { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// ── MUI Components
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Divider,
  Badge,
  Chip,
} from '@mui/material';

// ── MUI Icons
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';

// ── Redux
import {
  toggleTheme,
  selectTheme,
  selectLanguage,
  selectShopProfile,
} from '../../redux/slices/settingsSlice';
import { selectLowStockAccessories } from '../../redux/slices/inventorySlice';
import { selectDebtors } from '../../redux/slices/khataSlice';

// ── Shared Components
import LanguageSwitcher from '../shared/LanguageSwitcher.jsx';

const SIDEBAR_WIDTH = 260;
const TOPBAR_HEIGHT = 64;
const buildNavItems = (t) => [
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
    badgeSelector: selectLowStockAccessories, // shows low stock count
  },
  {
    labelKey: 'nav.khata',
    path: '/khata',
    icon: <AccountBalanceWalletRoundedIcon />,
    badgeSelector: selectDebtors, // shows debtor count
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

const buildBottomNavItems = (t) => [
  {
    labelKey: 'nav.settings',
    path: '/settings',
    icon: <SettingsRoundedIcon />,
    badgeSelector: null,
  },
];
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const shopProfile = useSelector(selectShopProfile);
  const language = useSelector(selectLanguage);
  const isRtl = language === 'fa' || language === 'ps';
  const navActiveColor = '#05D67D';
  const navInactiveIconColor = 'rgba(230, 237, 245, 0.82)';
  const navInactiveTextColor = 'rgba(242, 247, 252, 0.95)';

  // ── Build nav items with translated labels
  const mainNavItems = useMemo(() => buildNavItems(t), [t]);
  const bottomNavItems = useMemo(() => buildBottomNavItems(t), [t]);

  const isActive = (path) => location.pathname === path;

  // ─── Single Nav Item Renderer
  const NavItem = ({ item }) => {
    const badgeItems = useSelector(item.badgeSelector ?? (() => null));
    const badgeCount = Array.isArray(badgeItems) ? badgeItems.length : 0;
    const active = isActive(item.path);

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
          {/* Icon */}
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
                    padding: '0 3px',
                  },
                }}
              >
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </ListItemIcon>

          {/* Label */}
          <ListItemText
            primary={t(item.labelKey)}
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: active ? 700 : 500,
              color: active ? navActiveColor : navInactiveTextColor,
              fontFamily: isRtl
                ? '"Vazirmatn", "Tahoma", sans-serif'
                : 'inherit',
            }}
          />

          {/* Active indicator bar */}
          {active && (
            <Box
              sx={{
                width: 4,
                height: 22,
                borderRadius: 2,
                backgroundColor: navActiveColor,
                flexShrink: 0,
                ml: isRtl ? 0 : 1,
                mr: isRtl ? 1 : 0,
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant='permanent'
      anchor={isRtl ? 'right' : 'left'} // ← flips for RTL languages
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#05192D',
          borderRight: isRtl ? 'none' : 'none',
          borderLeft: 'none',
          boxShadow: isRtl
            ? '-4px 0 20px rgba(5,25,45,0.25)'
            : '4px 0 20px rgba(5,25,45,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
        },
      }}
    >
      {/* ── Brand / Logo Area*/}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          height: TOPBAR_HEIGHT,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          direction: 'ltr', // logo always LTR
        }}
      >
        {/* App icon */}
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #05D67D 0%, #04B569 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(5,214,125,0.35)',
          }}
        >
          <StorefrontRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>

        {/* App name */}
        <Box>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            HisabBook
          </Typography>
          <Typography
            sx={{
              color: '#05D67D',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            Smart POS & Inventory
          </Typography>
        </Box>
      </Box>

      {/* ── Main Navigation  */}
      <Box
        sx={{ flex: 1, overflowY: 'auto', pt: 1.5, pb: 1 }}
        className='no-scrollbar'
      >
        {/* Section label */}
        <Typography
          sx={{
            px: 3,
            mb: 0.75,
            display: 'block',
            color: 'rgba(255,255,255,0.3)',
            fontWeight: 700,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          Main Menu
        </Typography>

        <List disablePadding>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </List>
      </Box>

      {/* ── Divider */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* ── Bottom Navigation (Settings)  */}
      <Box sx={{ py: 1 }}>
        <List disablePadding>
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </List>
      </Box>

      {/* ── Shop Profile Footer  */}
      <Box
        sx={{
          px: 2,
          py: 1.75,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Avatar
          src={shopProfile.shopLogo || undefined}
          sx={{
            width: 34,
            height: 34,
            backgroundColor: '#05D67D',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#05192D',
            flexShrink: 0,
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
              lineHeight: 1.3,
            }}
          >
            {shopProfile.shopName || 'HisabBook Store'}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '0.68rem',
              lineHeight: 1.3,
            }}
          >
            Administrator
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};
const Topbar = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  const location = useLocation();
  const isRtl = language === 'fa' || language === 'ps';

  // ── Map routes to translated page titles
  const getPageTitle = () => {
    const routeTitleMap = {
      '/dashboard': t('nav.dashboard'),
      '/pos': t('nav.pos'),
      '/inventory': t('nav.inventory'),
      '/khata': t('nav.khata'),
      '/roznamcha': t('nav.roznamcha'),
      '/reports': t('nav.reports'),
      '/settings': t('nav.settings'),
    };
    return routeTitleMap[location.pathname] || 'HisabBook';
  };

  // ── Dynamic AppBar positioning based on layout direction ──
  const appBarSx = isRtl
    ? { right: SIDEBAR_WIDTH, left: 0 }
    : { left: SIDEBAR_WIDTH, right: 0 };

  const isDark = theme === 'dark';

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        ...appBarSx,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        height: TOPBAR_HEIGHT,
        backgroundColor: isDark ? '#0D2137' : '#FFFFFF',
        borderBottom: `1px solid ${isDark ? '#1A3F5C' : '#E8EDF2'}`,
        color: isDark ? '#F8FAFC' : '#05192D',
        zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          height: TOPBAR_HEIGHT,
          minHeight: `${TOPBAR_HEIGHT}px !important`,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <Typography
          variant='h5'
          sx={{
            fontWeight: 700,
            fontSize: '1.15rem',
            color: 'inherit',
            letterSpacing: '-0.02em',
            fontFamily: isRtl
              ? '"Vazirmatn", "Tahoma", sans-serif'
              : '"Inter", sans-serif',
          }}
        >
          {getPageTitle()}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LanguageSwitcher />

          {/* Notifications Bell */}
          <Tooltip title='Notifications'>
            <IconButton
              size='small'
              sx={{
                color: 'inherit',
                width: 36,
                height: 36,
              }}
            >
              <Badge
                badgeContent={2}
                color='error'
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    height: 15,
                    minWidth: 15,
                  },
                }}
              >
                <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Dark / Light Mode Toggle */}
          <Tooltip
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <IconButton
              size='small'
              onClick={() => dispatch(toggleTheme())}
              sx={{
                width: 36,
                height: 36,
                color: isDark ? '#05D67D' : '#05192D',
                backgroundColor: isDark
                  ? 'rgba(5,214,125,0.12)'
                  : 'rgba(5,25,45,0.06)',
                border: `1px solid ${
                  isDark ? 'rgba(5,214,125,0.2)' : 'rgba(5,25,45,0.1)'
                }`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(5,214,125,0.22)'
                    : 'rgba(5,25,45,0.1)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {isDark ? (
                <LightModeRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
const MainLayout = () => {
  const language = useSelector(selectLanguage);
  const isRtl = language === 'fa' || language === 'ps';
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        // Flip flex direction for RTL (sidebar moves to right)
        flexDirection: isRtl ? 'row-reverse' : 'row',
        backgroundColor: isDark ? '#05192D' : '#F4F6F9',
      }}
    >
      {/* ── Permanent Sidebar  */}
      <Sidebar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Topbar />
        <Box
          sx={{
            flexGrow: 1,
            mt: `${TOPBAR_HEIGHT}px`,
            p: { xs: 2, sm: 2.5, md: 3 },
            overflowY: 'auto',
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
