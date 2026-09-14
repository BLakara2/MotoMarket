import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  TwoWheeler as MotoIcon,
  Build as PartIcon,
  Checkroom as AccessoryIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Box
      component={Link}
      to="/"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none' }}
    >
      <Box
        sx={{
          width: compact ? 36 : 42,
          height: compact ? 36 : 42,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E293B 0%, #4C1D95 55%, #7C3AED 130%)',
          boxShadow: '0 6px 18px rgba(76,29,149,0.35)',
          color: '#fff',
        }}
      >
        <MotoIcon fontSize={compact ? 'small' : 'medium'} />
      </Box>
      <Box sx={{ lineHeight: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary', fontSize: '1.15rem' }}
        >
          Moto<span style={{ color: '#7C3AED' }}>Market</span>
        </Typography>
        {!compact && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.14em', fontSize: '0.62rem' }}>
            MADAGASCAR
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const NAV_LINKS = [
  { text: 'Accueil', path: '/', icon: <HomeIcon /> },
  { text: 'Motos', path: '/search?type=MOTORCYCLE', icon: <MotoIcon /> },
  { text: 'Pièces', path: '/search?type=PART', icon: <PartIcon /> },
  { text: 'Accessoires', path: '/search?type=ACCESSORY', icon: <AccessoryIcon /> },
];

const PUBLISH_PATH = '/dashboard/listings/new';

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const currentKey = location.pathname + location.search;
  const isActive = (path: string) => {
    if (path === '/') return currentKey === '/';
    return currentKey === path || (path === '/search' && location.pathname === '/search');
  };

  const bottomValue = (() => {
    if (currentKey === '/') return 0;
    if (location.pathname === '/search') return 1;
    if (location.pathname.includes('/new')) return 2;
    if (location.pathname.includes('favorites')) return 3;
    return 4;
  })();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Logo compact />
        <IconButton onClick={() => setMobileOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 1.5 }} />
      <List sx={{ '& .MuiListItemButton-root': { borderRadius: 2, mb: 0.5 } }}>
        {NAV_LINKS.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
          </ListItemButton>
        ))}
        <ListItemButton component={Link} to="/search" selected={location.pathname === '/search' && !location.search} onClick={() => setMobileOpen(false)}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Tout parcourir" slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
        </ListItemButton>
      </List>
      {isAuthenticated && (
        <>
          <Divider sx={{ my: 1 }} />
          <List sx={{ '& .MuiListItemButton-root': { borderRadius: 2, mb: 0.5 } }}>
            <ListItemButton component={Link} to="/dashboard/favorites" onClick={() => setMobileOpen(false)}>
              <ListItemIcon><FavoriteIcon /></ListItemIcon>
              <ListItemText primary="Mes favoris" slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/messages" onClick={() => setMobileOpen(false)}>
              <ListItemIcon><MessageIcon /></ListItemIcon>
              <ListItemText primary="Messages" slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard" onClick={() => setMobileOpen(false)}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Tableau de bord" slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/profile" onClick={() => setMobileOpen(false)}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Mon profil" slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
            </ListItemButton>
          </List>
        </>
      )}
      <Divider sx={{ my: 1.5 }} />
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        size="large"
        startIcon={<AddIcon />}
        component={Link}
        to={PUBLISH_PATH}
        onClick={() => setMobileOpen(false)}
      >
        Publier une annonce
      </Button>
      {!isAuthenticated && (
        <Button fullWidth sx={{ mt: 1 }} component={Link} to="/login" onClick={() => setMobileOpen(false)}>
          Se connecter
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Bandeau promo */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #0F172A 0%, #4C1D95 60%, #1E1B34 100%)',
          color: '#fff',
          py: 0.7,
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.04em' }}>
          NOUVEAU — Motos, pièces & accessoires au même endroit
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {'  '}· Offre Pro avec badge vérifié
          </Box>
        </Typography>
      </Box>

      <AppBar
        position="sticky"
        color="inherit"
        sx={{
          backdropFilter: 'blur(16px)',
          backgroundColor: isDarkMode ? 'rgba(11,11,22,0.82)' : 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="menu">
                <MenuIcon />
              </IconButton>
            )}
            <Logo compact={isMobile} />

            {!isMobile && (
              <Stack direction="row" spacing={0.5} sx={{ ml: 3 }}>
                {NAV_LINKS.map((l) => (
                  <Button
                    key={l.text}
                    component={Link}
                    to={l.path}
                    sx={{
                      color: isActive(l.path) ? 'secondary.main' : 'text.secondary',
                      fontWeight: 700,
                      bgcolor: (t) =>
                        isActive(l.path)
                          ? t.palette.mode === 'light'
                            ? 'rgba(124,58,237,0.1)'
                            : 'rgba(139,92,246,0.16)'
                          : 'transparent',
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: (t) =>
                          t.palette.mode === 'light' ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    {l.text}
                  </Button>
                ))}
              </Stack>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={toggleTheme} aria-label="thème" sx={{ border: '1px solid', borderColor: 'divider' }}>
              {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

            {isAuthenticated ? (
              <>
                {!isMobile && (
                  <>
                    <IconButton component={Link} to="/dashboard/favorites" aria-label="favoris" sx={{ border: '1px solid', borderColor: 'divider' }}>
                      <Badge badgeContent={0} color="secondary">
                        <FavoriteIcon fontSize="small" />
                      </Badge>
                    </IconButton>
                    <IconButton component={Link} to="/dashboard/messages" aria-label="messages" sx={{ border: '1px solid', borderColor: 'divider' }}>
                      <Badge badgeContent={0} color="secondary">
                        <MessageIcon fontSize="small" />
                      </Badge>
                    </IconButton>
                  </>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  component={Link}
                  to={PUBLISH_PATH}
                  sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                >
                  Publier
                </Button>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: '0.9rem' }}>
                    {user?.firstName?.[0]?.toUpperCase() || <PersonIcon fontSize="small" />}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 220, mt: 1 } } }}>
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={Link} to="/dashboard" onClick={() => setAnchorEl(null)}>
                    <DashboardIcon fontSize="small" style={{ marginRight: 10 }} /> Tableau de bord
                  </MenuItem>
                  <MenuItem component={Link} to="/dashboard/profile" onClick={() => setAnchorEl(null)}>
                    <PersonIcon fontSize="small" style={{ marginRight: 10 }} /> Mon profil
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon fontSize="small" style={{ marginRight: 10 }} /> Déconnexion
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {!isMobile && (
                  <Button component={Link} to="/login" sx={{ color: 'text.primary' }}>
                    Se connecter
                  </Button>
                )}
                <Button variant="contained" color="secondary" component={Link} to="/register" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  Créer un compte
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to={PUBLISH_PATH}
                  sx={{ display: { xs: 'inline-flex', sm: 'none' }, minHeight: 40 }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320, borderRadius: '0 12px 12px 0' } }}
      >
        {drawerContent}
      </Drawer>

      {/* Contenu */}
      <Box component="main" className="page-enter" sx={{ flexGrow: 1, pb: { xs: 10, md: 0 } }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          background: isDarkMode ? '#0D0D1C' : '#14122B',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(600px 300px at 15% 0%, rgba(139,92,246,0.28), transparent), radial-gradient(600px 300px at 90% 20%, rgba(79,70,229,0.22), transparent)',
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', py: 7 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.4fr 1fr 1fr 1.2fr' },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff' }}>
                  <MotoIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>MotoMarket</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6, letterSpacing: '0.14em', fontWeight: 700 }}>MADAGASCAR</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.75, maxWidth: 320, lineHeight: 1.7 }}>
                La marketplace de confiance pour motos, pièces et accessoires à Madagascar.
                Annonces vérifiées, messagerie sécurisée, vendeurs notés.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
                <Chip label="Paiement sécurisé" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} />
                <Chip label="Vendeurs vérifiés" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} />
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, opacity: 0.9 }}>EXPLORER</Typography>
              <Stack spacing={1}>
                {[['Motos', '/search?type=MOTORCYCLE'], ['Pièces détachées', '/search?type=PART'], ['Accessoires', '/search?type=ACCESSORY'], ['Tout parcourir', '/search']].map(([label, to]) => (
                  <Typography key={label} component={Link} to={to} variant="body2" sx={{ opacity: 0.7, '&:hover': { opacity: 1, color: '#C4B5FD' } }}>
                    {label}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, opacity: 0.9 }}>MON COMPTE</Typography>
              <Stack spacing={1}>
                {[['Se connecter', '/login'], ["Créer un compte", '/register'], ['Messages', '/dashboard/messages'], ['Publier une annonce', PUBLISH_PATH]].map(([label, to]) => (
                  <Typography key={label} component={Link} to={to} variant="body2" sx={{ opacity: 0.7, '&:hover': { opacity: 1, color: '#C4B5FD' } }}>
                    {label}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                p: 3,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Vendez plus vite</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5, mb: 2 }}>
                Publiez en 2 minutes avec photos, recevez des contacts qualifiés aujourd'hui.
              </Typography>
              <Button variant="contained" color="secondary" fullWidth startIcon={<AddIcon />} component={Link} to={PUBLISH_PATH}>
                Publier gratuitement
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>© 2026 MotoMarket Madagascar — Tous droits réservés.</Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>Conçu avec passion pour les motards · Antananarivo</Typography>
          </Box>
        </Container>
      </Box>

      {/* Bottom nav mobile */}
      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderRadius: '12px 12px 0 0',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
          elevation={8}
        >
          <BottomNavigation showLabels value={bottomValue} sx={{ borderRadius: '12px 12px 0 0' }}>
            <BottomNavigationAction label="Accueil" icon={<HomeIcon />} component={Link} to="/" />
            <BottomNavigationAction label="Recherche" icon={<SearchIcon />} component={Link} to="/search" />
            <BottomNavigationAction label="Vendre" icon={<AddIcon />} component={Link} to={PUBLISH_PATH} />
            <BottomNavigationAction label="Favoris" icon={<FavoriteIcon />} component={Link} to="/dashboard/favorites" />
            <BottomNavigationAction label="Compte" icon={<PersonIcon />} component={Link} to={isAuthenticated ? '/dashboard/profile' : '/login'} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
