import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuItem,
  Select,
  FormControl,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';

import { setLanguage, selectLanguage } from '../../redux/slices/settingsSlice';

// ── Language Options
const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'fa', label: 'Persian (Dari)', نativeLabel: 'دری', dir: 'rtl' },
  { code: 'ps', label: 'Pashto', nativeLabel: 'پښتو', dir: 'rtl' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLang = useSelector(selectLanguage);

  const handleChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
  };

  return (
    <Tooltip title='Switch Language / زبان بدل کړئ'>
      <FormControl size='small' variant='outlined'>
        <Select
          value={currentLang}
          onChange={handleChange}
          displayEmpty
          renderValue={(value) => {
            const lang = LANGUAGES.find((l) => l.code === value);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LanguageRoundedIcon sx={{ fontSize: 16, color: '#05D67D' }} />
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {lang?.nativeLabel || 'EN'}
                </Typography>
              </Box>
            );
          }}
          sx={{
            height: 34,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiSelect-select': { py: 0.5, pr: '28px !important', pl: 1 },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '10px',
                mt: 0.5,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: 180,
              },
            },
          }}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem
              key={lang.code}
              value={lang.code}
              sx={{
                py: 1,
                px: 2,
                borderRadius: '6px',
                mx: 0.5,
                my: 0.25,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(5,214,125,0.1)',
                  fontWeight: 600,
                  color: '#05D67D',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  gap: 2,
                }}
              >
                {/* English label */}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {lang.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    direction: lang.dir,
                    fontFamily:
                      lang.dir === 'rtl'
                        ? '"Vazirmatn", "Tahoma", sans-serif'
                        : 'inherit',
                  }}
                >
                  {lang.nativeLabel}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
};

export default LanguageSwitcher;
