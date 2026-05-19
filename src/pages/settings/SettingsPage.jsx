import { Stack } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

import ExchangeRateForm from './components/ExchangeRateForm';

const SettingsPage = () => {
  return (
    <Stack spacing={3}>
      <PageHeader title='Settings' />
      <ExchangeRateForm />
    </Stack>
  );
};

export default SettingsPage;
