// A reusable header component for pages, displaying a title and action buttons.
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useAppStatus } from '../../hooks/useAppStatus';

const PageHeader = ({ title, children }) => {
  const { isRtl } = useAppStatus();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.25, sm: 1.5 },
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Typography
        variant='h4'
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.35rem', sm: '1.7rem', md: '2rem' },
          fontFamily: isRtl
            ? '"Vazirmatn", "Tahoma", sans-serif'
            : '"Inter", sans-serif',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{children}</Box>
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default PageHeader;
