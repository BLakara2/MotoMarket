import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  Grid,
  Stack,
  InputAdornment,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  TwoWheeler as MotoIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function passwordStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s += 30;
  if (/[A-Z]/.test(pw)) s += 20;
  if (/[0-9]/.test(pw)) s += 25;
  if (/[^A-Za-z0-9]/.test(pw)) s += 25;
  return Math.min(s, 100);
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const pw = watch('password') || '';
  const strength = passwordStrength(pw);

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = data;
      void confirmPassword;
      const response = await api.post('/auth/register', submitData);
      login(response.data.user, response.data.accessToken, response.data.refreshToken);
      navigate('/');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' }, minHeight: 'calc(100vh - 120px)' }}>
      {/* Formulaire */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 }, bgcolor: 'background.default', order: { xs: 2, md: 1 } }}>
        <Paper sx={{ p: { xs: 3.5, md: 5 }, width: '100%', maxWidth: 560 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Créer un compte</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Gratuit, en moins d'une minute. Publiez votre première annonce aujourd'hui.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  {...register('firstName')}
                  label="Prénom"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment> } }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  {...register('lastName')}
                  label="Nom"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
            </Grid>
            <TextField
              {...register('email')}
              label="Adresse email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment> } }}
            />
            <TextField
              {...register('phone')}
              label="Téléphone (optionnel)"
              fullWidth
              margin="normal"
              placeholder="+261 …"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" color="action" /></InputAdornment> } }}
            />
            <TextField
              {...register('password')}
              label="Mot de passe"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message || '8 caractères min, avec majuscule et chiffre de préférence'}
              autoComplete="new-password"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment> } }}
            />
            {pw && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strength}
                  sx={{ height: 6, borderRadius: 999, bgcolor: 'divider', '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: strength < 50 ? 'error.main' : strength < 80 ? 'warning.main' : 'success.main' } }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Force du mot de passe : {strength < 50 ? 'faible' : strength < 80 ? 'moyen' : 'fort'}
                </Typography>
              </Box>
            )}
            <TextField
              {...register('confirmPassword')}
              label="Confirmer le mot de passe"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
            <Button type="submit" variant="contained" color="secondary" fullWidth size="large" disabled={isLoading} sx={{ mt: 3 }}>
              {isLoading ? 'Création…' : 'Créer mon compte'}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
              En vous inscrivant, vous acceptez nos CGU et notre politique de confidentialité.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }}>ou</Divider>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Déjà un compte ?{' '}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 800, color: 'secondary.main' }}>
              Se connecter
            </Link>
          </Typography>
        </Paper>
      </Box>

      {/* Panneau branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          p: 6,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          order: 2,
          background: 'linear-gradient(140deg, #0F172A 0%, #2E1065 55%, #5B21B6 100%)',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1200&auto=format&fit=crop) center/cover', opacity: 0.25 }} />
        <Box sx={{ position: 'relative' }}>
          <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: 'center' }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <MotoIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Rejoignez 25 000 motards</Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 800, maxWidth: 460, lineHeight: 1.15 }}>
            Vendez plus vite, achetez en confiance.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 4, maxWidth: 440 }}>
            {['Publication gratuite en 2 minutes', 'Badge vérifié et annonces mises en avant', 'Messagerie sécurisée sans spam'].map((t) => (
              <Stack key={t} direction="row" spacing={1.5} sx={{ alignItems: 'center', bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, p: 1.5 }}>
                <CheckIcon fontSize="small" sx={{ color: '#A78BFA' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{t}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
