import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
  overlay = false,
  fullScreen = true,
  label = 'Loading...',
  size = 40,
}) => {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullScreen ? '100vh' : 160,
        width: '100%',
        p: 4,
        ...(overlay && {
          position: 'fixed',
          inset: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          bgcolor: 'background.default',
        }),
      }}
    >
      <CircularProgress
        size={size}
        thickness={3.6}
        sx={{ color: 'primary.main', opacity: 0.8 }}
      />
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

LoadingSpinner.propTypes = {
  overlay: PropTypes.bool,
  fullScreen: PropTypes.bool,
  label: PropTypes.string,
  size: PropTypes.number,
};

export default LoadingSpinner;