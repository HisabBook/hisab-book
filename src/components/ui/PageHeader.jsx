import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useAppStatus } from '../../hooks/useAppStatus';

const PageHeader = ({ title, children }) => {
  const { isRtl } = useAppStatus();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Typography
        variant='h4'
        sx={{
          fontWeight: 700,
          fontFamily: isRtl
            ? '"Vazirmatn", "Tahoma", sans-serif'
            : '"Inter", sans-serif',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>{children}</Box>
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default PageHeader;
