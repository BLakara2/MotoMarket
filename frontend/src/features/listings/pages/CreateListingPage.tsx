import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Grid,
  Button,
  MenuItem,
  Alert,
  Chip,
  Stack,
  Avatar,
  IconButton,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  TwoWheeler as MotoIcon,
  Build as PartIcon,
  Checkroom as AccessoryIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  ArrowForward as NextIcon,
  ArrowBack as BackIcon,
  CheckCircle as DoneIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';

const steps = ['Type', 'Photos', 'Informations', 'Prix', 'Localisation', 'Description', 'Prévisualisation'];

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 15;
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MOTORCYCLE_TYPES = ['CROSS', 'ROUTE', 'ROADSTER', 'SCOOTER', 'TRAIL', 'CUSTOM', 'AUTRE'];
const FUEL_TYPES = ['ESSENCE', 'DIELECTRIQUE', 'HYBRIDE', 'ELECTRIQUE'];
const TRANSMISSION_TYPES = ['MANUELLE', 'AUTOMATIQUE', 'SEMI_AUTO'];
const CONDITION_TYPES = ['NEUF', 'TRES_BON', 'BON', 'USAGE', 'A_REFORMER'];

interface PhotoItem {
  file: File;
  preview: string;
}

interface BrandMeta {
  id: string;
  name: string;
  models: Array<{ id: string; name: string }>;
}

interface CategoryMeta {
  id: string;
  name: string;
}

interface MetaResponse {
  brands: BrandMeta[];
  partCategories: CategoryMeta[];
  accessoryCategories: CategoryMeta[];
}

type ListingType = 'MOTORCYCLE' | 'PART' | 'ACCESSORY';

const EMPTY_FORM = {
  title: '',
  brandId: '',
  modelId: '',
  year: '',
  engineCc: '',
  mileage: '',
  motoCategory: '',
  fuel: '',
  transmission: '',
  partCategoryId: '',
  compatibleBrands: '',
  partReference: '',
  accessoryCategoryId: '',
  accessoryBrand: '',
  accessorySize: '',
  accessoryColor: '',
  condition: '',
  price: '',
  negotiable: false,
  city: '',
  district: '',
  description: '',
  maintenanceInfo: '',
  papersInfo: '',
  modifications: '',
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [listingType, setListingType] = useState<ListingType>('MOTORCYCLE');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [stepError, setStepError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitStage, setSubmitStage] = useState<'idle' | 'creating' | 'uploading' | 'publishing'>('idle');

  const isSubmitting = submitStage !== 'idle';

  // Redirige vers login si non connecté (la publication exige un compte)
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  // Libère les object URLs à la destruction
  const photosRef = useRef<PhotoItem[]>([]);
  photosRef.current = photos;
  useEffect(() => {
    const ref = photosRef;
    return () => {
      ref.current.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, []);

  const { data: meta } = useQuery({
    queryKey: ['listings-meta'],
    queryFn: async () => {
      const res = await api.get<MetaResponse>('/listings/meta');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const modelsForBrand = useMemo(() => {
    return meta?.brands.find((b) => b.id === form.brandId)?.models ?? [];
  }, [meta, form.brandId]);

  const set = (key: keyof typeof EMPTY_FORM, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setStepError('');
  };

  // ── Photos ──────────────────────────────────────────────
  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files);
    setStepError('');
    const valid: PhotoItem[] = [];
    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setStepError(`Format refusé : ${file.name} (JPG, PNG ou WebP uniquement)`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setStepError(`${file.name} dépasse 5 Mo`);
        continue;
      }
      valid.push({ file, preview: URL.createObjectURL(file) });
    }
    setPhotos((prev) => {
      const room = MAX_PHOTOS - prev.length;
      if (valid.length > room) {
        setStepError(`Maximum ${MAX_PHOTOS} photos — ${valid.length - room} ignorée(s)`);
      }
      return [...prev, ...valid.slice(0, room)];
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const setAsCover = (index: number) => {
    setPhotos((prev) => {
      if (index <= 0) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
  };

  // ── Validation par étape ────────────────────────────────
  const validateStep = (step: number): string => {
    if (step === 1 && photos.length < MIN_PHOTOS) {
      return `Ajoutez au moins ${MIN_PHOTOS} photos (15 max) pour publier.`;
    }
    if (step === 2) {
      if (form.title.trim().length < 5) return 'Titre trop court (5 caractères minimum).';
      if (!form.condition) return 'Sélectionnez l’état.';
      if (listingType === 'MOTORCYCLE') {
        if (!form.brandId) return 'Sélectionnez la marque.';
        if (!form.modelId) return 'Sélectionnez le modèle.';
        if (!form.year || Number(form.year) < 1950 || Number(form.year) > 2030) return 'Année invalide.';
        if (form.mileage === '' || Number(form.mileage) < 0) return 'Kilométrage invalide.';
        if (!form.engineCc || Number(form.engineCc) < 50) return 'Cylindrée invalide (50 cm³ min).';
      }
      if (listingType === 'PART' && !form.partCategoryId) return 'Sélectionnez la catégorie de pièce.';
      if (listingType === 'ACCESSORY' && !form.accessoryCategoryId) return 'Sélectionnez la catégorie.';
    }
    if (step === 3) {
      if (form.price === '' || Number(form.price) < 0) return 'Prix invalide.';
    }
    if (step === 4) {
      if (!form.city.trim()) return 'Ville requise.';
    }
    if (step === 5) {
      if (form.description.trim().length < 20) return 'Description trop courte (20 caractères minimum).';
    }
    return '';
  };

  const goNext = () => {
    const err = validateStep(activeStep);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError('');
    setActiveStep((s) => Math.min(steps.length - 1, s + 1));
  };

  // ── Soumission ──────────────────────────────────────────
  const buildPayload = () => ({
    type: listingType,
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    isPriceNegotiable: form.negotiable,
    condition: form.condition,
    city: form.city.trim(),
    district: form.district.trim() || undefined,
    ...(listingType === 'MOTORCYCLE'
      ? {
          brandId: form.brandId,
          modelId: form.modelId,
          motorcycleCategory: form.motoCategory || undefined,
          year: Number(form.year),
          mileage: Number(form.mileage),
          engineCc: Number(form.engineCc),
          fuel: form.fuel || undefined,
          transmission: form.transmission || undefined,
          maintenanceInfo: form.maintenanceInfo.trim() || undefined,
          papersInfo: form.papersInfo.trim() || undefined,
          modifications: form.modifications.trim() || undefined,
        }
      : {}),
    ...(listingType === 'PART'
      ? {
          partCategoryId: form.partCategoryId,
          compatibleBrands: form.compatibleBrands.trim() || undefined,
          partReference: form.partReference.trim() || undefined,
        }
      : {}),
    ...(listingType === 'ACCESSORY'
      ? {
          accessoryCategoryId: form.accessoryCategoryId,
          accessoryBrand: form.accessoryBrand.trim() || undefined,
          accessorySize: form.accessorySize.trim() || undefined,
          accessoryColor: form.accessoryColor.trim() || undefined,
        }
      : {}),
  });

  const uploadPhotos = async (listingId: string) => {
    if (photos.length === 0) return;
    const formData = new FormData();
    photos.forEach((p) => formData.append('images', p.file));
    await api.post(`/listings/${listingId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const handleSubmit = async (publish: boolean) => {
    // Vérifie toutes les étapes avant envoi
    for (let s = 1; s <= 5; s += 1) {
      const err = validateStep(s);
      if (err) {
        setActiveStep(s);
        setStepError(err);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setSubmitError('');
    try {
      setSubmitStage('creating');
      const { data: listing } = await api.post('/listings', buildPayload());

      setSubmitStage('uploading');
      await uploadPhotos(listing.id);

      if (publish) {
        setSubmitStage('publishing');
        await api.patch(`/listings/${listing.id}/status`, { status: 'ACTIVE' });
        navigate(`/listings/${listing.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string; errors?: Array<{ message: string }> } } };
      const details = apiError.response?.data?.errors?.map((e) => e.message).join(' · ');
      setSubmitError(details || apiError.response?.data?.message || 'Échec de la publication. Réessayez.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitStage('idle');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', mb: 2, width: 64, height: 64, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
          <LoginIcon />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 800 }} gutterBottom>
          Connectez-vous pour publier
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          La publication d'une annonce nécessite un compte MotoMarket.
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/login">
          Se connecter
        </Button>
      </Container>
    );
  }

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: ListingType | null) => {
    if (newType) setListingType(newType);
  };

  const stageLabel =
    submitStage === 'creating'
      ? 'Création de l’annonce…'
      : submitStage === 'uploading'
        ? `Envoi des photos (${photos.length})…`
        : submitStage === 'publishing'
          ? 'Publication…'
          : '';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Chip label="Publication gratuite" color="secondary" size="small" sx={{ mb: 1.5, fontWeight: 800 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
          Publier une annonce
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Suivez les étapes — votre annonce sera en ligne en moins de 2 minutes.
        </Typography>

        <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
          {isSubmitting && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress color="secondary" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>
                {stageLabel}
              </Typography>
            </Box>
          )}

          {submitError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}

          <Stepper activeStep={activeStep} alternativeLabel={isMobile} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{isMobile ? '' : label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {stepError && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setStepError('')}>
              {stepError}
            </Alert>
          )}

          <Box sx={{ py: 1 }}>
            {/* ÉTAPE 0 — Type */}
            {activeStep === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Que voulez-vous vendre ?
                </Typography>
                <ToggleButtonGroup
                  value={listingType}
                  exclusive
                  onChange={handleTypeChange}
                  fullWidth
                  sx={{ maxWidth: 600 }}
                >
                  <ToggleButton value="MOTORCYCLE" sx={{ flexDirection: 'column', py: 3 }}>
                    <MotoIcon sx={{ mb: 1 }} />
                    Moto
                  </ToggleButton>
                  <ToggleButton value="PART" sx={{ flexDirection: 'column', py: 3 }}>
                    <PartIcon sx={{ mb: 1 }} />
                    Pièce détachée
                  </ToggleButton>
                  <ToggleButton value="ACCESSORY" sx={{ flexDirection: 'column', py: 3 }}>
                    <AccessoryIcon sx={{ mb: 1 }} />
                    Accessoire
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}

            {/* ÉTAPE 1 — Photos (dropzone fonctionnelle) */}
            {activeStep === 1 && (
              <Box>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Ajoutez vos photos
                  </Typography>
                  <Chip
                    label={`${photos.length}/${MAX_PHOTOS}`}
                    color={photos.length >= MIN_PHOTOS ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </Stack>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Minimum {MIN_PHOTOS} photos, maximum {MAX_PHOTOS}. Formats : JPG, PNG, WebP (5 Mo max).
                  La première photo sera la couverture.
                </Typography>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  multiple
                  hidden
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = '';
                  }}
                />

                <Box
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
                  }}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragging ? 'secondary.main' : 'divider',
                    bgcolor: isDragging ? 'rgba(124,58,237,0.06)' : 'background.default',
                    borderRadius: 4,
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                    '&:hover': { borderColor: 'secondary.main', bgcolor: 'rgba(124,58,237,0.04)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '20px',
                      mx: 'auto',
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                      color: '#fff',
                    }}
                  >
                    <UploadIcon fontSize="large" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {isDragging ? 'Déposez vos photos ici' : 'Glissez vos photos ici ou cliquez pour sélectionner'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    JPG, PNG ou WebP · 5 Mo max par photo
                  </Typography>
                </Box>

                {photos.length > 0 && (
                  <Grid container spacing={1.5} sx={{ mt: 2 }}>
                    {photos.map((photo, i) => (
                      <Grid key={photo.preview} size={{ xs: 4, sm: 3 }}>
                        <Box
                          sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: i === 0 ? '2.5px solid #7C3AED' : '1px solid',
                            borderColor: i === 0 ? '#7C3AED' : 'divider',
                            aspectRatio: '4/3',
                          }}
                        >
                          <img
                            src={photo.preview}
                            alt={`Photo ${i + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {i === 0 && (
                            <Chip
                              label="Couverture"
                              size="small"
                              color="secondary"
                              sx={{ position: 'absolute', top: 6, left: 6, fontWeight: 800, fontSize: '0.65rem' }}
                            />
                          )}
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ position: 'absolute', bottom: 6, right: 6 }}
                          >
                            {i !== 0 && (
                              <IconButton
                                size="small"
                                title="Définir comme couverture"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAsCover(i);
                                }}
                                sx={{ bgcolor: 'rgba(255,255,255,0.92)', '&:hover': { color: 'secondary.main', bgcolor: '#fff' } }}
                              >
                                <StarIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              title="Supprimer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePhoto(i);
                              }}
                              sx={{ bgcolor: 'rgba(255,255,255,0.92)', '&:hover': { color: 'error.main', bgcolor: '#fff' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* ÉTAPE 2 — Informations */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                  Informations sur {listingType === 'MOTORCYCLE' ? 'la moto' : listingType === 'PART' ? 'la pièce' : "l'accessoire"}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Titre" fullWidth required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex : Yamaha MT-07 2022, excellent état" />
                  </Grid>

                  {listingType === 'MOTORCYCLE' && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Marque" fullWidth required value={form.brandId} onChange={(e) => { set('brandId', e.target.value); set('modelId', ''); }}>
                          {(meta?.brands ?? []).map((b) => (
                            <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Modèle" fullWidth required value={form.modelId} onChange={(e) => set('modelId', e.target.value)} disabled={!form.brandId}>
                          {modelsForBrand.map((m) => (
                            <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Année" type="number" fullWidth required value={form.year} onChange={(e) => set('year', e.target.value)} slotProps={{ htmlInput: { min: 1950, max: 2030 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Cylindrée (cm³)" type="number" fullWidth required value={form.engineCc} onChange={(e) => set('engineCc', e.target.value)} slotProps={{ htmlInput: { min: 50 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Kilométrage (km)" type="number" fullWidth required value={form.mileage} onChange={(e) => set('mileage', e.target.value)} slotProps={{ htmlInput: { min: 0 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Type de moto" fullWidth value={form.motoCategory} onChange={(e) => set('motoCategory', e.target.value)}>
                          {MOTORCYCLE_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Carburant" fullWidth value={form.fuel} onChange={(e) => set('fuel', e.target.value)}>
                          {FUEL_TYPES.map((f) => (
                            <MenuItem key={f} value={f}>{f}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Transmission" fullWidth value={form.transmission} onChange={(e) => set('transmission', e.target.value)}>
                          {TRANSMISSION_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </>
                  )}

                  {listingType === 'PART' && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Catégorie de pièce" fullWidth required value={form.partCategoryId} onChange={(e) => set('partCategoryId', e.target.value)}>
                          {(meta?.partCategories ?? []).map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Marques compatibles" fullWidth value={form.compatibleBrands} onChange={(e) => set('compatibleBrands', e.target.value)} placeholder="Ex : Honda, Yamaha" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Référence" fullWidth value={form.partReference} onChange={(e) => set('partReference', e.target.value)} />
                      </Grid>
                    </>
                  )}

                  {listingType === 'ACCESSORY' && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select label="Catégorie" fullWidth required value={form.accessoryCategoryId} onChange={(e) => set('accessoryCategoryId', e.target.value)}>
                          {(meta?.accessoryCategories ?? []).map((c) => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Marque" fullWidth value={form.accessoryBrand} onChange={(e) => set('accessoryBrand', e.target.value)} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Taille" fullWidth value={form.accessorySize} onChange={(e) => set('accessorySize', e.target.value)} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Couleur" fullWidth value={form.accessoryColor} onChange={(e) => set('accessoryColor', e.target.value)} />
                      </Grid>
                    </>
                  )}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField select label="État" fullWidth required value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                      {CONDITION_TYPES.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ÉTAPE 3 — Prix */}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                  Prix
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Prix (Ar)" type="number" fullWidth required value={form.price} onChange={(e) => set('price', e.target.value)} slotProps={{ htmlInput: { min: 0 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Checkbox checked={form.negotiable} onChange={(e) => set('negotiable', e.target.checked)} color="secondary" />}
                      label="Prix négociable"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ÉTAPE 4 — Localisation */}
            {activeStep === 4 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                  Localisation
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Ville" fullWidth required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Ex : Antananarivo" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Quartier (optionnel)" fullWidth value={form.district} onChange={(e) => set('district', e.target.value)} />
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  L'adresse exacte ne sera pas rendue publique.
                </Typography>
              </Box>
            )}

            {/* ÉTAPE 5 — Description */}
            {activeStep === 5 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                  Description
                </Typography>
                <TextField
                  label="Description"
                  multiline
                  rows={6}
                  fullWidth
                  required
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Décrivez votre article en détail… (20 caractères min)"
                  sx={{ mb: 2 }}
                  helperText={`${form.description.trim().length}/20 caractères min`}
                />

                {listingType === 'MOTORCYCLE' && (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Entretien" multiline rows={2} fullWidth value={form.maintenanceInfo} onChange={(e) => set('maintenanceInfo', e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Papiers disponibles" multiline rows={2} fullWidth value={form.papersInfo} onChange={(e) => set('papersInfo', e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField label="Modifications" multiline rows={2} fullWidth value={form.modifications} onChange={(e) => set('modifications', e.target.value)} />
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}

            {/* ÉTAPE 6 — Prévisualisation */}
            {activeStep === 6 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
                  Prévisualisation
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Voici comment votre annonce apparaîtra aux acheteurs.
                </Typography>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, bgcolor: 'background.default' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                    <Box
                      sx={{
                        width: { sm: 220 },
                        height: 160,
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'grey.200',
                        flexShrink: 0,
                      }}
                    >
                      {photos[0] ? (
                        <img src={photos[0].preview} alt="couverture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MotoIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label={listingType === 'MOTORCYCLE' ? 'Moto' : listingType === 'PART' ? 'Pièce' : 'Accessoire'} size="small" color="secondary" />
                        {form.condition && <Chip label={form.condition} size="small" variant="outlined" />}
                        <Chip label={`${photos.length} photo(s)`} size="small" variant="outlined" color={photos.length >= MIN_PHOTOS ? 'success' : 'default'} />
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {form.title || 'Sans titre'}
                      </Typography>
                      <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 800 }}>
                        {form.price ? `${new Intl.NumberFormat('fr-MG').format(Number(form.price))} Ar` : '—'}
                        {form.negotiable ? ' · négociable' : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {form.city || '—'}{form.district ? `, ${form.district}` : ''}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip icon={<DoneIcon />} label="Infos complètes" size="small" color="success" variant="outlined" />
                    <Chip
                      icon={<DoneIcon />}
                      label={photos.length >= MIN_PHOTOS ? 'Photos OK' : `Plus que ${MIN_PHOTOS - photos.length} photo(s)`}
                      size="small"
                      color={photos.length >= MIN_PHOTOS ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Stack>
                </Paper>
              </Box>
            )}
          </Box>

          {/* Navigation */}
          <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 4 }}>
            <Button variant="outlined" startIcon={<BackIcon />} disabled={activeStep === 0 || isSubmitting} onClick={() => { setStepError(''); setActiveStep((s) => Math.max(0, s - 1)); }}>
              Retour
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep === steps.length - 1 ? (
                <>
                  <Button variant="outlined" disabled={isSubmitting} onClick={() => handleSubmit(false)}>
                    Enregistrer brouillon
                  </Button>
                  <Button variant="contained" color="secondary" disabled={isSubmitting} onClick={() => handleSubmit(true)}>
                    {isSubmitting ? stageLabel || 'Publication…' : 'Publier'}
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="secondary" endIcon={<NextIcon />} disabled={isSubmitting} onClick={goNext}>
                  Suivant
                </Button>
              )}
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
