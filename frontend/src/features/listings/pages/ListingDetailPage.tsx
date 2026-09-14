import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Paper,
  Stack,
  Avatar,
  Breadcrumbs,
  Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  LocationOn as LocationIcon,
  CalendarToday as YearIcon,
  Speed as MileageIcon,
  LocalGasStation as FuelIcon,
  Settings as TransmissionIcon,
  FavoriteBorder as FavoriteIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  ArrowBack as BackIcon,
  Visibility as ViewsIcon,
} from '@mui/icons-material';
import api, { getFileUrl } from '../../../services/api';
import ErrorMessage from '../../../components/common/ErrorMessage';
import type { Listing } from '../../../types';
import { formatPrice } from '../components/ListingCard';

function getTypeLabel(type: string): string {
  switch (type) {
    case 'MOTORCYCLE': return 'Moto';
    case 'PART': return 'Pièce détachée';
    case 'ACCESSORY': return 'Accessoire';
    default: return type;
  }
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    setSelectedImg(0);
  }, [id]);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await api.get<Listing>(`/listings/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton height={40} width={300} />
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}><Skeleton variant="rounded" height={440} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><Skeleton variant="rounded" height={440} /></Grid>
        </Grid>
      </Container>
    );
  }
  if (error) return <ErrorMessage />;
  if (!listing) return <ErrorMessage message="Annonce non trouvée" />;

  const images = listing.images ?? [];
  const isMoto = listing.type === 'MOTORCYCLE';

  const motoSpecs = [
    ...(listing.year ? [{ icon: <YearIcon fontSize="small" />, label: 'Année', value: String(listing.year) }] : []),
    ...(listing.mileage != null ? [{ icon: <MileageIcon fontSize="small" />, label: 'Kilométrage', value: `${new Intl.NumberFormat('fr-FR').format(listing.mileage)} km` }] : []),
    ...(listing.fuel ? [{ icon: <FuelIcon fontSize="small" />, label: 'Carburant', value: listing.fuel }] : []),
    ...(listing.transmission ? [{ icon: <TransmissionIcon fontSize="small" />, label: 'Transmission', value: listing.transmission }] : []),
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 2.5, md: 4 }, minHeight: '80vh' }}>
      <Container maxWidth="xl">
        <Stack direction="row" spacing={2.5} sx={{ mb: 2.5, alignItems: 'center', justifyContent: 'space-between' }}>
          <Breadcrumbs sx={{ fontSize: '0.85rem' }}>
            <Typography component={Link} to="/" color="text.secondary">Accueil</Typography>
            <Typography component={Link} to="/search" color="text.secondary">Recherche</Typography>
            <Typography color="text.primary" sx={{ fontWeight: 700 }}>
              {listing.title}
            </Typography>
          </Breadcrumbs>
          <Button startIcon={<BackIcon />} component={Link} to="/search" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Retour
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {/* Galerie */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ overflow: 'hidden', p: 0 }}>
              {images.length > 0 ? (
                <Box sx={{ position: 'relative', height: { xs: 300, md: 460 }, bgcolor: '#0F1226' }}>
                  <img
                    src={getFileUrl(images[selectedImg].url)}
                    alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 14, left: 14 }}>
                    <Chip label={listing.condition} size="small" color="secondary" sx={{ fontWeight: 800 }} />
                    <Chip label={getTypeLabel(listing.type)} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 800 }} />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 14, right: 14 }}>
                    <Button size="small" variant="contained" startIcon={<ShareIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.92)', color: 'text.primary', '&:hover': { bgcolor: '#fff' } }}>
                      Partager
                    </Button>
                  </Stack>
                  <Chip
                    icon={<ViewsIcon sx={{ fontSize: 15 }} />}
                    label={`${listing.viewsCount ?? 0} vues`}
                    size="small"
                    sx={{ position: 'absolute', bottom: 14, right: 14, bgcolor: 'rgba(15,23,42,0.7)', color: '#fff', backdropFilter: 'blur(6px)' }}
                  />
                </Box>
              ) : (
                <Box sx={{ height: { xs: 300, md: 460 }, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#EDE9FE' }}>
                  <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Aucune photo</Typography>
                </Box>
              )}
              {images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, p: 2, overflowX: 'auto' }}>
                  {images.map((img, i) => (
                    <Box
                      key={img.id}
                      component="img"
                      src={getFileUrl(img.url)}
                      alt=""
                      onClick={() => setSelectedImg(i)}
                      sx={{
                        width: 96,
                        height: 72,
                        borderRadius: 2.5,
                        flexShrink: 0,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: i === selectedImg ? '2.5px solid #7C3AED' : '2px solid transparent',
                        opacity: i === selectedImg ? 1 : 0.65,
                        transition: 'all .2s',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>

            {/* Caractéristiques */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>Caractéristiques</Typography>
              {isMoto && motoSpecs.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  {motoSpecs.map((s) => (
                    <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ bgcolor: 'background.default', borderRadius: 3, p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ color: 'secondary.main', display: 'flex', justifyContent: 'center', mb: 0.5 }}>{s.icon}</Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{s.label}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{s.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  ...(listing.engineCc ? [['Cylindrée', `${listing.engineCc} cm³`]] : []),
                  ...(listing.motorcycleCategory ? [['Catégorie', listing.motorcycleCategory]] : []),
                  ...(listing.partCategory ? [['Catégorie', listing.partCategory.name]] : []),
                  ...(listing.compatibleBrands ? [['Compatible', listing.compatibleBrands]] : []),
                  ...(listing.partReference ? [['Référence', listing.partReference]] : []),
                  ...(listing.accessoryCategory ? [['Catégorie', listing.accessoryCategory.name]] : []),
                  ...(listing.accessoryBrand ? [['Marque', listing.accessoryBrand]] : []),
                  ...(listing.accessorySize ? [['Taille', listing.accessorySize]] : []),
                  ...(listing.accessoryColor ? [['Couleur', listing.accessoryColor]] : []),
                  ['Ville', listing.city],
                  ['État', listing.condition],
                ].map(([k, v]) => (
                  <Grid key={k} size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ px: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{k}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{v}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>Description</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.secondary' }}>
                {listing.description}
              </Typography>
              {(listing.maintenanceInfo || listing.papersInfo || listing.modifications) && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <Grid container spacing={2}>
                    {listing.maintenanceInfo && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }} gutterBottom>Entretien</Typography>
                        <Typography variant="body2" color="text.secondary">{listing.maintenanceInfo}</Typography>
                      </Grid>
                    )}
                    {listing.papersInfo && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }} gutterBottom>Papiers</Typography>
                        <Typography variant="body2" color="text.secondary">{listing.papersInfo}</Typography>
                      </Grid>
                    )}
                    {listing.modifications && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }} gutterBottom>Modifications</Typography>
                        <Typography variant="body2" color="text.secondary">{listing.modifications}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </Paper>
          </Grid>

          {/* Colonne latérale */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 96 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip label={listing.condition} size="small" />
                  <Chip label={getTypeLabel(listing.type)} size="small" variant="outlined" />
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {listing.title}
                </Typography>
                {listing.brand && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {listing.brand.name} {listing.model?.name ?? ''}
                  </Typography>
                )}
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, color: 'text.secondary', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{listing.city}{listing.district ? `, ${listing.district}` : ''}</Typography>
                </Stack>
                <Typography variant="h4" color="secondary.main" sx={{ mt: 2, fontWeight: 800 }}>
                  {formatPrice(listing.price)}
                </Typography>
                {listing.isPriceNegotiable && (
                  <Chip label="Prix négociable" size="small" color="success" variant="outlined" sx={{ mt: 1 }} />
                )}
                <Divider sx={{ my: 2.5 }} />
                <Button variant="contained" color="secondary" fullWidth size="large" startIcon={<MessageIcon />} sx={{ mb: 1.5 }}>
                  Contacter le vendeur
                </Button>
                <Stack direction="row" spacing={1.5}>
                  <Button variant="outlined" fullWidth startIcon={<PhoneIcon />}>
                    Appeler
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<FavoriteIcon />}>
                    Sauvegarder
                  </Button>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
                  Répond généralement en moins de 2 heures
                </Typography>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Avatar sx={{ width: 52, height: 52, bgcolor: 'secondary.main', fontWeight: 800 }}>
                    {listing.seller.firstName?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {listing.seller.businessName || `${listing.seller.firstName}`}
                      </Typography>
                      {listing.seller.isVerifiedSeller && <VerifiedIcon fontSize="small" color="secondary" />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      ★ {listing.seller.averageRating?.toFixed(1) ?? '—'} · {listing.seller.sellerType === 'PROFESSIONAL' ? 'Professionnel' : 'Particulier'}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {listing.seller.isVerifiedSeller && <Chip label="Vérifié" size="small" color="success" />}
                  {listing.seller.sellerType === 'PROFESSIONAL' && <Chip label="Pro" size="small" color="secondary" variant="outlined" />}
                </Stack>
                <Button fullWidth sx={{ mt: 2 }} component={Link} to="/search">
                  Voir ses annonces
                </Button>
              </Paper>

              <Paper sx={{ p: 2.5, color: '#fff', background: 'linear-gradient(135deg,#1E293B,#4C1D95)' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <VerifiedIcon />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Conseil sécurité : ne payez jamais avant d'avoir vu l'article en personne.
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
