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
  Stack,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  TwoWheeler as MotoIcon,
  Shield as ShieldIcon,
  Bolt as BoltIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.user, response.data.accessToken, response.data.refreshToken);
      navigate('/');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, minHeight: 'calc(100vh - 120px)' }}>
      {/* Panneau branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(140deg, #0F172A 0%, #2E1065 55%, #5B21B6 100%)',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(500px 300px at 80% 10%, rgba(167,139,250,0.35), transparent), url(https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop) center/cover', opacity: 0.28 }} />
        <Box sx={{ position: 'relative' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <MotoIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>MotoMarket</Typography>
          </Stack>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, maxWidth: 440, lineHeight: 1.15 }}>
            Bon retour parmi les motards.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.75)', maxWidth: 400 }}>
            Retrouvez vos favoris, vos messages et vos annonces là où vous les aviez laissés.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 4 }}>
            {[
              [ShieldIcon, 'Compte protégé et données chiffrées'],
              [BoltIcon, 'Alertes instantanées sur vos recherches'],
              [StarIcon, 'Vendeurs notés par la communauté'],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof ShieldIcon;
              return (
                <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: 'center', bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, p: 1.5 }}>
                  <I fontSize="small" sx={{ color: '#C4B5FD' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{label as string}</Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>
        <Typography variant="caption" sx={{ position: 'relative', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 MotoMarket Madagascar
        </Typography>
      </Box>

      {/* Formulaire */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 }, bgcolor: 'background.default' }}>
        <Paper sx={{ p: { xs: 3.5, md: 5 }, width: '100%', maxWidth: 460 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Connexion</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Ravi de vous revoir. Connectez-vous pour continuer.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
              {...register('password')}
              label="Mot de passe"
              type={showPw ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end">
                        {showPw ? <HideIcon fontSize="small" /> : <ShowIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="body2" sx={{ textAlign: 'right', mt: 0.5 }}>
              <Link component={RouterLink} to="/login" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                Mot de passe oublié ?
              </Link>
            </Typography>
            <Button type="submit" variant="contained" color="secondary" fullWidth size="large" disabled={isLoading} sx={{ mt: 2.5 }}>
              {isLoading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>ou</Divider>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Pas encore de compte ?{' '}
            <Link component={RouterLink} to="/register" sx={{ fontWeight: 800, color: 'secondary.main' }}>
              Créer un compte gratuitement
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
