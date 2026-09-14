import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = 'Chargement…', fullScreen = false }: LoadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullScreen ? '60vh' : '300px',
        p: 4,
      }}
    >
      <CircularProgress size={44} thickness={4.5} sx={{ color: 'secondary.main' }} />
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
}
