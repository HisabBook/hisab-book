import { Box, Typography } from '@mui/material';
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
        '@keyframes spinnerFade': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0.12 },
        },
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
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: Math.max(8, Math.round(size * 0.22)),
              borderRadius: 999,
              bgcolor: index < 4 ? 'primary.main' : 'text.secondary',
              transformOrigin: `center ${-(size * 0.34)}px`,
              transform: `translate(-50%, -50%) rotate(${index * 30}deg)`,
              animation: `spinnerFade 2.8s linear ${-2.55 + index * 0.23}s infinite`,
              opacity: 0.2,
            }}
          />
        ))}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          opacity: 0.85,
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
