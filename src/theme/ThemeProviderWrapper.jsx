import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';

import { selectTheme, selectLanguage } from '../redux/slices/settingsSlice';
import { lightTheme, darkTheme } from './muiTheme';
import { rtlCache, ltrCache } from './rtlCache';
import { getDirection, RTL_LANGUAGES } from '../i18n';

const ThemeProviderWrapper = ({ children }) => {
  const themeMode = useSelector(selectTheme);
  const language = useSelector(selectLanguage);
  // ── Determine direction from active language
  const direction = getDirection(language);
  const isRtl = RTL_LANGUAGES.includes(language);

  // ── Pick the correct MUI theme + inject dir
  const muiTheme = useMemo(() => {
    const base = themeMode === 'dark' ? darkTheme : lightTheme;
    // Return a theme clone with the direction baked in
    return {
      ...base,
      direction,
    };
  }, [themeMode, direction]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', direction);

    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, direction, themeMode]);

  return (
    <CacheProvider value={isRtl ? rtlCache : ltrCache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default ThemeProviderWrapper;
