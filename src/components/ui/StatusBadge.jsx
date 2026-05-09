import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  const isAvailable =
    typeof status === 'string' && status.toLowerCase() === 'available';

  return (
    <Chip
      label={status}
      size='small'
      color={isAvailable ? 'success' : 'error'}
      variant='filled'
      sx={{
        fontWeight: 600,
        textTransform: 'capitalize',
        height: 22,
        fontSize: '0.7rem',
        opacity: isAvailable ? 1 : 0.6,
      }}
    />
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
