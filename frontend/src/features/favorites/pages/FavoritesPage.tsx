import { Container, Paper, Button, Stack } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import { PageHeader } from '../../../components/common/EmptyState';

export default function FavoritesPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
        <PageHeader title="Mes favoris" subtitle="Retrouvez ici toutes les motos que vous avez sauvegardées." />
        <Button variant="contained" color="secondary" startIcon={<SearchIcon />} component={Link} to="/search">
          Découvrir des motos
        </Button>
      </Stack>
      <Paper>
        <EmptyState
          title="Aucun favori pour le moment"
          description="Touchez le cœur sur une annonce pour la retrouver ici et comparer vos coups de cœur."
          action={{ label: 'Explorer les annonces', onClick: () => (window.location.href = '/search') }}
        />
      </Paper>
    </Container>
  );
}
