import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { useAppStatus } from '../../hooks/useAppStatus';
import Sidebar, { TOPBAR_HEIGHT } from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  const { isRtl } = useAppStatus();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenMobileSidebar = () => setIsMobileSidebarOpen(true);
  const handleCloseMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: isRtl ? 'row-reverse' : 'row',
        // Use theme token for consistency
        bgcolor: 'background.default',
      }}
    >
      <Sidebar
        isDesktop={isDesktop}
        mobileOpen={isMobileSidebarOpen}
        onMobileClose={handleCloseMobileSidebar}
      />
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
        <Topbar
          isDesktop={isDesktop}
          onMenuClick={handleOpenMobileSidebar}
        />
        <Box
          sx={{
            flexGrow: 1,
            mt: `${TOPBAR_HEIGHT}px`,
            p: { xs: 1.25, sm: 2, md: 3 },
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
