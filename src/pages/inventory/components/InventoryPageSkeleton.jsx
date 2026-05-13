import { Stack, Skeleton, Box } from '@mui/material';
import PageHeader from '../../../components/ui/PageHeader';

const InventoryPageSkeleton = () => {
  return (
    <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '150vh' }}>
      {/* Skeleton for PageHeader */}
      <PageHeader title='Inventory'>
        <Box sx={{ flexGrow: 1 }} />
        <Skeleton
          variant='rectangular'
          width={120}
          height={40}
          sx={{ borderRadius: 2 }}
        />
      </PageHeader>

      {/* Skeleton for Filter Bar */}
      <Skeleton variant='rounded' height={80} />

      {/* Skeleton for DataGrid */}
      <Skeleton variant='rounded' sx={{ flexGrow: 1 }} />
    </Stack>
  );
};

export default InventoryPageSkeleton;
