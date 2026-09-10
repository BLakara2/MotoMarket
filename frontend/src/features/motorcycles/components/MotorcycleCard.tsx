import { Card, CardMedia, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { FavoriteBorder as FavoriteIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { MotorcycleSummary } from '../../../types';

interface MotorcycleCardProps {
  motorcycle: MotorcycleSummary;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' Ar';
}

function formatMileage(km: number): string {
  return new Intl.NumberFormat('fr-FR').format(km) + ' km';
}

export default function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={motorcycle.primaryImage?.url || '/placeholder-moto.jpg'}
          alt={motorcycle.title}
        />
        {motorcycle.isFeatured && (
          <Chip
            label="Sponsorisé"
            color="secondary"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'grey.100' },
          }}
          size="small"
        >
          <FavoriteIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h6" fontWeight={600} component={Link} to={`/motorcycles/${motorcycle.id}`}>
          {motorcycle.brand.name} {motorcycle.model.name}
        </Typography>

        <Typography variant="h6" color="primary" fontWeight={700}>
          {formatPrice(motorcycle.price)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {motorcycle.year} • {formatMileage(motorcycle.mileage)} • {motorcycle.engineCc} cc
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {motorcycle.city}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          {motorcycle.seller.isVerifiedSeller && (
            <Chip label="Vérifié" size="small" color="success" variant="outlined" />
          )}
          {motorcycle.seller.sellerType === 'PROFESSIONAL' && (
            <Chip label="Pro" size="small" color="primary" variant="outlined" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
