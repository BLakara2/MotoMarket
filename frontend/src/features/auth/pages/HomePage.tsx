import { Box, Typography, Button, Container, Grid, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  Add as AddIcon,
  TwoWheeler as MotoIcon,
  Build as PartIcon,
  Checkroom as AccessoryIcon,
  Verified as VerifiedIcon,
  Handshake as HandshakeIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';

const GRADIENT_TEXT = {
  backgroundImage: 'linear-gradient(120deg, #FFB300 0%, #FF7A00 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
} as const;

const HERO_BACKDROP =
  'radial-gradient(600px circle at 20% 10%, rgba(255, 179, 0, .12), transparent 45%), radial-gradient(600px circle at 85% 25%, rgba(22, 112, 79, .25), transparent 45%)';

export default function HomePage() {
  const categories = [
    {
      icon: <MotoIcon sx={{ fontSize: 40 }} />,
      title: 'Motos',
      description: 'Trouvez la moto idéale parmi des centaines d\'annonces.',
      link: '/search?type=MOTORCYCLE',
      color: 'primary',
    },
    {
      icon: <PartIcon sx={{ fontSize: 40 }} />,
      title: 'Pièces détachées',
      description: 'Moteurs, freins, pneus, échappements et plus.',
      link: '/search?type=PART',
      color: 'secondary',
    },
    {
      icon: <AccessoryIcon sx={{ fontSize: 40 }} />,
      title: 'Accessoires',
      description: 'Casques, blousons, gants et équipements.',
      link: '/search?type=ACCESSORY',
      color: 'info',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 6, md: 9 },
          gap: 3,
          overflow: 'hidden',
          backgroundImage: HERO_BACKDROP,
        }}
      >
        <Box
          className="glowy"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '36px',
            backgroundImage: 'linear-gradient(135deg, #0B3B2C 0%, #16704F 100%)',
            boxShadow: '0 24px 48px -16px rgba(11, 59, 44, .6)',
            mb: 1,
          }}
        >
          <MotoIcon className="floaty" sx={{ fontSize: 72, color: '#fff' }} />
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 700, maxWidth: 760, lineHeight: 1.15 }}>
          La marketplace moto de Madagascar
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640, fontWeight: 400 }}>
          Achetez et vendez des{' '}
          <Typography component="span" variant="h6" sx={{ ...GRADIENT_TEXT, fontWeight: 700 }}>
            motos, pièces détachées et accessoires
          </Typography>{' '}
          entre particuliers et professionnels. Simple, rapide, sécurisé.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            component={Link}
            to="/search"
            sx={{ px: 4 }}
          >
            Rechercher
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard/listings/new"
            sx={{
              px: 4,
              borderWidth: 1.5,
              '&:hover': { borderWidth: 1.5 },
            }}
          >
            Publier une annonce
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
          <Chip icon={<VerifiedIcon />} label="Vendeurs vérifiés" variant="outlined" />
          <Chip icon={<HandshakeIcon />} label="Négociation directe" variant="outlined" />
          <Chip icon={<ShippingIcon />} label="Livraison Tana & régions" variant="outlined" />
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Explorez par catégorie
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Trois univers, un seul endroit pour acheter et vendre.
        </Typography>

        <Grid container spacing={3} className="stagger">
          {categories.map((category) => (
            <Grid size={{ xs: 12, md: 4 }} key={category.title}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform .25s ease, box-shadow .25s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 8,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    backgroundImage: 'radial-gradient(circle, rgba(255, 122, 0, .14), transparent 70%)',
                  }}
                />
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      color: category.color === 'secondary' ? 'secondary.main' : 'primary.main',
                      bgcolor: category.color === 'secondary'
                        ? 'rgba(255, 122, 0, .1)'
                        : 'rgba(14, 77, 58, .08)',
                      transition: 'transform .25s ease',
                      '&:hover': { transform: 'rotate(-6deg) scale(1.05)' },
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {category.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button component={Link} to={category.link} variant="outlined" sx={{ px: 3 }}>
                      Voir les annonces
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Comment ça marche */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Comment ça marche ?
        </Typography>
        <Grid container spacing={3} className="stagger" sx={{ justifyContent: 'center' }}>
          {[
            { step: '01', title: 'Publiez', text: 'Créez votre annonce en 2 minutes avec photos et prix.' },
            { step: '02', title: 'Contactez', text: 'Discutez directement avec l\'acheteur ou le vendeur.' },
            { step: '03', title: 'Roulez', text: 'Concluez la vente en toute confiance. Bonne route !' },
          ].map((item) => (
            <Grid size={{ xs: 12, sm: 4 }} key={item.step}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 4,
                  bgcolor: 'background.paper',
                  borderRadius: '18px',
                  height: '100%',
                  boxShadow: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Chakra Petch", sans-serif',
                    fontWeight: 700,
                    fontSize: 42,
                    color: 'primary.main',
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}