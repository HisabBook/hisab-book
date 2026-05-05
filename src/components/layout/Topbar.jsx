import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Badge,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

import { useAppStatus } from '../../hooks/useAppStatus';
import { useRouteTitle } from '../../hooks/useRouteTitle';
import { toggleTheme } from '../../redux/slices/settingsSlice';
import LanguageSwitcher from '../shared/LanguageSwitcher.jsx';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from './Sidebar';

const Topbar = () => {
  const dispatch = useDispatch();
  const { isRtl, isDark } = useAppStatus();
  const pageTitle = useRouteTitle();

  const appBarSx = isRtl
    ? { right: SIDEBAR_WIDTH, left: 0 }
    : { left: SIDEBAR_WIDTH, right: 0 };

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
          px: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <Typography
          variant='h5'
          sx={{
            fontWeight: 700,
            fontSize: '1.15rem',
            fontFamily: isRtl
              ? '"Vazirmatn", "Tahoma", sans-serif'
              : '"Inter", sans-serif',
          }}
        >
          {pageTitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageSwitcher />

          <Tooltip title='Notifications'>
            <IconButton size='small' sx={{ color: 'inherit' }}>
              <Badge badgeContent={2} color='error'>
                <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

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
                border: `1px solid ${isDark ? 'rgba(5,214,125,0.2)' : 'rgba(5,25,45,0.1)'}`,
                '&:hover': { transform: 'scale(1.05)' },
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

export default Topbar;
