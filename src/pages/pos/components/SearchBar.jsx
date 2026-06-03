import { InputAdornment, TextField, useTheme } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const SearchBar = ({ value, onChange, placeholder }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <TextField
      size='small'
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position='start'
            sx={{ color: isDark ? 'rgba(226, 232, 240, 0.7)' : 'text.secondary' }}
          >
            <SearchRoundedIcon fontSize='small' />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          bgcolor: isDark ? 'rgba(9, 32, 58, 0.65)' : theme.palette.background.paper,
          color: isDark ? 'common.white' : 'text.primary',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: isDark ? 'rgba(148, 163, 184, 0.18)' : theme.palette.divider,
        },
        '& .MuiInputBase-input': {
          color: isDark ? 'common.white' : 'text.primary',
        },
        '& .MuiInputBase-input::placeholder': {
          opacity: 0.75,
          color: isDark ? 'rgba(226, 232, 240, 0.68)' : 'text.secondary',
        },
      }}
    />
  );
};

export default SearchBar;
