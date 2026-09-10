import { useState } from 'react';
import { Container, Typography, Grid, TextField, MenuItem, Box, Pagination, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import ListingCard from '../components/ListingCard';
import Loading from '../../../components/common/Loading';
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

export default function ListingListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
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

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        {getPageTitle()}
      </Typography>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={typeFilter}
          exclusive
          onChange={handleTypeChange}
          size="small"
          color="primary"
        >
          {TYPE_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <TextField
          label="Rechercher"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ minWidth: 250 }}
        />
        <TextField
          select
          label="Trier par"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Résultats */}
      {!data?.data.length ? (
        <EmptyState
          title="Aucune annonce trouvée"
          description="Essayez de modifier vos filtres de recherche."
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {data.pagination.total} annonce{data.pagination.total > 1 ? 's' : ''} trouvée{data.pagination.total > 1 ? 's' : ''}
          </Typography>

          <Grid container spacing={3}>
            {data.data.map((listing) => (
              <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={data.pagination.totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
}
