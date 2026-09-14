import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Pagination,
  Paper,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import ListingCard from '../components/ListingCard';
import ErrorMessage from '../../../components/common/ErrorMessage';
import EmptyState from '../../../components/common/EmptyState';
import type { ListingSummary, PaginatedResponse, ListingType } from '../../../types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récent' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'mileage_asc', label: 'Kilométrage croissant' },
  { value: 'year_desc', label: 'Année décroissante' },
];

const TYPE_OPTIONS: Array<{ value: ListingType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Tout' },
  { value: 'MOTORCYCLE', label: 'Motos' },
  { value: 'PART', label: 'Pièces' },
  { value: 'ACCESSORY', label: 'Accessoires' },
];

const QUICK_FILTERS = ['Vérifiées', 'Pro', 'Sponsorisé', 'Négociable'];

export default function ListingListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [quick, setQuick] = useState<string | null>(null);
  const typeFilter = (searchParams.get('type') as ListingType | 'ALL') || 'ALL';

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: ListingType | 'ALL') => {
    if (newType !== null) {
      const params = new URLSearchParams(searchParams);
      if (newType === 'ALL') {
        params.delete('type');
      } else {
        params.set('type', newType);
      }
      setSearchParams(params);
      setPage(1);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['listings', { page, sort, search, type: typeFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      params.set('sort', sort);
      if (search) params.set('search', search);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      const response = await api.get<PaginatedResponse<ListingSummary>>(
        `/listings?${params.toString()}`
      );
      return response.data;
    },
  });

  const getPageTitle = () => {
    switch (typeFilter) {
      case 'MOTORCYCLE': return 'Motos';
      case 'PART': return 'Pièces détachées';
      case 'ACCESSORY': return 'Accessoires';
      default: return 'Toutes les annonces';
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }}>
          <Box>
            <Chip label={`${data?.pagination.total ?? '—'} annonces`} color="secondary" size="small" sx={{ mb: 1.5, fontWeight: 800 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.9rem', md: '2.5rem' } }}>
              {getPageTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Motos, pièces et accessoires — filtrez et trouvez la perle rare.
            </Typography>
          </Box>
        </Stack>

        {/* Barre de filtres */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 4, display: 'flex', gap: 1.5, flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' } }}>
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={handleTypeChange}
            size="small"
            color="secondary"
            sx={{ flexShrink: 0 }}
          >
            {TYPE_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value} sx={{ fontWeight: 700, px: 2 }}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField
            fullWidth
            placeholder="Rechercher une marque, un modèle, une pièce…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              },
            }}
          />
          <TextField
            select
            label="Trier par"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: { md: 230 } }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Paper>

        <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 0.5 }}>
          {QUICK_FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              clickable
              onClick={() => setQuick(quick === f ? null : f)}
              color={quick === f ? 'secondary' : 'default'}
              variant={quick === f ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700, flexShrink: 0 }}
            />
          ))}
        </Stack>

        {/* Résultats */}
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Paper sx={{ overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={210} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton width="70%" height={28} />
                    <Skeleton width="50%" height={24} />
                    <Skeleton width="90%" />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <ErrorMessage onRetry={() => refetch()} />
        ) : !data?.data.length ? (
          <Paper sx={{ py: 4 }}>
            <EmptyState
              title="Aucune annonce trouvée"
              description="Essayez de modifier vos filtres ou lancez une nouvelle recherche."
              action={{ label: 'Réinitialiser les filtres', onClick: () => { setSearch(''); setSort('newest'); setPage(1); setSearchParams({}); } }}
            />
          </Paper>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              {data.pagination.total} annonce{data.pagination.total > 1 ? 's' : ''} trouvée{data.pagination.total > 1 ? 's' : ''}
            </Typography>
            <Grid container spacing={3}>
              {data.data.map((listing) => (
                <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ListingCard listing={listing} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={data.pagination.totalPages}
                page={page}
                onChange={(_, newPage) => { setPage(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                color="secondary"
                size="large"
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
