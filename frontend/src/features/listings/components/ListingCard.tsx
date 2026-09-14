import { Card, CardMedia, CardContent, Typography, Box, IconButton, Chip, Stack, Avatar } from '@mui/material';
import { FavoriteBorder as FavoriteIcon, LocationOn as LocationIcon, Verified as VerifiedIcon, TwoWheeler as MotoIcon, Build as PartIcon, Checkroom as AccessoryIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFileUrl } from '../../../services/api';
import type { ListingSummary } from '../../../types';

interface ListingCardProps {
  listing: ListingSummary;
}

export function formatPrice(price: number): string {
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

function TypeIcon({ type }: { type: string }) {
  if (type === 'PART') return <PartIcon sx={{ fontSize: 56, opacity: 0.45 }} />;
  if (type === 'ACCESSORY') return <AccessoryIcon sx={{ fontSize: 56, opacity: 0.45 }} />;
  return <MotoIcon sx={{ fontSize: 72, opacity: 0.45 }} />;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const isMoto = listing.type === 'MOTORCYCLE';

  return (
    <Card
      component={Link}
      to={`/listings/${listing.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'transform .22s ease, box-shadow .22s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 48px -12px rgba(23,24,43,0.28)',
          '& .listing-img': { transform: 'scale(1.06)' },
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 210, overflow: 'hidden', bgcolor: 'grey.100' }}>
        {listing.primaryImage ? (
          <CardMedia
            className="listing-img"
            component="img"
            height="210"
            image={getFileUrl(listing.primaryImage.url)}
            alt={listing.title}
            sx={{ transition: 'transform .4s ease', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 210,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
              color: '#6D28D9',
            }}
          >
            <TypeIcon type={listing.type} />
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.25) 100%)',
            pointerEvents: 'none',
          }}
        />
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 10, left: 10 }}>
          <Chip label={getTypeLabel(listing.type)} color="secondary" size="small" sx={{ fontWeight: 800 }} />
          {isMoto && listing.year && (
            <Chip
              label={`${listing.year}`}
              size="small"
              sx={{ bgcolor: 'rgba(15,23,42,0.72)', color: '#fff', fontWeight: 800, backdropFilter: 'blur(6px)' }}
            />
          )}
        </Stack>
        {listing.isFeatured && (
          <Chip
            label="Sponsorisé"
            size="small"
            sx={{ position: 'absolute', top: 44, left: 10, bgcolor: '#0F172A', color: '#fff', fontWeight: 800 }}
          />
        )}
        <IconButton
          onClick={(e) => e.preventDefault()}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            '&:hover': { bgcolor: '#fff', color: 'secondary.main' },
          }}
          size="small"
          aria-label="favori"
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
        <Chip
          label={formatPrice(listing.price)}
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            bgcolor: 'rgba(255,255,255,0.96)',
            color: 'primary.main',
            fontWeight: 800,
            fontSize: '0.9rem',
            px: 0.5,
            py: 0.5,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, p: 2.2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
          {listing.title}
        </Typography>

        {isMoto && listing.brand ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {listing.brand.name} {listing.model?.name ?? ''}
            {listing.year ? ` • ${listing.year}` : ''}
            {listing.mileage != null ? ` • ${new Intl.NumberFormat('fr-FR').format(listing.mileage)} km` : ''}
            {listing.engineCc ? ` • ${listing.engineCc} cm³` : ''}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {listing.type === 'PART' && (
              <>
                {listing.partCategory?.name}
                {listing.compatibleBrands ? ` • ${listing.compatibleBrands}` : ''}
                {listing.partReference ? ` • Réf. ${listing.partReference}` : ''}
              </>
            )}
            {listing.type === 'ACCESSORY' && (
              <>
                {listing.accessoryCategory?.name}
                {listing.accessorySize ? ` • Taille ${listing.accessorySize}` : ''}
                {listing.accessoryColor ? ` • ${listing.accessoryColor}` : ''}
              </>
            )}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {listing.city}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {listing.seller.isVerifiedSeller && (
              <VerifiedIcon fontSize="small" color="secondary" />
            )}
            <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: 'secondary.main' }}>
              {listing.seller.firstName?.[0]?.toUpperCase()}
            </Avatar>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip label={listing.condition} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
          {listing.seller.isVerifiedSeller && (
            <Chip label="Vérifié" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
          )}
          {listing.seller.sellerType === 'PROFESSIONAL' && (
            <Chip label="Pro" size="small" color="secondary" variant="outlined" sx={{ fontWeight: 700 }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
