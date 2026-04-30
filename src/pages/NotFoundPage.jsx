import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        minHeight: '55vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        gap: 1.5,
        px: 2,
      }}
    >
      <Typography variant='h3' sx={{ fontWeight: 800 }}>
        404
      </Typography>
      <Typography variant='h6' sx={{ fontWeight: 700 }}>
        Page not found
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        The page you requested does not exist or has been moved.
      </Typography>
      <Button component={RouterLink} to='/dashboard' variant='contained'>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;
