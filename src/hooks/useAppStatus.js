import { useSelector } from 'react-redux';
import { selectTheme, selectLanguage } from '../redux/slices/settingsSlice';
/**
 * Custom hook to get key application status properties.
 * Centralizes the logic for theme and language direction.
 */
export const useAppStatus = () => {
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  return {
    theme,
    language,
    isDark: theme === 'dark',
    isRtl: language === 'fa' || language === 'ps',
  };
};
