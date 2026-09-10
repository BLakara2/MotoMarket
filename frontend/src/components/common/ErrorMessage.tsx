import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = 'Une erreur est survenue.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ p: 6, textAlign: 'center' }}
    >
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant="h6" color="error">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </Box>
  );
}
