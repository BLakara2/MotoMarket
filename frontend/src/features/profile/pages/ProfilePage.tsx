import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Avatar,
  Chip,
  Button,
  TextField,
  Divider,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  Store as StoreIcon,
  Favorite as FavoriteIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import ErrorMessage from '../../../components/common/ErrorMessage';

interface SellerProfileData {
  type: string;
  businessName?: string | null;
  city: string;
  district?: string | null;
  description?: string | null;
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  avatar?: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isVerifiedSeller: boolean;
  verificationStatus: string;
  createdAt: string;
  sellerProfile?: SellerProfileData | null;
}

export default function ProfilePage() {
  const { setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<ProfileData>('/auth/me');
      return res.data;
    },
  });

  const [draft, setDraft] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    district: '',
    businessName: '',
    description: '',
  });

  const startEdit = () => {
    if (!profile) return;
    setDraft({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone ?? '',
      city: profile.sellerProfile?.city ?? '',
      district: profile.sellerProfile?.district ?? '',
      businessName: profile.sellerProfile?.businessName ?? '',
      description: profile.sellerProfile?.description ?? '',
    });
    setSaved(false);
    setSaveError('');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await api.put('/users/me', {
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        phone: draft.phone.trim(),
        city: draft.city.trim() || undefined,
        district: draft.district.trim(),
        businessName: draft.businessName.trim(),
        description: draft.description.trim(),
      });
      setUser({
        id: res.data.id,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        phone: res.data.phone,
        role: res.data.role,
        avatar: res.data.avatar,
        isPhoneVerified: res.data.isPhoneVerified,
        isEmailVerified: res.data.isEmailVerified,
        isVerifiedSeller: res.data.isVerifiedSeller,
        createdAt: res.data.createdAt,
      });
      refetch();
      setEditing(false);
      setSaved(true);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setSaveError(apiError.response?.data?.message || 'Échec de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rounded" height={220} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}><Skeleton variant="rounded" height={320} /></Grid>
          <Grid size={{ xs: 12, md: 5 }}><Skeleton variant="rounded" height={320} /></Grid>
        </Grid>
      </Container>
    );
  }
  if (error || !profile) return <Container maxWidth="lg" sx={{ py: 4 }}><ErrorMessage onRetry={() => refetch()} /></Container>;

  const isPro = profile.sellerProfile?.type === 'PROFESSIONAL' || profile.role !== 'USER';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Paper sx={{ p: { xs: 2.5, md: 4 }, mb: 3, position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(30,41,59,0.06) 0%, rgba(124,58,237,0.1) 100%)',
              pointerEvents: 'none',
            }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ position: 'relative', alignItems: { sm: 'center' } }}>
            <Avatar sx={{ width: 96, height: 96, fontSize: '2rem', bgcolor: 'secondary.main', fontWeight: 800 }}>
              {profile.firstName?.[0]?.toUpperCase()}{profile.lastName?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                {profile.isVerifiedSeller && <VerifiedIcon color="secondary" />}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {profile.sellerProfile?.businessName || profile.email}
                {profile.sellerProfile?.city ? ` · ${profile.sellerProfile.city}` : ''}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                {profile.isVerifiedSeller && <Chip label="Vendeur vérifié" size="small" color="success" />}
                {isPro && <Chip label={profile.role === 'ADMIN' ? 'Admin' : 'Pro'} size="small" color="secondary" />}
                {!profile.isEmailVerified && <Chip label="Email non vérifié" size="small" variant="outlined" color="warning" />}
              </Stack>
            </Box>
            {!editing ? (
              <Button variant="outlined" startIcon={<EditIcon />} onClick={startEdit} sx={{ flexShrink: 0 }}>
                Modifier
              </Button>
            ) : (
              <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditing(false)} disabled={saving}>
                  Annuler
                </Button>
                <Button variant="contained" color="secondary" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>

        {saveError && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{saveError}</Alert>}
        {saved && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>Profil mis à jour.</Alert>}

        <Grid container spacing={3}>
          {/* Infos personnelles */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                Informations personnelles
              </Typography>
              <Divider sx={{ mb: 2.5 }} />
              {!editing ? (
                <Grid container spacing={2}>
                  {[
                    { icon: <EmailIcon fontSize="small" color="action" />, label: 'Email', value: profile.email },
                    { icon: <PhoneIcon fontSize="small" color="action" />, label: 'Téléphone', value: profile.phone || '—' },
                    { icon: <CalendarIcon fontSize="small" color="action" />, label: 'Membre depuis', value: new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) },
                    { icon: <LocationIcon fontSize="small" color="action" />, label: 'Ville', value: `${profile.sellerProfile?.city ?? '—'}${profile.sellerProfile?.district ? `, ${profile.sellerProfile.district}` : ''}` },
                  ].map((row) => (
                    <Grid key={row.label} size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                        <Box sx={{ mt: 0.3 }}>{row.icon}</Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{row.label}</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>{row.value}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Prénom" fullWidth value={draft.firstName} onChange={(e) => setDraft({ ...draft, firstName: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Nom" fullWidth value={draft.lastName} onChange={(e) => setDraft({ ...draft, lastName: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Téléphone" fullWidth value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="+261 …" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Email (non modifiable)" fullWidth value={profile.email} disabled />
                  </Grid>
                </Grid>
              )}
            </Paper>

            {/* Profil vendeur */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'rgba(124,58,237,0.1)', color: 'secondary.main', width: 40, height: 40 }}>
                  <StoreIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Profil vendeur
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2.5 }} />
              {!editing ? (
                <Box>
                  {profile.sellerProfile?.businessName && (
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{profile.sellerProfile.businessName}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                    {profile.sellerProfile?.description || 'Aucune description pour le moment. Présentez-vous aux acheteurs pour inspirer confiance.'}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Ville" fullWidth value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Quartier" fullWidth value={draft.district} onChange={(e) => setDraft({ ...draft, district: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Nom commercial (optionnel)" fullWidth value={draft.businessName} onChange={(e) => setDraft({ ...draft, businessName: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Description" multiline rows={3} fullWidth value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Présentez-vous en quelques mots…" />
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Raccourcis */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                Mon activité
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                <Button variant="outlined" fullWidth startIcon={<DashboardIcon />} component={Link} to="/dashboard" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                  Tableau de bord vendeur
                </Button>
                <Button variant="outlined" fullWidth startIcon={<AddIcon />} component={Link} to="/dashboard/listings/new" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                  Publier une annonce
                </Button>
                <Button variant="outlined" fullWidth startIcon={<FavoriteIcon />} component={Link} to="/dashboard/favorites" sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                  Mes favoris
                </Button>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg,#1E293B,#4C1D95)', color: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Passez au niveau Pro</Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5, mb: 2 }}>
                Badge vérifié, annonces mises en avant et statistiques détaillées.
              </Typography>
              <Button variant="contained" color="secondary" fullWidth>
                Découvrir Pro
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
