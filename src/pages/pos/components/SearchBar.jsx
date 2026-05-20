import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete='off'
      slotProps={{
        htmlInput: {
          'aria-label': 'POS inventory search input',
        },
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchRoundedIcon color='action' />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={() => onChange('')} aria-label='Clear search'>
                <BackspaceRoundedIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
};

export default SearchBar;
