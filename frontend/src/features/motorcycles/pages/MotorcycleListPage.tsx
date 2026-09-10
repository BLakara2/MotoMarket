import { useState } from 'react';
import { Container, Typography, Grid, TextField, MenuItem, Box, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import MotorcycleCard from '../components/MotorcycleCard';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import EmptyState from '../../../components/common/EmptyState';
import type { MotorcycleSummary, PaginatedResponse } from '../../../types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récent' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'mileage_asc', label: 'Kilométrage croissant' },
  { value: 'year_desc', label: 'Année décroissante' },
];

export default function MotorcycleListPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['motorcycles', { page, sort, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      params.set('sort', sort);
      if (search) params.set('search', search);
      const response = await api.get<PaginatedResponse<MotorcycleSummary>>(
        `/motorcycles?${params.toString()}`
      );
      return response.data;
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Rechercher une moto
      </Typography>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
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
          title="Aucune moto trouvée"
          description="Essayez de modifier vos filtres de recherche."
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {data.data.map((motorcycle) => (
              <Grid key={motorcycle.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MotorcycleCard motorcycle={motorcycle} />
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
