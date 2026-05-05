import { useSelector } from 'react-redux';
import { selectTheme, selectLanguage } from '../redux/slices/settingsSlice';

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
