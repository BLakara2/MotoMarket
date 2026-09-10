import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Chip, Button, Divider, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  LocationOn as LocationIcon,
  CalendarToday as YearIcon,
  Speed as MileageIcon,
  LocalGasStation as FuelIcon,
  Settings as TransmissionIcon,
} from '@mui/icons-material';
import api, { getFileUrl } from '../../../services/api';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import type { Listing } from '../../../types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' Ar';
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

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage />;
  if (!listing) return <ErrorMessage message="Annonce non trouvée" />;

  const images = listing.images ?? [];
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Images */}
        <Grid size={{ xs: 12, md: 8 }}>
          {images.length > 0 ? (
            <>
              <Box
                component="img"
                src={getFileUrl(images[selectedImg].url)}
                alt={listing.title}
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: 2,
                  objectFit: 'cover',
                  bgcolor: 'grey.200',
                }}
              />
              {images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                  {images.map((img, idx) => (
                    <Box
                      key={img.id}
                      component="img"
                      src={getFileUrl(img.url)}
                      alt=""
                      onClick={() => setSelectedImg(idx)}
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: 1,
                        flexShrink: 0,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: idx === selectedImg ? '2px solid primary.main' : '2px solid transparent',
                        opacity: idx === selectedImg ? 1 : 0.6,
                      }}
                    />
                  ))}
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">Aucune photo</Typography>
            </Box>
          )}
        </Grid>

        {/* Infos */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={listing.condition} size="small" />
              {listing.brand && <Chip label={listing.brand.name} size="small" variant="outlined" />}
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              {listing.title}
            </Typography>

            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }} gutterBottom>
              {formatPrice(listing.price)}
            </Typography>

            {listing.isPriceNegotiable && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Prix négociable
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Infos spécifiques MOTO */}
            {listing.type === 'MOTORCYCLE' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {listing.year && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <YearIcon fontSize="small" color="action" />
                    <Typography>{listing.year}</Typography>
                  </Box>
                )}
                {listing.mileage != null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MileageIcon fontSize="small" color="action" />
                    <Typography>{new Intl.NumberFormat('fr-FR').format(listing.mileage)} km</Typography>
                  </Box>
                )}
                {listing.fuel && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FuelIcon fontSize="small" color="action" />
                    <Typography>{listing.fuel}</Typography>
                  </Box>
                )}
                {listing.transmission && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TransmissionIcon fontSize="small" color="action" />
                    <Typography>{listing.transmission}</Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Infos spécifiques PIÈCE */}
            {listing.type === 'PART' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {listing.partCategory && (
                  <Typography><strong>Catégorie :</strong> {listing.partCategory.name}</Typography>
                )}
                {listing.compatibleBrands && (
                  <Typography><strong>Marques compatibles :</strong> {listing.compatibleBrands}</Typography>
                )}
                {listing.partReference && (
                  <Typography><strong>Référence :</strong> {listing.partReference}</Typography>
                )}
              </Box>
            )}

            {/* Infos spécifiques ACCESSOIRE */}
            {listing.type === 'ACCESSORY' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {listing.accessoryCategory && (
                  <Typography><strong>Catégorie :</strong> {listing.accessoryCategory.name}</Typography>
                )}
                {listing.accessoryBrand && (
                  <Typography><strong>Marque :</strong> {listing.accessoryBrand}</Typography>
                )}
                {listing.accessorySize && (
                  <Typography><strong>Taille :</strong> {listing.accessorySize}</Typography>
                )}
                {listing.accessoryColor && (
                  <Typography><strong>Couleur :</strong> {listing.accessoryColor}</Typography>
                )}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography>{listing.city}{listing.district ? `, ${listing.district}` : ''}</Typography>
            </Box>

            <Button variant="contained" fullWidth size="large" sx={{ mb: 1 }}>
              Contacter le vendeur
            </Button>
            <Button variant="outlined" fullWidth>
              Ajouter aux favoris
            </Button>
          </Paper>
        </Grid>

        {/* Description */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
