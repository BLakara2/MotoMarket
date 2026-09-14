import { Container, Paper, Grid, Box, Typography, Stack, Avatar, Chip } from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import EmptyState from '../../../components/common/EmptyState';
import { PageHeader } from '../../../components/common/EmptyState';

export default function MessagesPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <PageHeader title="Messages" subtitle="Échangez avec les vendeurs et suivez vos discussions." />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}><MessageIcon fontSize="small" /></Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Conversations</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Chip label="0" size="small" />
            </Stack>
            <EmptyState
              title="Aucune conversation"
              description="Vos discussions apparaîtront ici dès votre premier contact."
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2.5, minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, width: 64, height: 64, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
                <MessageIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Sélectionnez une conversation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Contactez un vendeur depuis une annonce pour démarrer une discussion sécurisée, sans exposer votre numéro.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
