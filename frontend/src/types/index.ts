export type UserRole = 'USER' | 'PRO' | 'ADMIN';

export type ListingType = 'MOTORCYCLE' | 'PART' | 'ACCESSORY';

export type ListingStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'SOLD'
  | 'PAUSED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'DELETED';

export type MotorcycleCategory =
  | 'CROSS'
  | 'ROUTE'
  | 'ROADSTER'
  | 'SCOOTER'
  | 'TRAIL'
  | 'CUSTOM'
  | 'AUTRE';

export type FuelType = 'ESSENCE' | 'DIELECTRIQUE' | 'HYBRIDE' | 'ELECTRIQUE';

export type TransmissionType = 'MANUELLE' | 'AUTOMATIQUE' | 'SEMI_AUTO';

export type ConditionType =
  | 'NEUF'
  | 'TRES_BON'
  | 'BON'
  | 'USAGE'
  | 'A_REFORMER';

export type SellerType = 'INDIVIDUAL' | 'PROFESSIONAL';

export type ReportReason =
  | 'FRAUD'
  | 'FAKE_LISTING'
  | 'MISLEADING_PRICE'
  | 'NON_EXISTENT'
  | 'SUSPICIOUS_SELLER'
  | 'FORBIDDEN_CONTENT'
  | 'OTHER';

// ── Marques & Modèles ──

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface MotorcycleModel {
  id: string;
  brandId: string;
  name: string;
  brand?: Brand;
}

// ── Catégories pièces & accessoires ──

export interface PartCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface AccessoryCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// ── Images ──

export interface ListingImage {
  id: string;
  url: string;
  position: number;
  isPrimary: boolean;
}

// ── Vendeur ──

export interface SellerSummary {
  id: string;
  firstName: string;
  avatar?: string;
  isVerifiedSeller: boolean;
  sellerType: SellerType;
  businessName?: string;
  averageRating: number;
}

export interface SellerProfile {
  id: string;
  type: SellerType;
  businessName?: string;
  description?: string;
  logo?: string;
  city: string;
  district?: string;
}

export interface UserPublic {
  id: string;
  firstName: string;
  avatar?: string;
  createdAt: string;
  sellerProfile?: SellerProfile;
  averageRating: number;
  totalSales: number;
  activeListingsCount: number;
}

// ── Annonces (listings) ──

export interface ListingSummary {
  id: string;
  type: ListingType;
  title: string;
  price: number;
  condition: ConditionType;
  city: string;
  status: ListingStatus;
  isFeatured: boolean;
  primaryImage?: ListingImage;
  seller: SellerSummary;
  createdAt: string;

  // Motos uniquement
  brand?: Brand;
  model?: MotorcycleModel;
  year?: number;
  mileage?: number;
  engineCc?: number;

  // Pièces uniquement
  partCategory?: PartCategory;
  compatibleBrands?: string;
  partReference?: string;

  // Accessoires uniquement
  accessoryCategory?: AccessoryCategory;
  accessorySize?: string;
  accessoryColor?: string;
  accessoryBrand?: string;
}

export interface Listing extends ListingSummary {
  sellerId: string;
  brandId?: string;
  modelId?: string;
  motorcycleCategory?: MotorcycleCategory;
  fuel?: FuelType;
  transmission?: TransmissionType;
  isPriceNegotiable: boolean;
  description: string;
  district?: string;
  publishedAt?: string;
  expiresAt?: string;
  maintenanceInfo?: string;
  papersInfo?: string;
  modifications?: string;
  viewsCount: number;
  images: ListingImage[];
  category?: PartCategory | AccessoryCategory;
  favoritesCount: number;
}

// ── Conversations / Messages ──

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  listing: ListingSummary;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// ── Reviews ──

export interface Review {
  id: string;
  reviewerId: string;
  sellerId: string;
  listingId?: string;
  rating: number;
  comment?: string;
  reviewer?: UserPublic;
  createdAt: string;
}

// ── Reports ──

export interface Report {
  id: string;
  reporterId: string;
  listingId: string;
  reason: ReportReason;
  description?: string;
  status: string;
  createdAt: string;
}

// ── Pagination ──

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
