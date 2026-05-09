import { Box, Typography } from '@mui/material';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import PropTypes from 'prop-types';

const EmptyState = ({
  message = 'No data to display',
  details = 'Try adding a new item or adjusting your filters.',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 3,
        color: 'text.secondary',
      }}
    >
      <InventoryRoundedIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.5 }} />
      <Typography variant='h6' sx={{ fontWeight: 600 }}>
        {message}
      </Typography>
      <Typography variant='body2'>{details}</Typography>
    </Box>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string,
  details: PropTypes.string,
};

export default EmptyState;
