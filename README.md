# MotoMarket

> Marketplace web/mobile-first de vente et d'achat de motos.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| UI | Material UI (MUI) v5 |
| Routing | React Router v6 |
| State serveur | TanStack Query (React Query) |
| State client | Zustand |
| Formulaires | React Hook Form + Zod |
| HTTP | Axios |
| Backend | Node.js + Express + TypeScript |
| BDD | PostgreSQL |
| ORM | Prisma |
| Upload | Multer (dev) / S3-compatible (prod) |

---

## Installation

### Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm ou pnpm

### 1. Cloner et installer

```bash
git clone <repo-url>
cd motomarket
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # configurer les variables
npx prisma generate
npx prisma db push      # ou prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Le frontend démarre sur `http://localhost:5173`.

### 4. Base de données

Le backend attend une base PostgreSQL. Créer la base avant de lancer les migrations :

```sql
CREATE DATABASE motomarket;
```

Puis lancer :

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

## Structure du projet

```
motomarket/
├── frontend/
│   ├── src/
│   │   ├── app/            # App.tsx, router, theme, providers
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── common/     # Loading, EmptyState, ConfirmDialog, ImageUploader
│   │   │   ├── layout/     # Navbar, Footer, Sidebar, MobileNav
│   │   │   └── motorcycle/ # Card, Grid, Gallery, Info, Price
│   │   ├── features/       # Modules par domaine
│   │   │   ├── auth/
│   │   │   ├── motorcycles/
│   │   │   ├── favorites/
│   │   │   ├── messages/
│   │   │   ├── profile/
│   │   │   ├── reviews/
│   │   │   ├── reports/
│   │   │   ├── payments/
│   │   │   └── admin/
│   │   ├── hooks/          # Hooks globaux
│   │   ├── services/       # Axios instance, utils API
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # Types partagés
│   │   └── utils/          # Helpers
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── uploads/
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   └── swagger.yaml
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Architecture frontend

### Règles fondamentales

1. **Un composant = une responsabilité.** Un composant qui gère la liste, un autre la carte, un autre le formulaire.
2. **Les appels API passent par les services.** Jamais d'Axios directement dans les composants.
3. **TanStack Query pour les données serveur.** Zustand uniquement pour l'état UI local (theme, menu mobile, filtres temporaires).
4. **Zod pour valider partout.** Même schéma côté frontend et backend.
5. **Lazy loading des routes.** Chaque page est un `React.lazy()`.

### Convention de fichiers

```
features/motorcycles/
├── api/
│   └── motorcycleApi.ts        # fonctions API (getMotorcycle, createMotorcycle...)
├── components/
│   ├── MotorcycleCard.tsx
│   ├── MotorcycleFilters.tsx
│   └── MotorcycleForm.tsx
├── hooks/
│   └── useMotorcycle.ts        # hooks TanStack Query
├── pages/
│   ├── MotorcycleListPage.tsx
│   ├── MotorcycleDetailPage.tsx
│   ├── CreateMotorcyclePage.tsx
│   └── EditMotorcyclePage.tsx
├── schemas/
│   └── motorcycle.schema.ts    # Zod schemas
└── types.ts
```

### Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composant | PascalCase | `MotorcycleCard` |
| Page | PascalCase + `Page` | `MotorcycleListPage` |
| Hook | camelCase + `use` | `useMotorcycles` |
| API function | camelCase | `getMotorcycleById` |
| Zod schema | camelCase + `Schema` | `motorcycleSchema` |
| Type | PascalCase | `Motorcycle`, `MotorcycleStatus` |
| Store | camelCase | `useAuthStore` |
| Route path | kebab-case | `/motorcycles/:id` |

### Conventions de routes

```
Publiques :
  /                          Accueil
  /search                    Recherche
  /motorcycles/:id           Détail
  /seller/:id                Profil vendeur
  /brands/:slug              Voir par marque
  /login                     Connexion
  /register                  Inscription

Utilisateur (protégées) :
  /dashboard                 Tableau de bord
  /dashboard/motorcycles     Mes annonces
  /dashboard/motorcycles/new Publier
  /dashboard/motorcycles/:id/edit  Modifier
  /dashboard/favorites       Favoris
  /dashboard/messages        Messages
  /dashboard/messages/:id    Conversation
  /dashboard/profile         Profil
  /dashboard/settings        Paramètres

Admin (protégées role ADMIN) :
  /admin                     Dashboard
  /admin/users               Utilisateurs
  /admin/motorcycles         Annonces
  /admin/reports             Signalements
  /admin/reviews             Avis
  /admin/brands              Marques
  /admin/models              Modèles
  /admin/categories          Catégories
  /admin/payments            Paiements
  /admin/subscriptions       Abonnements
```

---

## Convention API

### Base URL

```
VITE_API_URL=http://localhost:5000/api
```

### Headers

```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

### Format de réponse paginée

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13
  }
}
```

### Erreurs

```json
{
  "message": "Description de l'erreur",
  "code": "ERROR_CODE",
  "errors": [
    { "field": "email", "message": "Email invalide" }
  ]
}
```

### Swagger

La spécification OpenAPI est disponible dans `docs/swagger.yaml`.

---

## Authentification

### Flux JWT

```
Login
  → { accessToken, refreshToken }

accessToken (court, 15min)
  → envoyé dans Authorization header

refreshToken (long, 7j)
  → stocké en httpOnly cookie ou secure storage
  → POST /api/auth/refresh pour régénérer

Logout
  → invalidate refreshToken côté serveur
```

### Rôles

| Rôle | Permissions |
|------|------------|
| USER | CRUD ses annonces, favoris, messages, profil |
| PRO | + badge, catalogue, stats, plus d'annonces |
| ADMIN | + modération, gestion users/brands/payments |

### Guard de routes

```tsx
// Concept
<PrivateRoute>
  <DashboardPage />
</PrivateRoute>

<AdminRoute>
  <AdminDashboardPage />
</AdminRoute>
```

---

## State management

### TanStack Query (données serveur)

```ts
// Clés de cache
['motorcycles']                    // liste
['motorcycles', filters]           // liste filtrée
['motorcycle', id]                 // détail
['seller', id]                     // profil vendeur
['favorites']                      // mes favoris
['conversations']                  // mes conversations
['conversation', id]               // messages
['brands']                         // marques
```

### Zustand (état UI)

```ts
// États gérés par Zustand
useAuthStore      // user, token, login, logout
useThemeStore     // mode clair/sombre
useUIStore        // menu mobile ouvert, sidebar
useFilterStore    // filtres temporaires de recherche
```

---

## Formulaires

Chaque formulaire utilise React Hook Form + Zod.

```ts
// schemas/motorcycle.schema.ts
import { z } from 'zod';

export const motorcycleSchema = z.object({
  brandId: z.string().uuid('Marque requise'),
  modelId: z.string().uuid('Modèle requis'),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  price: z.number().min(0, 'Prix invalide'),
  year: z.number().min(1950).max(2030),
  mileage: z.number().min(0),
  engineCc: z.number().min(50).max(2000),
  type: z.enum(['CROSS', 'ROUTE', 'ROADSTER', 'SCOOTER', 'Trail', 'CUSTOM', 'AUTRE']),
  fuel: z.enum(['ESSENCE', 'DIELECTRIQUE', 'HYBRIDE', 'ELECTRIQUE']),
  transmission: z.enum(['MANUELLE', 'AUTOMATIQUE', 'SEMI_AUTO']),
  condition: z.enum(['NEUF', 'TRES_BON', 'BON', 'USAGE', 'A_REFORMER']),
  city: z.string().min(1),
  district: z.string().optional(),
  maintenanceInfo: z.string().optional(),
  papersInfo: z.string().optional(),
  modifications: z.string().optional(),
});

export type MotorcycleFormData = z.infer<typeof motorcycleSchema>;
```

---

## Upload de photos

### Contraintes

- 3 à 15 photos par annonce
- Formats : JPG, JPEG, PNG, WebP
- Taille max : configurable côté backend (défaut 5 Mo)
- Photo principale obligatoire

### Flux

```
Drag & drop / sélection
  → preview locale (URL.createObjectURL)
  → FormData + multipart/form-data
  → POST /api/motorcycles/:id/images
  → { id, url, position, isPrimary }
```

---

## UI / UX

### Palette MUI

```ts
primary:   '#1B5E20'  // Vert moto
secondary: '#FFB300'  // Orange accent
background: '#F5F5F5'
```

### States obligatoires

Chaque page/liste doit gérer :

| State | Composant |
|-------|-----------|
| Loading | `<Skeleton>` ou `<CircularProgress>` |
| Success | Contenu |
| Empty | `<EmptyState message="Aucune moto trouvée" />` |
| Error | `<ErrorMessage message="..." onRetry={...} />` |

### Responsive

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<600px) | Bottom navigation, carte pleine largeur |
| Tablette (600-900px) | Grid 2 colonnes |
| Desktop (900-1200px) | Grid 3 colonnes, sidebar filtres |
| Large (>1200px) | Grid 4 colonnes |

---

## Sécurité

### Côté frontend

- Jamais de secrets dans le code source
- Tokenstocké de façon sécurisée
- Validation Zod avant envoi
- XSS : ne jamais injecter de HTML brut

### Côté backend

- Mots de passe hashés (bcrypt/Argon2)
- JWT access + refresh token
- Rate limiting sur les routes sensibles
- Validation de toutes les entrées (Zod)
- CORS restreint
- Upload : validation MIME + taille
- Autorisations vérifiées sur chaque ressource
- Logs d'erreurs

---

## Déploiement

### Variables d'environnement

**Frontend (.env) :**

```env
VITE_API_URL=https://api.motomarket.mg/api
```

**Backend (.env) :**

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/motomarket
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

### Production

- Frontend : Vercel, Netlify ou Nginx
- Backend : Railway, Render, ou VPS
- BDD : Supabase, Neon, ou Railway
- Images : S3 / Cloudflare R2

---

## Développement

### Ordre de développement recommandé

| Étape | Contenu |
|-------|---------|
| 1 | Vite + React + TS + MUI + ESLint + Prettier |
| 2 | Layout (Navbar, Footer, Theme, Routing) |
| 3 | Pages publiques (Home, Search, Detail) avec données mockées |
| 4 | Backend + PostgreSQL + Auth |
| 5 | Connexion React ↔ API (Axios + TanStack Query) |
| 6 | CRUD Moto (Create, Edit, Delete) |
| 7 | Favoris + Profils + Messages |
| 8 | Admin + Reports + Reviews |
| 9 | Payments + Boost + Comptes pro |
| 10 | SEO + Performance + PWA |

### Commandes utiles

```bash
# Frontend
cd frontend
npm run dev          # serveur dev
npm run build        # build production
npm run lint         # ESLint
npm run typecheck    # vérification TS

# Backend
cd backend
npm run dev          # serveur dev (nodemon)
npm run build        # build TS
npm run start        # démarrer en prod
npx prisma studio    # visualiser la BDD
npx prisma migrate dev --name <name>  # migration
npx prisma db seed   # peupler la BDD
```

### Git

Branches :

```
main       ← code stable, prêt prod
develop    ← intégration
feature/*  ← nouvelles fonctionnalités
fix/*      ← corrections
```

Messages de commit :

```
feat: add motorcycle listing page
feat: add authentication flow
fix: fix motorcycle filter on mobile
refactor: improve search service
chore: update dependencies
```

---

## API Documentation

La spécification complète est dans `docs/swagger.yaml`.

Pour visualiser swagger-ui, copier le fichier dans un outil comme [Swagger Editor](https://editor.swagger.io) ou intégrer `swagger-ui-express` dans le backend.

---

## Critères de réussite du MVP

Un utilisateur doit pouvoir :

1. Créer un compte et se connecter
2. Rechercher et filtrer des motos
3. Consulter le détail d'une annonce
4. Publier une moto avec photos
5. Modifier et supprimer ses annonces
6. Ajouter des annonces en favoris
7. Contacter un vendeur
8. Signaler une annonce
9. Consulter le profil d'un vendeur
10. Se déconnecter

Un admin doit pouvoir :

1. Voir le dashboard
2. Gérer les utilisateurs
3. Modérer les annonces
4. Gérer les signalements
5. Gérer les marques et modèles
