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
import api from '../../../services/api';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import type { Motorcycle } from '../../../types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' Ar';
}

export default function MotorcycleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: motorcycle, isLoading, error } = useQuery({
    queryKey: ['motorcycle', id],
    queryFn: async () => {
      const response = await api.get<Motorcycle>(`/motorcycles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage />;
  if (!motorcycle) return <ErrorMessage message="Annonce non trouvée" />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Images */}
        <Grid size={{ xs: 12, md: 8 }}>
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
            <Typography color="text.secondary">Photo principale</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
            {motorcycle.images.map((img) => (
              <Box
                key={img.id}
                sx={{
                  width: 80,
                  height: 60,
                  bgcolor: 'grey.300',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Infos */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={motorcycle.condition} size="small" />
              <Chip label={motorcycle.type} size="small" variant="outlined" />
            </Box>

            <Typography variant="h4" fontWeight={700} gutterBottom>
              {motorcycle.brand.name} {motorcycle.model.name}
            </Typography>

            <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>
              {formatPrice(motorcycle.price)}
            </Typography>

            {motorcycle.isPriceNegotiable && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Prix négociable
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <YearIcon fontSize="small" color="action" />
                <Typography>{motorcycle.year}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MileageIcon fontSize="small" color="action" />
                <Typography>{new Intl.NumberFormat('fr-FR').format(motorcycle.mileage)} km</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FuelIcon fontSize="small" color="action" />
                <Typography>{motorcycle.fuel}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TransmissionIcon fontSize="small" color="action" />
                <Typography>{motorcycle.transmission}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography>{motorcycle.city}{motorcycle.district ? `, ${motorcycle.district}` : ''}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

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
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {motorcycle.description}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
