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

      <Stack spacing={3}>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2}>
            <Skeleton variant='text' width='60%' height={32} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {' '}
                <Skeleton variant='rounded' height={88} />{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                {' '}
                <Skeleton variant='rounded' height={88} />{' '}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                {' '}
                <Skeleton variant='text' height={24} />{' '}
              </Grid>
              <Grid item xs={6} sm={3}>
                {' '}
                <Skeleton variant='text' height={24} />{' '}
              </Grid>
              <Grid item xs={6} sm={3}>
                {' '}
                <Skeleton variant='text' height={24} />{' '}
              </Grid>
              <Grid item xs={6} sm={3}>
                {' '}
                <Skeleton variant='text' height={24} />{' '}
              </Grid>
            </Grid>
          </Stack>
        </Box>
        {/* Skeleton for Expense Cards Section */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={4}>
            {' '}
            <Skeleton variant='rounded' height={90} />{' '}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {' '}
            <Skeleton variant='rounded' height={90} />{' '}
          </Grid>
          <Grid item xs={12} md={4}>
            {' '}
            <Skeleton variant='rounded' height={90} />{' '}
          </Grid>
        </Grid>
      </Stack>

      <Skeleton variant='rounded' height={56} />
      <Skeleton variant='rounded' height={400} />
    </Stack>
  );
};

export default RoznamchaPageSkeleton;
