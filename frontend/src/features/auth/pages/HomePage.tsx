import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Verified as VerifiedIcon,
  Message as MessageIcon,
  Bolt as BoltIcon,
  Shield as ShieldIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
  LocationOn as LocationIcon,
  TwoWheeler as MotoIcon,
  Build as PartIcon,
  Checkroom as AccessoryIcon,
  Speed as SpeedIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';

const HERO_IMG =
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop';

const PUBLISH_PATH = '/dashboard/listings/new';

const UNIVERSES = [
  { label: 'Motos', desc: 'Roadsters, trails, sportives, scooters…', link: '/search?type=MOTORCYCLE', icon: <MotoIcon />, count: '8 400+ annonces' },
  { label: 'Pièces détachées', desc: 'Moteurs, freins, pneus, échappements…', link: '/search?type=PART', icon: <PartIcon />, count: '2 600+ annonces' },
  { label: 'Accessoires', desc: 'Casques, blousons, gants, bagagerie…', link: '/search?type=ACCESSORY', icon: <AccessoryIcon />, count: '1 400+ annonces' },
];

const MOTO_CATEGORIES = [
  { label: 'Roadster', count: '1 240', icon: <MotoIcon /> },
  { label: 'Trail', count: '860', icon: <SpeedIcon /> },
  { label: 'Sportive', count: '640', icon: <BoltIcon /> },
  { label: 'Scooter', count: '1 520', icon: <MotoIcon /> },
  { label: 'Cross', count: '430', icon: <SpeedIcon /> },
  { label: 'Custom', count: '310', icon: <HandshakeIcon /> },
];

const FEATURED = [
  {
    id: '1',
    img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop',
    brand: 'Yamaha MT-07',
    price: '18 500 000 Ar',
    meta: '2022 • 12 400 km • 689 cc',
    city: 'Antananarivo',
    tag: 'Sponsorisé',
  },
  {
    id: '2',
    img: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=800&auto=format&fit=crop',
    brand: 'Honda CB500F',
    price: '15 900 000 Ar',
    meta: '2021 • 18 200 km • 471 cc',
    city: 'Toamasina',
    tag: 'Vérifié',
  },
  {
    id: '3',
    img: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=800&auto=format&fit=crop',
    brand: 'KTM Duke 390',
    price: '13 200 000 Ar',
    meta: '2023 • 6 800 km • 398 cc',
    city: 'Antsirabe',
    tag: 'Nouveau',
  },
  {
    id: '4',
    img: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=800&auto=format&fit=crop',
    brand: 'Kawasaki Z900',
    price: '32 000 000 Ar',
    meta: '2022 • 9 500 km • 948 cc',
    city: 'Mahajanga',
    tag: 'Pro',
  },
];

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const isDark = theme.palette.mode === 'dark';

  const submitSearch = () => {
    navigate(q ? `/search?search=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <Box>
      {/* ============ HERO ============ */}
      <Box sx={{ position: 'relative', overflow: 'hidden', background: '#0F1226', color: '#fff' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(100deg, rgba(10,10,25,0.94) 0%, rgba(20,16,50,0.82) 42%, rgba(76,29,149,0.45) 75%, rgba(10,10,25,0.35) 100%)',
          }}
        />
        <Box
          className="hero-grain"
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(700px 340px at 80% 15%, rgba(139,92,246,0.35), transparent), radial-gradient(500px 300px at 10% 90%, rgba(79,70,229,0.3), transparent)',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 7, md: 11 } }}>
          <Grid container spacing={5} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<BoltIcon sx={{ fontSize: 16 }} />}
                  label="N°1 moto à Madagascar"
                  sx={{ bgcolor: 'rgba(139,92,246,0.18)', color: '#DDD6FE', border: '1px solid rgba(167,139,250,0.4)', fontWeight: 700 }}
                />
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                  label="+12 000 annonces vérifiées"
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', fontWeight: 700 }}
                />
              </Stack>

              <Typography variant="h1" className="text-balance" sx={{ fontSize: { xs: '2.4rem', md: '3.8rem' } }}>
                Motos, pièces &
                <br />
                <Box component="span" sx={{ background: 'linear-gradient(90deg,#A78BFA,#E879F9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  accessoires.
                </Box>
              </Typography>

              <Typography variant="h6" sx={{ mt: 2.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500, maxWidth: 560, lineHeight: 1.6 }}>
                Achetez et vendez en toute confiance : annonces vérifiées,
                vendeurs notés et messagerie sécurisée, partout à Madagascar.
              </Typography>

              {/* Barre de recherche */}
              <Paper
                sx={{
                  mt: 4,
                  p: 1.5,
                  borderRadius: 4,
                  display: 'flex',
                  gap: 1.5,
                  flexDirection: { xs: 'column', sm: 'row' },
                  bgcolor: isDark ? 'rgba(21,21,39,0.92)' : '#fff',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Marque, modèle, pièce… (ex : Yamaha MT-07)"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                  slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent' } }}
                />
                <TextField
                  select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  slotProps={{ select: { displayEmpty: true } }}
                  sx={{ minWidth: { sm: 200 } }}
                >
                  <MenuItem value="">Toute l'île</MenuItem>
                  {['Antananarivo', 'Toamasina', 'Antsirabe', 'Mahajanga', 'Fianarantsoa', 'Toliara'].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" color="secondary" size="large" onClick={submitSearch} sx={{ whiteSpace: 'nowrap', px: 4 }}>
                  Rechercher
                </Button>
              </Paper>

              {/* Stats */}
              <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                {[
                  ['12 400+', 'Annonces actives'],
                  ['8 200+', 'Vendeurs vérifiés'],
                  ['98%', 'Acheteurs satisfaits'],
                ].map(([v, l]) => (
                  <Box key={l}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{v}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{l}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Carte flottante */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', p: 1 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#7C3AED' }}><BoltIcon /></Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Vente flash du jour</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>Honda CB500F · Toamasina</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip label="-12%" size="small" sx={{ bgcolor: '#7C3AED', color: '#fff', fontWeight: 800 }} />
                  </Stack>
                  <Box sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
                    <img src={FEATURED[1].img} alt="moto" style={{ height: 220, width: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>15 900 000 Ar</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>2021 · 18 200 km · Vérifié</Typography>
                    </Box>
                    <Button variant="contained" color="secondary" component={Link} to="/search" endIcon={<ArrowIcon />}>
                      Voir
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============ UNIVERS ============ */}
      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: -5 }, position: 'relative', zIndex: 2 }}>
        <Paper sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4 }}>
          <Stack direction="row" sx={{ mb: 2.5, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Trois univers, une seule adresse</Typography>
            <Button component={Link} to="/search" endIcon={<ArrowIcon />} sx={{ color: 'secondary.main' }}>
              Tout voir
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {UNIVERSES.map((u) => (
              <Grid key={u.label} size={{ xs: 12, md: 4 }}>
                <Card
                  component={Link}
                  to={u.link}
                  sx={{
                    p: 3,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all .22s ease',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: 'secondary.main', boxShadow: '0 16px 40px -12px rgba(124,58,237,0.35)' },
                  }}
                >
                  <Avatar sx={{ width: 60, height: 60, background: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', color: '#6D28D9' }}>
                    {u.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{u.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{u.desc}</Typography>
                    <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 800 }}>{u.count}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 4, mb: 2 }}>Explorer les motos par style</Typography>
          <Grid container spacing={2}>
            {MOTO_CATEGORIES.map((c) => (
              <Grid key={c.label} size={{ xs: 6, sm: 4, md: 2 }}>
                <Card
                  component={Link}
                  to="/search?type=MOTORCYCLE"
                  sx={{
                    textAlign: 'center',
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all .22s ease',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: 'secondary.main', boxShadow: '0 16px 40px -12px rgba(124,58,237,0.35)' },
                  }}
                >
                  <Avatar sx={{ mx: 'auto', mb: 1.5, width: 52, height: 52, background: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', color: '#6D28D9' }}>
                    {c.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{c.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.count} annonces</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* ============ ANNONCES À LA UNE ============ */}
      <Container maxWidth="xl" sx={{ mt: 7 }}>
        <Stack direction="row" sx={{ mb: 3, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box>
            <Chip label="Sélection du jour" color="secondary" size="small" sx={{ mb: 1.5 }} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Annonces à la une</Typography>
            <Typography variant="body1" color="text.secondary">Les meilleures opportunités, vérifiées par nos équipes.</Typography>
          </Box>
          <Button component={Link} to="/search" variant="outlined" endIcon={<ArrowIcon />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Voir les 12 400 annonces
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {FEATURED.map((m) => (
            <Grid key={m.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                component={Link}
                to="/search"
                sx={{ overflow: 'hidden', height: '100%', transition: 'all .22s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: 4 } }}
              >
                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={m.img} alt={m.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Chip label={m.tag} size="small" color="secondary" sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 800 }} />
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{m.brand}</Typography>
                  <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 800 }}>{m.price}</Typography>
                  <Typography variant="body2" color="text.secondary">{m.meta}</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1, alignItems: 'center' }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{m.city}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ============ POURQUOI ============ */}
      <Box sx={{ mt: 9, py: 8, bgcolor: isDark ? 'rgba(139,92,246,0.05)' : '#fff', borderY: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>Pourquoi MotoMarket ?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 5, textAlign: 'center' }}>
            Une expérience d'achat pensée pour les motards, de la recherche à la remise des clés.
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: <ShieldIcon />, title: 'Annonces vérifiées', desc: 'Identité du vendeur contrôlée, photos réelles et historique transparent avant publication.' },
              { icon: <MessageIcon />, title: 'Messagerie sécurisée', desc: 'Échangez directement avec les vendeurs sans exposer votre numéro. Fini le spam.' },
              { icon: <StarIcon />, title: 'Avis & notes vendeurs', desc: 'Chaque vendeur est noté par la communauté. Achetez les yeux fermés.' },
            ].map((f) => (
              <Grid key={f.title} size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 1.5, height: '100%' }}>
                  <CardContent>
                    <Avatar sx={{ mb: 2, width: 52, height: 52, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff' }}>
                      {f.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============ CTA VENDEUR ============ */}
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Box
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(120deg, #0F172A 0%, #2E1065 55%, #5B21B6 100%)',
            color: '#fff',
            p: { xs: 4, md: 7 },
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(500px 260px at 85% 20%, rgba(167,139,250,0.4), transparent)', pointerEvents: 'none' }} />
          <Grid container spacing={4} sx={{ position: 'relative', alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip label="Offre vendeurs Pro" size="small" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.12)', color: '#DDD6FE', border: '1px solid rgba(255,255,255,0.2)' }} />
              <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
                Vendez moto, pièce ou accessoire en moins de 7 jours.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5, color: 'rgba(255,255,255,0.75)', maxWidth: 520 }}>
                Photos illimitées, badge vérifié, mise en avant et statistiques de vues.
                Publier prend 2 minutes — c'est gratuit.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3.5 }}>
                <Button variant="contained" color="secondary" size="large" startIcon={<AddIcon />} component={Link} to={PUBLISH_PATH}>
                  Publier mon annonce
                </Button>
                <Button variant="outlined" size="large" component={Link} to="/search" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)', '&:hover': { borderColor: '#fff' } }}>
                  Voir comment ça marche
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: '#fff' }}>
                {[
                  ['2 min', 'pour publier votre annonce'],
                  ['3×', 'plus de contacts avec le badge vérifié'],
                  ['0 Ar', 'pour votre première annonce'],
                ].map(([v, l]) => (
                  <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)', '&:last-child': { border: 0 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#C4B5FD', minWidth: 80 }}>{v}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{l}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
