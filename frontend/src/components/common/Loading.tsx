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
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={52} thickness={4} sx={{ color: 'secondary.main' }} />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          🏍
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
}
