import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { Error as ErrorIcon, Refresh as RetryIcon } from '@mui/icons-material';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = 'Une erreur est survenue.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <Paper sx={{ py: 6, px: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, textAlign: 'center' }}>
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FEE2E2',
            color: '#DC2626',
            mb: 1,
          }}
        >
          <ErrorIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Oups, quelque chose a mal tourné
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
          {message}
        </Typography>
        {onRetry && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
            <Button variant="contained" color="secondary" startIcon={<RetryIcon />} onClick={onRetry}>
              Réessayer
            </Button>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
