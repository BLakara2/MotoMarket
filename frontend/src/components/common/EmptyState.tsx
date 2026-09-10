import { Box, Typography, Button } from '@mui/material';
import { Search as SearchOffIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  title = 'Aucun résultat',
  description = 'Aucun élément trouvé.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ p: 6, textAlign: 'center' }}
    >
      {icon || <SearchOffIcon sx={{ fontSize: 64, color: 'text.disabled' }} />}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
