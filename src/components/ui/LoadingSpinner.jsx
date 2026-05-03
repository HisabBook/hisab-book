import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({
  fullScreen = true,
  label = 'Loading...',
  size = 40,
}) => {
  return (
    <Box
      role='status'
      aria-live='polite'
      sx={{
        minHeight: fullScreen ? '100vh' : 160,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
      }}
    >
      <CircularProgress size={size} color='primary' />
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
