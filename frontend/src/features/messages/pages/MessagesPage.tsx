import { Container, Typography } from '@mui/material';
import EmptyState from '../../../components/common/EmptyState';

export default function MessagesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Messages
      </Typography>
      <EmptyState
        title="Aucun message"
        description="Contactez un vendeur pour démarrer une conversation."
      />
    </Container>
  );
}
