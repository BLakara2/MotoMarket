import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Chip,
  Button,
  Avatar,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from '@mui/material';
import {
  DirectionsBike as BikeIcon,
  Payments as MoneyIcon,
  Forum as LeadsIcon,
  Percent as ConversionIcon,
  TrendingUp as UpIcon,
  TrendingDown as DownIcon,
  ArrowForward as ArrowIcon,
  Add as AddIcon,
  Message as MessageIcon,
  Warning as AlertIcon,
  Bolt as OpportunityIcon,
  Event as EventIcon,
  Visibility as ViewsIcon,
  Favorite as FavoriteIcon,
  Share as SocialIcon,
} from '@mui/icons-material';
import api, { getFileUrl } from '../../../services/api';
import ErrorMessage from '../../../components/common/ErrorMessage';

// ── Types ─────────────────────────────────────────────────
interface TopListing {
  id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  favorites: number;
  conversations: number;
  image: string | null;
}

interface Lead {
  id: string;
  buyerName: string;
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
}

interface DashboardData {
  overview: {
    totalListings: number;
    activeListings: number;
    pausedListings: number;
    draftListings: number;
    soldListings: number;
    soldThisMonth: number;
    soldLastMonth: number;
    revenue: number;
    totalViews: number;
    favoritesReceived: number;
    conversations: number;
    unreadMessages: number;
  };
  topListings: TopListing[];
  leads: Lead[];
}

// ── Données de démonstration (campagnes, visiteurs, social) ──
// En attendant la connexion des comptes publicitaires / analytics.
const DEMO_CAMPAIGNS = [
  { name: 'Promo Yamaha XMAX', channel: 'Facebook Ads', spend: 2_250_000, leads: 240, sales: 15 },
  { name: 'Offre sportive', channel: 'Google Ads', spend: 1_350_000, leads: 120, sales: 8 },
  { name: 'Déstockage casques', channel: 'Instagram', spend: 900_000, leads: 180, sales: 11 },
];

const DEMO_VISITORS_WEEK = [420, 510, 480, 620, 710, 980, 860];
const DEMO_SOURCES = [
  { label: 'Réseaux sociaux', value: 38, color: '#7C3AED' },
  { label: 'Recherche Google', value: 32, color: '#4F46E5' },
  { label: 'Publicité', value: 18, color: '#A78BFA' },
  { label: 'Direct', value: 12, color: '#CBD5E1' },
];

const DEMO_SOCIAL = [
  { network: 'Facebook', followers: '24,5 k', growth: '+8 %', topPost: '« Arrivage Honda CB500F » — 8 200 vues' },
  { network: 'Instagram', followers: '18,2 k', growth: '+12 %', topPost: '« Nouvelle MT-07 2026 » — 15 000 vues' },
  { network: 'TikTok', followers: '9,7 k', growth: '+21 %', topPost: '« Essai KTM Duke 390 » — 32 000 vues' },
];

const fmtAr = (n: number) => `${new Intl.NumberFormat('fr-MG').format(Math.round(n))} Ar`;
const fmtNum = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

// ── Mini-graphiques SVG ───────────────────────────────────
function Sparkline({ data, color = '#7C3AED', width = 260, height = 64 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const px = (i: number) => (i / (data.length - 1)) * (width - 8) + 4;
  const py = (v: number) => height - 6 - ((v - min) / (max - min || 1)) * (height - 14);
  const line = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L${px(data.length - 1).toFixed(1)},${height} L4,${height} Z`;
  const id = `spark-${color.replace('#', '')}`;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block', height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function Donut({ segments, size = 140 }: { segments: Array<{ label: string; value: number; color: string }>; size?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - 24) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        {segments.map((s) => {
          const frac = s.value / total;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={13}
              strokeDasharray={`${(frac * c).toFixed(1)} ${c.toFixed(1)}`}
              strokeDashoffset={(-acc * c).toFixed(1)}
              strokeLinecap="butt"
            />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <Stack spacing={1}>
        {segments.map((s) => (
          <Stack key={s.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary">
              {s.label} · <strong>{s.value} %</strong>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <Stack direction="row" sx={{ mb: 2, alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Box>
      {action}
    </Stack>
  );
}

const DemoNote = () => (
  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
    Données de démonstration — connectez vos comptes pour un suivi réel.
  </Typography>
);

// ── Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get<DashboardData>('/users/me/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton height={48} width={320} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}><Skeleton variant="rounded" height={140} /></Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  if (error || !data) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorMessage onRetry={() => refetch()} />
      </Container>
    );
  }

  const o = data.overview;
  const conversionViewsToFav = o.totalViews > 0 ? (o.favoritesReceived / o.totalViews) * 100 : 0;
  const conversionFavToContact = o.favoritesReceived > 0 ? (o.conversations / o.favoritesReceived) * 100 : 0;
  const salesDelta = o.soldThisMonth - o.soldLastMonth;
  const avgBasket = o.soldListings > 0 ? o.revenue / o.soldListings : 0;

  const kpis = [
    {
      icon: <BikeIcon />,
      label: 'Motos vendues',
      value: String(o.soldListings),
      sub: `Ce mois : ${o.soldThisMonth} · Mois dernier : ${o.soldLastMonth}`,
      trend: salesDelta >= 0,
      trendLabel: `${salesDelta >= 0 ? '+' : ''}${salesDelta} vs mois dernier`,
    },
    {
      icon: <MoneyIcon />,
      label: "Chiffre d'affaires",
      value: fmtAr(o.revenue),
      sub: `Panier moyen : ${o.soldListings > 0 ? fmtAr(avgBasket) : '—'}`,
      trend: o.revenue > 0,
      trendLabel: `${o.soldListings} vente(s) au total`,
    },
    {
      icon: <LeadsIcon />,
      label: 'Demandes reçues',
      value: String(o.conversations),
      sub: `${o.unreadMessages} message(s) non lu(s)`,
      trend: true,
      trendLabel: `${fmtNum(o.totalViews)} vues au total`,
    },
    {
      icon: <ConversionIcon />,
      label: 'Conversion vues → favoris',
      value: `${conversionViewsToFav.toFixed(1)} %`,
      sub: `Favoris → contact : ${conversionFavToContact.toFixed(1)} %`,
      trend: conversionViewsToFav >= 2,
      trendLabel: `${fmtNum(o.favoritesReceived)} favoris reçus`,
    },
  ];

  const alerts: Array<{ icon: React.ReactNode; color: string; title: string; desc: string; link?: string; linkLabel?: string }> = [];
  if (o.draftListings > 0) {
    alerts.push({
      icon: <AlertIcon />, color: '#D97706',
      title: `${o.draftListings} brouillon(s) non publié(s)`,
      desc: 'Finalisez vos annonces pour les rendre visibles.',
      link: '/dashboard/listings/new', linkLabel: 'Publier',
    });
  }
  if (o.unreadMessages > 0) {
    alerts.push({
      icon: <MessageIcon />, color: '#7C3AED',
      title: `${o.unreadMessages} message(s) sans réponse`,
      desc: 'Répondez vite : les vendeurs réactifs vendent 2× plus.',
      link: '/dashboard/messages', linkLabel: 'Répondre',
    });
  }
  if (o.pausedListings > 0) {
    alerts.push({
      icon: <EventIcon />, color: '#4F46E5',
      title: `${o.pausedListings} annonce(s) en pause`,
      desc: 'Réactivez-les pour regagner en visibilité.',
      link: '/search', linkLabel: 'Voir',
    });
  }
  if (o.activeListings > 0 && o.activeListings < 3) {
    alerts.push({
      icon: <OpportunityIcon />, color: '#D97706',
      title: 'Stock faible',
      desc: `Seulement ${o.activeListings} annonce(s) active(s). Ajoutez du stock pour capter plus de contacts.`,
      link: '/dashboard/listings/new', linkLabel: 'Ajouter',
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      icon: <OpportunityIcon />, color: '#0E9F6E',
      title: 'Tout est en ordre',
      desc: 'Aucune action urgente. Pensez à renouveler vos photos pour booster vos vues.',
    });
  }

  const bestCampaign = DEMO_CAMPAIGNS.reduce((a, b) => (b.sales / b.spend > a.sales / a.spend ? b : a));
  const maxRoi = Math.max(...DEMO_CAMPAIGNS.map((c) => c.sales / c.spend));

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 3, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
              Tableau de bord
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ventes, prospects et performance de votre activité.
            </Typography>
          </Box>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} component={Link} to="/dashboard/listings/new">
            Nouvelle annonce
          </Button>
        </Stack>

        {/* 1 — KPI */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {kpis.map((k) => (
            <Grid key={k.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2.5, height: '100%' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'rgba(124,58,237,0.1)', color: 'secondary.main', width: 44, height: 44 }}>
                    {k.icon}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{k.label}</Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary">{k.sub}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={k.trend ? <UpIcon /> : <DownIcon />}
                    label={k.trendLabel}
                    size="small"
                    color={k.trend ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* 2 — Ventes + Campagnes */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle
                title="Activité des 7 derniers jours"
                subtitle="Vues de vos annonces"
                action={<Chip label={`Total : ${fmtNum(o.totalViews)} vues`} size="small" color="secondary" />}
              />
              <Sparkline data={DEMO_VISITORS_WEEK.map((v) => Math.round((v / 980) * Math.max(o.totalViews / 7, 10)))} />
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Annonces actives : <strong>{o.activeListings}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Favoris reçus : <strong>{fmtNum(o.favoritesReceived)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Conversations : <strong>{o.conversations}</strong>
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle title="Campagnes marketing" subtitle={`La plus rentable : ${bestCampaign.name}`} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Campagne</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Dépenses</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Leads</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Ventes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DEMO_CAMPAIGNS.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.channel}</Typography>
                      </TableCell>
                      <TableCell align="right">{fmtAr(c.spend)}</TableCell>
                      <TableCell align="right">{c.leads}</TableCell>
                      <TableCell align="right"><strong>{c.sales}</strong></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                {DEMO_CAMPAIGNS.map((c) => {
                  const roi = c.sales / c.spend;
                  return (
                    <Box key={c.name} sx={{ mb: 1 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">{c.name}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>ROI {(roi * 1_000_000).toFixed(1)} ‰</Typography>
                      </Stack>
                      <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ width: `${Math.round((roi / maxRoi) * 100)}%`, height: '100%', bgcolor: 'secondary.main', borderRadius: 3 }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <DemoNote />
            </Paper>
          </Grid>
        </Grid>

        {/* 3 — Top motos + Visiteurs + Social */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle title="Top de vos annonces" subtitle="Les plus consultées" />
              {data.topListings.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Publiez votre première annonce pour voir vos statistiques ici.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {data.topListings.map((l, i) => (
                    <Box
                      key={l.id}
                      component={Link}
                      to={`/listings/${l.id}`}
                      sx={{ display: 'flex', gap: 1.5, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                    >
                      <Avatar sx={{ bgcolor: i === 0 ? 'secondary.main' : 'action.selected', color: i === 0 ? '#fff' : 'text.primary', fontWeight: 800, width: 36, height: 36 }}>
                        {i + 1}
                      </Avatar>
                      <Box
                        sx={{
                          width: 64,
                          height: 48,
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: 'grey.100',
                          flexShrink: 0,
                        }}
                      >
                        {l.image ? (
                          <img src={getFileUrl(l.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BikeIcon fontSize="small" color="disabled" />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {l.title}
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 0.25 }}>
                          <Typography variant="caption" color="text.secondary"><ViewsIcon sx={{ fontSize: 13, verticalAlign: 'text-bottom' }} /> {fmtNum(l.views)}</Typography>
                          <Typography variant="caption" color="text.secondary"><FavoriteIcon sx={{ fontSize: 13, verticalAlign: 'text-bottom' }} /> {l.favorites}</Typography>
                          <Typography variant="caption" color="text.secondary"><MessageIcon sx={{ fontSize: 13, verticalAlign: 'text-bottom' }} /> {l.conversations}</Typography>
                        </Stack>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', whiteSpace: 'nowrap' }}>
                        {fmtAr(l.price)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle title="Visiteurs" subtitle="Origine du trafic (7 j)" />
              <Donut segments={DEMO_SOURCES} />
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Pages les plus visitées</Typography>
                {['Recherche motos', 'Page Honda CB500F', 'Page Yamaha MT-07'].map((p, i) => (
                  <Stack key={p} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{i + 1}. {p}</Typography>
                  </Stack>
                ))}
              </Stack>
              <DemoNote />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle title="Réseaux sociaux" subtitle="Communauté" />
              <Stack spacing={2}>
                {DEMO_SOCIAL.map((s) => (
                  <Box key={s.network} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'rgba(124,58,237,0.1)', color: 'secondary.main', width: 40, height: 40 }}>
                      <SocialIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{s.network}</Typography>
                        <Chip label={s.growth} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{s.followers} abonnés</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{s.topPost}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
              <DemoNote />
            </Paper>
          </Grid>
        </Grid>

        {/* 4 — Prospects + Alertes + Commercial */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle
                title="Prospects récents"
                subtitle={`${o.unreadMessages} message(s) sans réponse`}
                action={
                  <Button size="small" endIcon={<ArrowIcon />} component={Link} to="/dashboard/messages" sx={{ color: 'secondary.main' }}>
                    Messages
                  </Button>
                }
              />
              {data.leads.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucune conversation pour le moment. Vos futurs acheteurs apparaîtront ici.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {data.leads.map((lead) => (
                    <Box
                      key={lead.id}
                      component={Link}
                      to="/dashboard/messages"
                      sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', textDecoration: 'none', color: 'inherit' }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          mt: 0.7,
                          flexShrink: 0,
                          bgcolor: lead.unread ? '#0E9F6E' : '#CBD5E1',
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{lead.buyerName}</Typography>
                          {lead.unread && <Chip label="Nouveau" size="small" color="success" sx={{ height: 20, fontSize: '0.65rem' }} />}
                        </Stack>
                        <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 700 }}>
                          {lead.listingTitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {lead.lastMessage || 'Conversation démarrée'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <SectionTitle title="Alertes & actions" subtitle="À traiter en priorité" />
              <Stack spacing={2}>
                {alerts.map((a) => (
                  <Box key={a.title} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: `${a.color}1A`, color: a.color, width: 40, height: 40 }}>
                      {a.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{a.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.desc}</Typography>
                      {a.link && (
                        <Box sx={{ mt: 0.5 }}>
                          <Button size="small" component={Link} to={a.link} sx={{ color: 'secondary.main', p: 0, minWidth: 0 }}>
                            {a.linkLabel} →
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg,#1E293B,#4C1D95)', color: '#fff' }}>
              <SectionTitle title="Stock" subtitle="" />
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {[
                  ['Disponibles', o.activeListings, '#A78BFA'],
                  ['En pause', o.pausedListings, '#F59E0B'],
                  ['Brouillons', o.draftListings, '#94A3B8'],
                  ['Vendues', o.soldListings, '#34D399'],
                ].map(([label, value, color]) => (
                  <Box key={label as string}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography>
                    </Stack>
                    <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${o.totalListings > 0 ? Math.round((Number(value) / o.totalListings) * 100) : 0}%`,
                          height: '100%',
                          bgcolor: color as string,
                          borderRadius: 3,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Button variant="contained" color="secondary" fullWidth startIcon={<AddIcon />} component={Link} to="/dashboard/listings/new" sx={{ mt: 2.5 }}>
                Ajouter au stock
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
