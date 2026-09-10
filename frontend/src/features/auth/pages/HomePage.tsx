import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Add as AddIcon, TwoWheeler as MotoIcon } from '@mui/icons-material';

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
          gap: 3,
        }}
      >
        <MotoIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h2" fontWeight={700}>
          Trouvez votre moto idéale
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth={600}>
          La marketplace spécialisée pour l'achat et la vente de motos à Madagascar.
          Des milliers d'annonces vous attendent.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            component={Link}
            to="/search"
          >
            Rechercher
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard/motorcycles/new"
          >
            Publier une annonce
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {[
          {
            title: 'Recherche rapide',
            description: 'Filtrez par marque, prix, kilométrage, localisation et plus.',
          },
          {
            title: 'Annonces vérifiées',
            description: 'Des vendeurs vérifiés pour plus de confiance.',
          },
          {
            title: 'Messagerie intégrée',
            description: 'Contactez directement les vendeurs en toute simplicité.',
          },
        ].map((feature) => (
          <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
