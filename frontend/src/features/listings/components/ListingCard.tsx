import { Card, CardMedia, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { FavoriteBorder as FavoriteIcon, LocationOn as LocationIcon, TwoWheeler as MotoIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFileUrl } from '../../../services/api';
import type { ListingSummary } from '../../../types';

interface ListingCardProps {
  listing: ListingSummary;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' Ar';
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'MOTORCYCLE': return 'Moto';
    case 'PART': return 'Pièce';
    case 'ACCESSORY': return 'Accessoire';
    default: return type;
  }
}

function getTypeColor(type: string): 'primary' | 'secondary' | 'info' {
  switch (type) {
    case 'MOTORCYCLE': return 'primary';
    case 'PART': return 'secondary';
    case 'ACCESSORY': return 'info';
    default: return 'primary';
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform .25s ease, box-shadow .25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 8,
        },
        '&:hover .MuiCardMedia-root': {
          transform: 'scale(1.07)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {listing.primaryImage ? (
          <CardMedia
            component="img"
            height="200"
            image={getFileUrl(listing.primaryImage.url)}
            alt={listing.title}
            sx={{ transition: 'transform .6s cubic-bezier(.22,.61,.36,1)' }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(135deg, rgba(14,77,58,.12) 0%, rgba(255,122,0,.1) 100%)',
              color: 'primary.main',
            }}
          >
            <MotoIcon sx={{ fontSize: 72, opacity: 0.45 }} />
          </Box>
        )}
        <Chip
          label={getTypeLabel(listing.type)}
          color={getTypeColor(listing.type)}
          size="small"
          sx={{ position: 'absolute', top: 8, left: 8 }}
        />
        {listing.isFeatured && (
          <Chip
            label="Sponsorisé"
            color="secondary"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 80 }}
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
        <Typography
          variant="h6"
          component={Link}
          to={`/listings/${listing.id}`}
          sx={{ fontWeight: 600, textDecoration: 'none', color: 'inherit' }}
        >
          {listing.title}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          {formatPrice(listing.price)}
        </Typography>

        {listing.type === 'MOTORCYCLE' && listing.brand && (
          <Typography variant="body2" color="text.secondary">
            {listing.brand.name} {listing.model?.name} • {listing.year} • {listing.mileage ? `${new Intl.NumberFormat('fr-FR').format(listing.mileage)} km` : ''} {listing.engineCc ? `• ${listing.engineCc} cc` : ''}
          </Typography>
        )}

        {listing.type === 'PART' && listing.partCategory && (
          <Typography variant="body2" color="text.secondary">
            {listing.partCategory.name}
            {listing.compatibleBrands && ` • Compatible: ${listing.compatibleBrands}`}
          </Typography>
        )}

        {listing.type === 'ACCESSORY' && listing.accessoryCategory && (
          <Typography variant="body2" color="text.secondary">
            {listing.accessoryCategory.name}
            {listing.accessorySize && ` • Taille: ${listing.accessorySize}`}
            {listing.accessoryColor && ` • ${listing.accessoryColor}`}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {listing.city}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Chip label={listing.condition} size="small" variant="outlined" />
          {listing.seller.isVerifiedSeller && (
            <Chip label="Vérifié" size="small" color="success" variant="outlined" />
          )}
          {listing.seller.sellerType === 'PROFESSIONAL' && (
            <Chip label="Pro" size="small" color="primary" variant="outlined" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
