import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export const useRouteTitle = () => {
  const { t } = useTranslation();
  const matches = useMatches();

  // Find the last route in the match stack that has a `titleKey`
  const match = [...matches].reverse().find((m) => m.handle?.titleKey);

  // Return the translated title, or a default
  return match ? t(match.handle.titleKey) : 'HisabBook';
};
