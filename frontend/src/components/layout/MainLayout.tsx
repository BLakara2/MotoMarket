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
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  TwoWheeler as MotoIcon,
  Build as PartIcon,
  Checkroom as AccessoryIcon,
} from '@mui/icons-material';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const DRAWER_WIDTH = 280;
const APP_BAR_HEIGHT = '64px';
const HEADER_GRADIENT = 'linear-gradient(135deg, #0B3B2C 0%, #16704F 100%)';
const ACCENT_GRADIENT = 'linear-gradient(120deg, #FFB300 0%, #FF7A00 100%)';

const isSearchPath = (pathname: string) => pathname.startsWith('/search');

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useUIStore();
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Motos', icon: <MotoIcon />, path: '/search?type=MOTORCYCLE' },
    { text: 'Pièces', icon: <PartIcon />, path: '/search?type=PART' },
    { text: 'Accessoires', icon: <AccessoryIcon />, path: '/search?type=ACCESSORY' },
  ];

  const authItems = [
    { text: 'Publier une annonce', icon: <AddIcon />, path: '/dashboard/listings/new' },
    { text: 'Mes favoris', icon: <FavoriteIcon />, path: '/dashboard/favorites' },
    { text: 'Messages', icon: <MessageIcon />, path: '/dashboard/messages' },
    { text: 'Mon profil', icon: <PersonIcon />, path: '/dashboard' },
  ];

  const isActive = (path: string) =>
    isSearchPath(path) ? isSearchPath(location.pathname) : location.pathname === path;

  const brand = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '12px',
          backgroundImage: ACCENT_GRADIENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 18px -8px rgba(255, 122, 0, .7)',
          flexShrink: 0,
        }}
      >
        <MotoIcon sx={{ color: '#fff', fontSize: 22 }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Chakra Petch", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.6px',
          color: 'inherit',
        }}
      >
        MotoMarket
      </Typography>
    </Box>
  );

  const drawerItems = (
    <Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography
          component={Link}
          to="/"
          onClick={() => setMobileOpen(false)}
          sx={{ color: isDarkMode ? '#EDF2EE' : '#0E4D3A', textDecoration: 'none' }}
        >
          {brand}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: '12px',
              mb: 0.5,
              color: isActive(item.path) ? 'primary.main' : 'inherit',
              bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
              transition: 'background-color .2s ease, color .2s ease',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontWeight: 600 } }} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List sx={{ px: 1, py: 1 }}>
          {authItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '12px',
                mb: 0.5,
                color: isActive(item.path) ? 'primary.main' : 'inherit',
                bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
                transition: 'background-color .2s ease, color .2s ease',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontWeight: 600 } }} />
            </ListItem>
          ))}
        </List>
      ) : (
        <List sx={{ px: 2, py: 2 }}>
          <Button
            variant="contained"
            fullWidth
            component={Link}
            to="/login"
            onClick={() => setMobileOpen(false)}
            startIcon={<LoginIcon />}
          >
            Connexion
          </Button>
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundImage: HEADER_GRADIENT,
          boxShadow: '0 6px 28px -14px rgba(11, 59, 44, .8)',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: APP_BAR_HEIGHT, px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 1.5 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Box component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
            {brand}
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', ml: 4, gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: '999px',
                    px: 1.75,
                    py: 0.75,
                    fontWeight: isActive(item.path) ? 700 : 500,
                    color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,.82)',
                    bgcolor: isActive(item.path) ? 'rgba(255,255,255,.18)' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive(item.path) ? 'rgba(255,255,255,.24)' : 'rgba(255,255,255,.12)',
                      color: '#fff',
                    },
                    transition: 'background-color .2s ease, color .2s ease',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            color="inherit"
            onClick={toggleTheme}
            size="small"
            sx={{
              border: '1px solid rgba(255,255,255,.35)',
              mr: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,.15)' },
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={logout}
              sx={{
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,.35)',
                px: 1.75,
                '&:hover': { bgcolor: 'rgba(255,255,255,.15)' },
              }}
            >
              Déconnexion
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,.35)',
                px: 1.75,
                bgcolor: 'rgba(255,255,255,.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,.2)' },
              }}
            >
              <LoginIcon sx={{ mr: 0.5 }} />
              Connexion
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer — permanent desktop / temporaire mobile */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none' },
          }}
        >
          {drawerItems}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: 'none',
              boxShadow: '2px 0 24px -18px rgba(0,0,0,.4)',
            },
          }}
        >
          {drawerItems}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        className="page-enter"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          pt: APP_BAR_HEIGHT,
          px: { xs: 2, md: 4 },
          pb: 6,
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}