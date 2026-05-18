import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { useAppStatus } from '../../hooks/useAppStatus';
import { useRouteTitle } from '../../hooks/useRouteTitle';
import { toggleTheme } from '../../redux/slices/settingsSlice';
import LanguageSwitcher from '../shared/LanguageSwitcher.jsx';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from './Sidebar';

const Topbar = ({ isDesktop, onMenuClick }) => {
  const dispatch = useDispatch();
  const { isRtl, isDark } = useAppStatus();
  const pageTitle = useRouteTitle();
  const theme = useTheme();
  const isTabletUp = useMediaQuery(theme.breakpoints.up('sm'));

  const appBarSx = isDesktop
    ? isRtl
      ? { right: SIDEBAR_WIDTH, left: 0 }
      : { left: SIDEBAR_WIDTH, right: 0 }
    : { left: 0, right: 0 };

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        ...appBarSx,
        width: isDesktop ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
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
          px: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            gap: 1,
            flex: 1,
          }}
        >
          {!isDesktop && (
            <IconButton
              onClick={onMenuClick}
              edge='start'
              sx={{ color: 'inherit' }}
              aria-label='open navigation'
            >
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: isRtl
                ? '"Vazirmatn", "Tahoma", sans-serif'
                : '"Inter", sans-serif',
            }}
          >
            {pageTitle}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.25, sm: 1 },
            flexShrink: 0,
          }}
        >
          <LanguageSwitcher />

          {isTabletUp && (
            <Tooltip title='Notifications'>
              <IconButton size='small' sx={{ color: 'inherit' }}>
                <Badge badgeContent={2} color='error'>
                  <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          <Tooltip
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <IconButton
              size='small'
              onClick={() => dispatch(toggleTheme())}
              sx={{
                width: { xs: 30, sm: 36 },
                height: { xs: 30, sm: 36 },
                color: isDark ? '#05D67D' : '#05192D',
                backgroundColor: isDark
                  ? 'rgba(5,214,125,0.12)'
                  : 'rgba(5,25,45,0.06)',
                border: `1px solid ${isDark ? 'rgba(5,214,125,0.2)' : 'rgba(5,25,45,0.1)'}`,
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              {isDark ? (
                <LightModeRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              ) : (
                <DarkModeRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
