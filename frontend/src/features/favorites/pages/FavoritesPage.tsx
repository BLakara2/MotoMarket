import { Container, Typography } from '@mui/material';
import EmptyState from '../../../components/common/EmptyState';

export default function FavoritesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Mes favoris
      </Typography>
      <EmptyState
        title="Aucun favori"
        description="Ajoutez des motos en favoris pour les retrouver facilement."
      />
    </Container>
  );
}
