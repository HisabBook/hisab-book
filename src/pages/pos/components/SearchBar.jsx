import { TextField } from '@mui/material';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <TextField
      size='small'
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default SearchBar;
