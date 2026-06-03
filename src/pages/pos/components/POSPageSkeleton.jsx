import { Box, Skeleton, Stack } from '@mui/material';

const POSPageSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        alignItems: 'stretch',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
        height: { xs: 'auto', md: 'calc(100dvh - 120px)' },
        overflow: { xs: 'visible', md: 'hidden' },
        p: { xs: 1, sm: 1.5, md: 2 },
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ minWidth: 0, display: 'grid', gap: 1.5 }}>
        <Stack spacing={1}>
          <Skeleton variant='text' width={180} height={42} />
          <Skeleton variant='text' width='55%' height={24} />
        </Stack>

        <Skeleton variant='rounded' height={52} />

        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            p: 1.25,
            display: 'grid',
            gap: 1.25,
            minHeight: 320,
          }}
        >
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Skeleton variant='text' width={140} height={24} />
            <Skeleton variant='rounded' width={110} height={28} />
          </Stack>

          <Stack spacing={1}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} variant='rounded' height={74} />
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ minWidth: 0, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            p: 2,
            height: '100%',
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Skeleton variant='text' width={150} height={34} />
              <Skeleton variant='text' width='72%' height={22} />
            </Box>

            <Skeleton variant='rounded' height={44} />
            <Skeleton variant='rounded' height={44} />
            <Skeleton variant='rounded' height={44} />
            <Skeleton variant='rounded' height={44} />
            <Skeleton variant='rounded' height={44} />
            <Skeleton variant='rounded' height={44} />
            <Skeleton variant='rounded' height={44} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default POSPageSkeleton;
