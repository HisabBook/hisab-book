import { Card, CardContent, Typography, Box } from '@mui/material';

export const KPICard = ({ title, value, color = 'primary.main', icon }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {title}
            </Typography>
            <Typography variant='h4' sx={{ fontWeight: 700, mt: 1, color }}>
              {value}
            </Typography>
          </Box>
          {icon && <Box sx={{ color, opacity: 0.6 }}>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};
