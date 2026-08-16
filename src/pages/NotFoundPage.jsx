import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 6 },
        background:
          'radial-gradient(circle at top left, rgba(25,118,210,0.18), transparent 32%), radial-gradient(circle at top right, rgba(46,125,50,0.16), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 42%, #f6f9fd 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 100%)',
          backdropFilter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          bgcolor: 'rgba(25,118,210,0.12)',
          filter: 'blur(16px)',
          top: { xs: 24, md: 48 },
          left: { xs: -120, md: -80 },
          animation: 'float 12s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          bgcolor: 'rgba(46,125,50,0.12)',
          filter: 'blur(16px)',
          bottom: { xs: 8, md: 32 },
          right: { xs: -90, md: 24 },
          animation: 'float 14s ease-in-out infinite reverse',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 760,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 4, md: 6 },
            border: '1px solid',
            borderColor: 'rgba(15, 23, 42, 0.08)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.76) 100%)',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.12)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1.5}
            >
              <Chip
                icon={<ConstructionRoundedIcon fontSize='small' />}
                label='Page unavailable'
                sx={{
                  fontWeight: 700,
                  bgcolor: 'rgba(25,118,210,0.08)',
                  color: 'primary.main',
                }}
              />
              <Typography variant='body2' color='text.secondary'>
                The route you tried to open is not available.
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant='h1'
                sx={{
                  fontSize: { xs: '4.5rem', sm: '6rem', md: '7.5rem' },
                  lineHeight: 0.9,
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  background:
                    'linear-gradient(135deg, #0f172a 0%, #1d4ed8 48%, #0f766e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                404
              </Typography>
              <Typography
                variant='h4'
                sx={{
                  fontSize: { xs: '1.6rem', sm: '2.2rem' },
                  fontWeight: 850,
                  letterSpacing: '-0.03em',
                }}
              >
                We could not find this page
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ maxWidth: 560, lineHeight: 1.8 }}
              >
                The page may have been moved, renamed, or the link may be broken.
                Use the buttons below to jump back into the app without losing your
                flow.
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(15, 23, 42, 0.03)',
                  border: '1px solid',
                  borderColor: 'rgba(15, 23, 42, 0.06)',
                }}
              >
                <Typography variant='caption' color='text.secondary'>
                  Tip
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 700, mt: 0.5 }}>
                  Go back to the dashboard or home page
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  border: '1px solid',
                  borderColor: 'rgba(25, 118, 210, 0.09)',
                }}
              >
                <Typography variant='caption' color='text.secondary'>
                  Status
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 700, mt: 0.5 }}>
                  Route not found
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(46, 125, 50, 0.05)',
                  border: '1px solid',
                  borderColor: 'rgba(46, 125, 50, 0.09)',
                }}
              >
                <Typography variant='caption' color='text.secondary'>
                  Recovery
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 700, mt: 0.5 }}>
                  Fast navigation available
                </Typography>
              </Box>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ pt: 0.5 }}
            >
              <Button
                component={RouterLink}
                to='/dashboard'
                variant='contained'
                size='large'
                startIcon={<HomeRoundedIcon />}
                sx={{
                  px: 3,
                  py: 1.35,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 800,
                  boxShadow: '0 16px 30px rgba(25,118,210,0.25)',
                }}
              >
                Back to Dashboard
              </Button>
              <Button
                variant='outlined'
                size='large'
                startIcon={<KeyboardBackspaceRoundedIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  px: 3,
                  py: 1.35,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 800,
                }}
              >
                Go Back
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -18px, 0) scale(1.04); }
        }
      `}</style>
    </Box>
  );
};

export default NotFoundPage;
