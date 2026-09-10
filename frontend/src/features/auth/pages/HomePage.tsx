import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Add as AddIcon, TwoWheeler as MotoIcon, Build as PartIcon, Checkroom as AccessoryIcon } from '@mui/icons-material';

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
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          La marketplace moto de Madagascar
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
          Achetez et vendez des motos, pièces détachées et accessoires.
          Simple, rapide, sécurisé.
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
            to="/dashboard/listings/new"
          >
            Publier une annonce
          </Button>
        </Box>
      </Box>

      {/* Categories */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {[
          {
            icon: <MotoIcon sx={{ fontSize: 48 }} />,
            title: 'Motos',
            description: 'Trouvez la moto idéale parmi des centaines d\'annonces.',
            link: '/search?type=MOTORCYCLE',
          },
          {
            icon: <PartIcon sx={{ fontSize: 48 }} />,
            title: 'Pièces détachées',
            description: 'Moteurs, freins, pneus, échappements et plus.',
            link: '/search?type=PART',
          },
          {
            icon: <AccessoryIcon sx={{ fontSize: 48 }} />,
            title: 'Accessoires',
            description: 'Casques, blousons, gants et équipements.',
            link: '/search?type=ACCESSORY',
          },
        ].map((category) => (
          <Grid size={{ xs: 12, md: 4 }} key={category.title}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{category.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
                  {category.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {category.description}
                </Typography>
                <Button
                  component={Link}
                  to={category.link}
                  variant="outlined"
                >
                  Voir les annonces
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
