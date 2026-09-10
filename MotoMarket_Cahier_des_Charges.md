# MotoMarket - Cahier des charges et spécifications techniques

> Document de référence pour développer une marketplace web/mobile-first de vente et d'achat de motos.
>
> **Stack principale : React + TypeScript + Vite + Material UI + TanStack Query + Zustand + React Hook Form + Zod**
>
> Backend recommandé : Node.js + Express + TypeScript + PostgreSQL.

---

# 1. Vision du produit

## 1.1 Nom de travail

**MotoMarket**

Le nom pourra être changé plus tard.

## 1.2 Concept

MotoMarket est une marketplace spécialisée dans les motos.

Les utilisateurs peuvent :

- rechercher des motos à vendre ;
- filtrer les annonces ;
- consulter les détails d'une moto ;
- publier leur propre moto ;
- modifier ou supprimer leurs annonces ;
- enregistrer des motos en favoris ;
- contacter un vendeur ;
- consulter le profil d'un vendeur ;
- signaler une annonce ;
- évaluer un vendeur après une transaction.

Les vendeurs professionnels disposent d'outils supplémentaires pour gérer leur catalogue.

## 1.3 Objectifs

1. Créer une expérience spécialisée pour les motos.
2. Rendre la recherche rapide sur mobile.
3. Faciliter la publication d'annonces.
4. Construire un système de confiance entre acheteurs et vendeurs.
5. Préparer la plateforme à la monétisation.
6. Construire une architecture pouvant évoluer vers une application mobile/PWA.

## 1.4 Cible initiale

Le lancement initial peut être ciblé sur Antananarivo, puis étendu progressivement à Madagascar.

---

# 2. Utilisateurs et rôles

## 2.1 Visiteur

Permissions :

- consulter l'accueil ;
- rechercher des motos ;
- utiliser les filtres ;
- consulter une annonce ;
- consulter un profil vendeur ;
- consulter les marques et catégories ;
- créer un compte ;
- se connecter.

Un visiteur ne peut pas :

- publier une annonce ;
- ajouter une annonce aux favoris ;
- envoyer un message ;
- évaluer un vendeur.

## 2.2 Utilisateur particulier

Permissions :

- toutes les permissions visiteur ;
- publier une moto ;
- modifier ses annonces ;
- supprimer ses annonces ;
- changer le statut d'une annonce ;
- gérer ses favoris ;
- envoyer et recevoir des messages ;
- gérer son profil ;
- signaler une annonce ;
- évaluer un vendeur.

## 2.3 Vendeur professionnel

Permissions :

- toutes les permissions utilisateur ;
- profil professionnel ;
- logo ;
- catalogue de motos ;
- statistiques ;
- plusieurs annonces selon abonnement ;
- annonces sponsorisées ;
- badge professionnel/vérifié.

## 2.4 Administrateur

Permissions :

- gérer les utilisateurs ;
- gérer les annonces ;
- gérer les marques ;
- gérer les modèles ;
- gérer les catégories ;
- gérer les signalements ;
- vérifier les vendeurs ;
- suspendre des comptes ;
- supprimer des annonces ;
- gérer les promotions ;
- consulter les statistiques ;
- gérer les abonnements et paiements.

---

# 3. Fonctionnalités

# 3.1 Page d'accueil

La page d'accueil doit contenir :

- logo MotoMarket ;
- navigation ;
- bouton connexion/inscription ;
- champ de recherche ;
- filtres rapides ;
- catégories de motos ;
- marques populaires ;
- annonces sponsorisées ;
- dernières annonces ;
- motos populaires ;
- footer.

Exemple de structure :

```text
Navbar
│
├── Logo
├── Rechercher
├── Publier une moto
├── Connexion
└── Menu mobile
│
Hero
│
├── Titre
├── Recherche
└── Filtres rapides
│
Annonces sponsorisées
│
Marques populaires
│
Dernières annonces
│
Footer
```

---

# 3.2 Recherche

La recherche doit être effectuée côté backend.

Paramètres possibles :

- texte ;
- marque ;
- modèle ;
- prix minimum ;
- prix maximum ;
- année minimum ;
- année maximum ;
- kilométrage maximum ;
- cylindrée ;
- type ;
- carburant ;
- transmission ;
- état ;
- ville ;
- vendeur particulier/professionnel ;
- vendeur vérifié ;
- annonce sponsorisée.

Exemple :

```http
GET /api/motorcycles?search=racing&brand=kymco&minPrice=3000000&maxPrice=7000000&engineCc=150&page=1&limit=20
```

Tri :

- pertinence ;
- plus récent ;
- prix croissant ;
- prix décroissant ;
- kilométrage croissant ;
- année décroissante.

---

# 3.3 Liste des annonces

Chaque carte moto doit afficher :

- photo principale ;
- marque/modèle ;
- prix ;
- année ;
- kilométrage ;
- cylindrée ;
- localisation ;
- vendeur ;
- badge professionnel si nécessaire ;
- badge vérifié si nécessaire ;
- bouton favori ;
- badge sponsorisé si nécessaire.

Exemple :

```text
┌────────────────────────────┐
│            PHOTO           │
│                         ♥  │
├────────────────────────────┤
│ Kymco Racing 150            │
│ 5 500 000 Ar                │
│ 2022 • 18 500 km • 150 cc  │
│ 📍 Antananarivo             │
│ ✓ Vendeur vérifié           │
└────────────────────────────┘
```

---

# 3.4 Détail d'une moto

La page détail doit contenir :

- galerie photo ;
- photo principale ;
- miniature des autres photos ;
- marque ;
- modèle ;
- prix ;
- année ;
- kilométrage ;
- cylindrée ;
- type ;
- carburant ;
- transmission ;
- état ;
- localisation ;
- description ;
- informations sur l'entretien ;
- informations sur les papiers ;
- informations sur les modifications ;
- vendeur ;
- réputation du vendeur ;
- bouton contacter ;
- bouton favori ;
- bouton partager ;
- bouton signaler ;
- annonces similaires.

Important :

Ne jamais afficher publiquement des informations sensibles du vendeur.

---

# 3.5 Publication d'une moto

Créer un formulaire en plusieurs étapes.

## Étape 1 : Photos

Champs :

- photos ;
- photo principale.

Contraintes recommandées :

- minimum 3 photos ;
- maximum 15 photos ;
- formats JPG, JPEG, PNG, WebP ;
- limite de taille configurable côté backend.

Prévoir :

- drag & drop ;
- réorganisation ;
- suppression ;
- aperçu ;
- sélection de photo principale.

## Étape 2 : Informations moto

Champs :

```text
Marque
Modèle
Année
Cylindrée
Kilométrage
Type
Carburant
Transmission
État
```

## Étape 3 : Prix

Champs :

```text
Prix
Prix négociable
```

Devise initiale :

```text
MGA / Ariary
```

## Étape 4 : Localisation

Champs :

```text
Ville
Quartier
```

Ne pas rendre l'adresse exacte obligatoire ni publique.

## Étape 5 : Description

Champs :

```text
Description
État mécanique
État esthétique
Entretien
Papiers disponibles
Modifications
```

## Étape 6 : Prévisualisation

Afficher exactement ce que verra l'acheteur.

Actions :

```text
Modifier
Enregistrer brouillon
Publier
Publier + booster
```

---

# 3.6 Statuts d'une annonce

Les statuts possibles :

```text
DRAFT
PENDING_REVIEW
ACTIVE
SOLD
PAUSED
EXPIRED
REJECTED
DELETED
```

Description :

- `DRAFT` : brouillon ;
- `PENDING_REVIEW` : attente de validation ;
- `ACTIVE` : visible ;
- `SOLD` : vendue ;
- `PAUSED` : temporairement masquée ;
- `EXPIRED` : expirée ;
- `REJECTED` : refusée par administration ;
- `DELETED` : supprimée.

---

# 3.7 Dashboard utilisateur

Le dashboard doit afficher :

```text
Mes annonces
Annonces actives
Annonces vendues
Vues
Favoris reçus
Messages non lus
```

Menu :

```text
Dashboard
Mes annonces
Publier une moto
Favoris
Messages
Profil
Paramètres
Déconnexion
```

## Mes annonces

Chaque annonce doit permettre :

- voir ;
- modifier ;
- mettre en pause ;
- réactiver ;
- marquer comme vendue ;
- supprimer ;
- booster.

---

# 3.8 Favoris

L'utilisateur connecté peut ajouter une annonce aux favoris.

API :

```http
GET    /api/favorites
POST   /api/favorites/:motorcycleId
DELETE /api/favorites/:motorcycleId
```

Prévoir :

- bouton favori sur les cartes ;
- bouton favori sur la page détail ;
- page `/dashboard/favorites`.

---

# 3.9 Messagerie

La messagerie permet à un acheteur de contacter un vendeur.

Une conversation doit être associée à une annonce.

Exemple :

```text
Acheteur
   ↓
"Bonjour, la moto est-elle toujours disponible ?"
   ↓
Vendeur
   ↓
"Oui, elle est disponible."
```

Fonctionnalités :

- liste conversations ;
- conversation ;
- messages ;
- messages lus/non lus ;
- blocage ;
- signalement ;
- notification.

Prévoir WebSocket plus tard pour le temps réel.

Pour le MVP, une messagerie REST peut suffire.

---

# 3.10 Profil vendeur

Profil particulier :

```text
Nom
Photo
Date d'inscription
Note
Nombre d'annonces
Nombre de ventes
Téléphone vérifié
Email vérifié
Annonces actives
```

Profil professionnel :

```text
Nom de l'entreprise
Logo
Description
Localisation
Téléphone
Email
Note
Nombre de ventes
Nombre d'annonces
Badge professionnel
Badge vérifié
Catalogue
```

---

# 3.11 Évaluation

Après une transaction, l'acheteur peut évaluer le vendeur.

Champs :

```text
Note : 1 à 5
Commentaire
```

Règles :

- un utilisateur ne peut pas noter plusieurs fois la même transaction ;
- une note peut être modérée ;
- les évaluations supprimées par l'administration ne doivent plus influencer la moyenne.

---

# 3.12 Signalements

Un utilisateur peut signaler :

- fraude ;
- fausse annonce ;
- prix trompeur ;
- moto inexistante ;
- vendeur suspect ;
- contenu interdit ;
- autre.

Structure :

```text
Annonce
↓
Signaler
↓
Choisir raison
↓
Ajouter description
↓
Envoyer
```

---

# 3.13 Vérification

Prévoir deux niveaux :

### Vérification téléphone

```text
Numéro
↓
OTP
↓
Téléphone vérifié
```

### Vérification vendeur

Le vendeur peut demander une vérification.

L'administration valide ou refuse.

Statuts :

```text
NOT_REQUESTED
PENDING
VERIFIED
REJECTED
```

Ne pas stocker de documents sensibles inutilement dans le frontend.

---

# 4. Monétisation

## 4.1 Annonce gratuite

Une annonce gratuite est disponible pendant une durée configurable.

Exemple :

```text
30 jours
```

## 4.2 Boost

Produits possibles :

```text
3 jours  : 3 000 Ar
7 jours  : 5 000 Ar
14 jours : 8 000 Ar
```

Les prix doivent être configurables depuis l'administration.

## 4.3 Abonnements professionnels

Exemple :

```text
BASIC    30 000 Ar/mois
PRO      60 000 Ar/mois
PREMIUM 100 000 Ar/mois
```

Les limites doivent être configurables :

```text
nombre d'annonces
nombre de boosts
statistiques
badge
visibilité
```

## 4.4 Paiement

L'architecture doit permettre d'ajouter plusieurs moyens de paiement plus tard.

Ne jamais implémenter des secrets de paiement dans React.

Flux :

```text
React
 ↓
Backend
 ↓
Provider de paiement
 ↓
Callback/Webhook
 ↓
Backend
 ↓
Base de données
 ↓
React
```

---

# 5. Architecture frontend React

## 5.1 Stack

Utiliser :

```text
React
TypeScript
Vite
Material UI
React Router
TanStack Query
Zustand
Axios
React Hook Form
Zod
```

## 5.2 Structure recommandée

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   └── theme.ts
│
├── assets/
│
├── components/
│   ├── common/
│   │   ├── Loading.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── ImageUploader.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNavigation.tsx
│   │
│   └── motorcycle/
│       ├── MotorcycleCard.tsx
│       ├── MotorcycleGrid.tsx
│       ├── MotorcycleGallery.tsx
│       ├── MotorcycleInfo.tsx
│       └── MotorcyclePrice.tsx
│
├── features/
│   │
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── store/
│   │   └── types.ts
│   │
│   ├── motorcycles/
│   │   ├── api/
│   │   │   └── motorcycleApi.ts
│   │   ├── components/
│   │   │   ├── MotorcycleForm.tsx
│   │   │   ├── MotorcycleFilters.tsx
│   │   │   ├── MotorcycleSort.tsx
│   │   │   └── MotorcycleGallery.tsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── MotorcycleListPage.tsx
│   │   │   ├── MotorcycleDetailPage.tsx
│   │   │   ├── CreateMotorcyclePage.tsx
│   │   │   └── EditMotorcyclePage.tsx
│   │   ├── schemas/
│   │   ├── types.ts
│   │   └── utils/
│   │
│   ├── favorites/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types.ts
│   │
│   ├── messages/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types.ts
│   │
│   ├── profile/
│   │
│   ├── reviews/
│   │
│   ├── reports/
│   │
│   ├── payments/
│   │
│   └── admin/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── types.ts
│
├── hooks/
│
├── services/
│   ├── api.ts
│   └── storage.ts
│
├── store/
│
├── types/
│
├── utils/
│
├── main.tsx
│
└── index.css
```

---

# 6. Routing

Routes publiques :

```text
/
 /search
 /motorcycles/:id
 /seller/:id
 /brands/:brand
 /login
 /register
```

Routes utilisateur :

```text
/dashboard
/dashboard/motorcycles
/dashboard/motorcycles/new
/dashboard/motorcycles/:id/edit
/dashboard/favorites
/dashboard/messages
/dashboard/messages/:conversationId
/dashboard/profile
/dashboard/settings
```

Routes admin :

```text
/admin
/admin/users
/admin/motorcycles
/admin/reports
/admin/reviews
/admin/brands
/admin/models
/admin/categories
/admin/payments
/admin/subscriptions
/admin/settings
```

---

# 7. Gestion des données

## 7.1 TanStack Query

Utiliser TanStack Query pour :

- annonces ;
- recherche ;
- profils ;
- favoris ;
- messages ;
- reviews ;
- données admin ;
- appels API.

Exemples de clés :

```text
['motorcycles']
['motorcycles', filters]
['motorcycle', id]
['seller', id]
['favorites']
['conversations']
['conversation', id]
```

## 7.2 Zustand

Utiliser Zustand pour l'état global local :

```text
auth
theme
filtres UI temporaires
état du menu mobile
préférences utilisateur
```

Ne pas utiliser Zustand comme remplacement de TanStack Query.

---

# 8. Axios

Créer une instance centrale :

```text
services/api.ts
```

Responsabilités :

- URL API ;
- headers ;
- token ;
- gestion erreurs ;
- interceptors ;
- refresh token.

Exemple conceptuel :

```text
api.get(...)
api.post(...)
api.put(...)
api.delete(...)
```

---

# 9. Formulaires

Utiliser :

```text
React Hook Form
+
Zod
```

Chaque formulaire doit avoir un schema.

Exemples :

```text
loginSchema
registerSchema
motorcycleSchema
profileSchema
messageSchema
reviewSchema
reportSchema
```

Les validations doivent être présentes :

1. côté frontend pour UX ;
2. côté backend pour sécurité.

---

# 10. Types TypeScript

Exemple :

```ts
type UserRole =
  | 'USER'
  | 'PRO'
  | 'ADMIN';

type MotorcycleStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'SOLD'
  | 'PAUSED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'DELETED';

interface Motorcycle {
  id: string;
  sellerId: string;
  brandId: string;
  modelId: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  engineCc: number;
  type: string;
  fuel: string;
  transmission: string;
  condition: string;
  city: string;
  district?: string;
  status: MotorcycleStatus;
  isFeatured: boolean;
  images: MotorcycleImage[];
  seller: SellerSummary;
  createdAt: string;
  updatedAt: string;
}
```

---

# 11. Base de données recommandée

PostgreSQL.

## users

```text
id
first_name
last_name
email
phone
password_hash
role
avatar
is_phone_verified
is_email_verified
is_verified_seller
created_at
updated_at
```

## seller_profiles

```text
id
user_id
type
business_name
description
logo
city
district
created_at
updated_at
```

`type` :

```text
INDIVIDUAL
PROFESSIONAL
```

## brands

```text
id
name
logo
created_at
```

## motorcycle_models

```text
id
brand_id
name
created_at
```

## categories

```text
id
name
slug
```

## motorcycles

```text
id
seller_id
brand_id
model_id
category_id
title
description
price
year
mileage
engine_cc
type
fuel
transmission
condition
city
district
status
is_featured
published_at
expires_at
created_at
updated_at
```

## motorcycle_images

```text
id
motorcycle_id
url
position
is_primary
created_at
```

## favorites

```text
id
user_id
motorcycle_id
created_at
```

Ajouter une contrainte unique :

```text
UNIQUE(user_id, motorcycle_id)
```

## conversations

```text
id
motorcycle_id
buyer_id
seller_id
created_at
updated_at
```

## messages

```text
id
conversation_id
sender_id
content
is_read
created_at
```

## reviews

```text
id
reviewer_id
seller_id
motorcycle_id
rating
comment
status
created_at
```

## reports

```text
id
reporter_id
motorcycle_id
reason
description
status
created_at
resolved_at
```

## boosts

```text
id
motorcycle_id
user_id
plan_id
starts_at
ends_at
status
```

## subscription_plans

```text
id
name
price
duration_days
max_active_listings
max_boosts
features
is_active
```

## subscriptions

```text
id
user_id
plan_id
starts_at
ends_at
status
```

## payments

```text
id
user_id
type
amount
currency
provider
provider_reference
status
created_at
```

---

# 12. Relations principales

```text
USER
 │
 ├── 1:N → MOTORCYCLES
 │
 ├── 1:N → FAVORITES
 │
 ├── 1:N → REVIEWS
 │
 ├── 1:N → REPORTS
 │
 └── 1:N → MESSAGES
```

```text
BRAND
 │
 └── 1:N → MOTORCYCLE_MODEL
                 │
                 └── 1:N → MOTORCYCLES
```

```text
MOTORCYCLE
 │
 ├── 1:N → IMAGES
 ├── 1:N → FAVORITES
 ├── 1:N → REPORTS
 ├── 1:N → REVIEWS
 └── 1:N → CONVERSATIONS
```

---

# 13. Backend recommandé

Architecture :

```text
backend/
│
├── src/
│   ├── config/
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── motorcycle.controller.ts
│   │   ├── user.controller.ts
│   │   ├── favorite.controller.ts
│   │   ├── message.controller.ts
│   │   ├── review.controller.ts
│   │   ├── report.controller.ts
│   │   └── payment.controller.ts
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── validators/
│   │
│   ├── utils/
│   │
│   └── server.ts
│
└── package.json
```

Séparer :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Le controller ne doit pas contenir toute la logique métier.

---

# 14. API REST

## Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

## Motorcycles

```http
GET    /api/motorcycles
GET    /api/motorcycles/:id
POST   /api/motorcycles
PUT    /api/motorcycles/:id
DELETE /api/motorcycles/:id
PATCH  /api/motorcycles/:id/status
POST   /api/motorcycles/:id/images
DELETE /api/motorcycles/:id/images/:imageId
```

## Favorites

```http
GET    /api/favorites
POST   /api/favorites/:motorcycleId
DELETE /api/favorites/:motorcycleId
```

## Users

```http
GET /api/users/:id
PUT /api/users/me
```

## Messages

```http
GET  /api/conversations
GET  /api/conversations/:id
POST /api/conversations
POST /api/conversations/:id/messages
PATCH /api/messages/:id/read
```

## Reviews

```http
GET  /api/sellers/:sellerId/reviews
POST /api/sellers/:sellerId/reviews
```

## Reports

```http
POST /api/reports
```

## Payments

```http
POST /api/payments/create
GET  /api/payments/:id
POST /api/payments/webhook
```

---

# 15. Pagination

Toutes les listes importantes doivent être paginées.

Format recommandé :

```http
GET /api/motorcycles?page=1&limit=20
```

Réponse :

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

---

# 16. Upload des photos

Architecture :

```text
React
 ↓
Multipart/FormData
 ↓
Backend
 ↓
Validation
 ↓
Storage
 ↓
URL
 ↓
PostgreSQL
```

Ne pas enregistrer les fichiers directement dans PostgreSQL.

Prévoir un service de stockage compatible avec un stockage cloud.

En développement, un dossier local peut être utilisé.

---

# 17. Sécurité

Obligatoire :

- mots de passe hashés avec bcrypt/Argon2 ;
- HTTPS en production ;
- JWT/access token ;
- refresh token sécurisé ;
- validation Zod/backend ;
- rate limiting ;
- CORS configuré ;
- protection contre les uploads dangereux ;
- limitation de taille des images ;
- contrôle MIME ;
- autorisations par rôle ;
- sanitation des entrées ;
- logs d'erreurs côté serveur ;
- secrets uniquement dans `.env`.

Ne jamais mettre :

```text
JWT_SECRET
DATABASE_PASSWORD
PAYMENT_SECRET
API_SECRET
```

dans React ou Git.

---

# 18. Autorisations

Exemple :

```text
PUBLIC
    ↓
GET motorcycles

USER
    ↓
CREATE motorcycle
UPDATE own motorcycle
DELETE own motorcycle

ADMIN
    ↓
UPDATE any motorcycle
DELETE any motorcycle
MANAGE users
MANAGE reports
```

Toujours vérifier la propriété de la ressource côté backend.

Ne jamais se contenter de cacher un bouton React.

---

# 19. UI/UX

## Design

Material UI.

Style recommandé :

```text
Primary: #1B5E20
Secondary: #FFB300
Background: #F5F5F5
```

Prévoir :

- mode clair ;
- mode sombre ;
- responsive ;
- mobile-first ;
- accessibilité ;
- états loading ;
- états erreur ;
- états vide ;
- confirmation avant suppression.

## Responsive

Breakpoints :

```text
Mobile
Tablet
Desktop
Large desktop
```

La navigation mobile doit être pensée séparément de la navigation desktop.

---

# 20. États obligatoires de l'interface

Chaque requête doit prévoir :

```text
Loading
Success
Empty
Error
```

Exemple :

```text
Chargement...
↓
Résultats

OU

Aucune moto trouvée.

OU

Une erreur est survenue.
Réessayer
```

Utiliser des skeletons pour les listes lorsque pertinent.

---

# 21. SEO

Les pages publiques doivent être SEO-friendly.

Prévoir :

- titres dynamiques ;
- meta description ;
- URLs propres ;
- slug ;
- Open Graph ;
- données structurées si pertinent ;
- pages publiques indexables.

Exemple :

```text
/motorcycles/kymco-racing-150-abc123
```

---

# 22. Performance

Objectifs :

- lazy loading des routes ;
- compression images ;
- images responsives ;
- pagination ;
- cache TanStack Query ;
- éviter les re-renders inutiles ;
- code splitting ;
- chargement différé des fonctionnalités lourdes.

Ne pas charger toutes les annonces au démarrage.

---

# 23. PWA

Préparer le projet pour devenir une PWA.

Fonctionnalités futures :

- installation sur téléphone ;
- cache ;
- notifications push ;
- icône ;
- écran de démarrage.

La PWA peut être développée avant une application native.

---

# 24. Notifications

Types :

```text
Nouveau message
Annonce validée
Annonce refusée
Annonce bientôt expirée
Annonce expirée
Nouvelle offre éventuelle
Paiement confirmé
Boost activé
Avis reçu
```

Architecture :

```text
Backend
 ↓
Notification service
 ↓
Email / Push / SMS
```

---

# 25. Administration

Dashboard :

```text
Utilisateurs
Annonces
Motos vendues
Signalements
Revenus
Annonces sponsorisées
Professionnels
```

Pages :

```text
/admin
/admin/users
/admin/motorcycles
/admin/reports
/admin/reviews
/admin/brands
/admin/models
/admin/categories
/admin/payments
/admin/subscriptions
```

---

# 26. MVP

Ne pas développer toutes les fonctionnalités immédiatement.

## Phase 1

```text
[x] React + TypeScript
[x] Vite
[x] MUI
[x] Routing
[x] Auth
[x] PostgreSQL
[x] API
[x] Création utilisateur
[x] Liste motos
[x] Recherche
[x] Filtres
[x] Détail moto
[x] Publication
[x] Modification
[x] Suppression
[x] Favoris
[x] Profil vendeur
```

## Phase 2

```text
[ ] Messagerie
[ ] Signalements
[ ] Évaluations
[ ] Vérification téléphone
[ ] Notifications
```

## Phase 3

```text
[ ] Boost
[ ] Paiement
[ ] Comptes professionnels
[ ] Abonnements
[ ] Statistiques
```

## Phase 4

```text
[ ] Estimation automatique du prix
[ ] Vérification moto
[ ] Inspection mécanique
[ ] Livraison
[ ] Services administratifs
[ ] PWA
[ ] Application Android
```

---

# 27. Estimation automatique du prix

Fonctionnalité future.

Données :

```text
Marque
Modèle
Année
Kilométrage
Cylindrée
État
Localisation
Prix des annonces similaires
```

Résultat :

```text
Prix conseillé :
5 200 000 - 5 800 000 Ar

Positionnement :
🟢 Bon prix
```

Le système doit utiliser les données réelles de la plateforme.

---

# 28. Architecture complète

```text
                         INTERNET
                             │
                             ▼
                  ┌────────────────────┐
                  │      React         │
                  │    TypeScript      │
                  │      Vite          │
                  │     MUI            │
                  └─────────┬──────────┘
                            │
                         HTTPS
                            │
                            ▼
                  ┌────────────────────┐
                  │     REST API       │
                  │  Node + Express     │
                  └─────────┬──────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
          PostgreSQL     Storage    Notification
          Database       Images       Service
                │
                ▼
        ┌──────────────────┐
        │ Business services│
        ├──────────────────┤
        │ Auth             │
        │ Motorcycles      │
        │ Search           │
        │ Favorites        │
        │ Messages         │
        │ Reviews          │
        │ Payments         │
        └──────────────────┘
```

---

# 29. Structure du projet global

```text
motomarket/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# 30. Variables d'environnement

Frontend :

```env
VITE_API_URL=http://localhost:5000/api
```

Backend :

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/motomarket

JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

PAYMENT_API_KEY=
PAYMENT_SECRET=
```

Ne jamais committer le vrai `.env`.

---

# 31. Installation frontend

Créer le projet :

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Installer les dépendances :

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install axios
npm install react-hook-form
npm install zod @hookform/resolvers
```

Outils de développement recommandés :

```bash
npm install -D eslint prettier
```

---

# 32. Ordre de développement recommandé

## Étape 1

Créer :

```text
Vite
React
TypeScript
MUI
ESLint
Prettier
```

## Étape 2

Créer :

```text
Layout
Navbar
Footer
Theme
Routing
```

## Étape 3

Créer :

```text
HomePage
SearchPage
MotorcycleDetailPage
```

avec des données mockées.

## Étape 4

Créer :

```text
Backend
PostgreSQL
Auth
```

## Étape 5

Connecter :

```text
React
 ↓
Axios
 ↓
API
 ↓
PostgreSQL
```

## Étape 6

Développer :

```text
Create motorcycle
Edit motorcycle
Delete motorcycle
```

## Étape 7

Ajouter :

```text
Favorites
Profiles
Messages
```

## Étape 8

Ajouter :

```text
Admin
Reports
Reviews
```

## Étape 9

Ajouter :

```text
Payments
Boost
Professional accounts
```

## Étape 10

Optimiser :

```text
SEO
Performance
PWA
Security
Monitoring
```

---

# 33. Règles de développement

## React

- utiliser des composants fonctionnels ;
- TypeScript obligatoire ;
- éviter les composants gigantesques ;
- une responsabilité claire par composant ;
- utiliser des hooks personnalisés ;
- éviter la duplication.

## API

- toutes les données externes passent par les services API ;
- ne pas appeler Axios directement dans tous les composants ;
- gérer les erreurs ;
- gérer loading/success/error.

## Backend

- validation systématique ;
- logique métier dans les services ;
- accès DB dans les repositories ;
- middleware d'authentification ;
- middleware d'autorisation.

## Git

Branches :

```text
main
develop
feature/*
fix/*
```

Commits :

```text
feat: add motorcycle listing
feat: add authentication
fix: fix motorcycle filter
refactor: improve motorcycle service
```

---

# 34. Tests

Frontend :

- composants ;
- formulaires ;
- hooks ;
- navigation.

Backend :

- auth ;
- permissions ;
- création annonce ;
- modification annonce ;
- recherche ;
- favoris ;
- messages ;
- paiements.

Tests importants :

```text
Un utilisateur ne peut pas modifier l'annonce d'un autre.
Un utilisateur non connecté ne peut pas publier.
Un admin peut modérer une annonce.
Une annonce supprimée ne doit plus apparaître.
Un favori ne peut pas être dupliqué.
Un paiement confirmé active correctement le service.
```

---

# 35. Critères de réussite du MVP

Le MVP est considéré fonctionnel lorsqu'un utilisateur peut :

```text
1. Créer un compte
2. Se connecter
3. Rechercher une moto
4. Filtrer les résultats
5. Consulter une annonce
6. Publier une moto
7. Ajouter des photos
8. Modifier son annonce
9. Supprimer son annonce
10. Ajouter une moto aux favoris
11. Consulter un vendeur
12. Contacter un vendeur
13. Signaler une annonce
14. Se déconnecter
```

L'administrateur doit pouvoir :

```text
1. Se connecter
2. Voir les utilisateurs
3. Voir les annonces
4. Modérer une annonce
5. Gérer les signalements
6. Gérer les marques
7. Gérer les modèles
```

---

# 36. Évolution future

Après validation du marché :

```text
MotoMarket
     │
     ├── Marketplace
     │
     ├── Professionnels
     │
     ├── Garages
     │
     ├── Pièces détachées
     │
     ├── Entretien
     │
     ├── Inspection
     │
     ├── Livraison
     │
     ├── Financement
     │
     └── Assurance
```

L'objectif à long terme est de faire de MotoMarket une plateforme complète autour de la moto, et pas uniquement un site d'annonces.

---

# 37. Priorité produit

Priorité absolue :

```text
P0
Recherche
Annonces
Publication
Photos
Profils
Contact vendeur
Authentification
```

Priorité haute :

```text
P1
Favoris
Messagerie
Signalements
Modération
Vérification
```

Priorité commerciale :

```text
P2
Boost
Abonnements professionnels
Paiement
Statistiques
```

Priorité future :

```text
P3
IA
Inspection
Livraison
Financement
Assurance
Application mobile native
```

---

# 38. Principe directeur

Le logiciel doit rester :

```text
Simple
Rapide
Mobile-first
Sécurisé
Scalable
Facile à maintenir
```

Le MVP doit résoudre un problème précis :

> **Permettre à quelqu'un de trouver ou vendre une moto rapidement et avec suffisamment de confiance pour contacter le vendeur.**

Ne pas ajouter une fonctionnalité uniquement parce qu'elle est techniquement intéressante. Chaque fonctionnalité doit améliorer :

- la découverte ;
- la confiance ;
- la conversion ;
- la vente ;
- ou les revenus de la plateforme.

