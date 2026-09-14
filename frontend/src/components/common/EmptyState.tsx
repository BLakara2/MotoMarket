import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { Search as SearchOffIcon, Add as AddIcon } from '@mui/icons-material';

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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        p: 6,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
          color: '#6D28D9',
          mb: 1,
        }}
      >
        {icon || <SearchOffIcon sx={{ fontSize: 40 }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
        {description}
      </Typography>
      {action ? (
        <Button variant="contained" color="secondary" onClick={action.onClick} sx={{ mt: 1.5 }} startIcon={<AddIcon />}>
          {action.label}
        </Button>
      ) : null}
    </Box>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Stack spacing={0.5} sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>{title}</Typography>
      {subtitle && <Typography variant="body1" color="text.secondary">{subtitle}</Typography>}
    </Stack>
  );
}

export function ProPaper({ children }: { children: React.ReactNode }) {
  return <Paper sx={{ p: 3, borderRadius: 4 }}>{children}</Paper>;
}
