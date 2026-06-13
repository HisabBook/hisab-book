import { Stack, Skeleton, Grid, Box } from '@mui/material';
import PageHeader from '../../../components/ui/PageHeader';

const RoznamchaPageSkeleton = () => {
  return (
    <Stack spacing={3}>
      <PageHeader title='Shop Expenses (Roznamcha)'>
        <Skeleton
          variant='rectangular'
          width={140}
          height={40}
          sx={{ borderRadius: 2 }}
        />
      </PageHeader>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={4}>
          <Skeleton variant='rounded' height={90} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Skeleton variant='rounded' height={90} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Skeleton variant='rounded' height={90} />
        </Grid>
      </Grid>

      <Skeleton variant='rounded' height={56} />

      <Skeleton variant='rounded' height={400} />
    </Stack>
  );
};

export default RoznamchaPageSkeleton;
