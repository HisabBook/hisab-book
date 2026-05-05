import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { useAppStatus } from '../../hooks/useAppStatus';
import Sidebar, { TOPBAR_HEIGHT } from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  const { isRtl, isDark } = useAppStatus();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: isRtl ? 'row-reverse' : 'row',
        backgroundColor: isDark ? '#05192D' : '#F4F6F9',
      }}
    >
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
