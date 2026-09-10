export type UserRole = 'USER' | 'PRO' | 'ADMIN';

export type MotorcycleStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'SOLD'
  | 'PAUSED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'DELETED';

export type MotorcycleType =
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

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MotorcycleImage {
  id: string;
  url: string;
  position: number;
  isPrimary: boolean;
}

export interface SellerSummary {
  id: string;
  firstName: string;
  avatar?: string;
  isVerifiedSeller: boolean;
  sellerType: SellerType;
  businessName?: string;
  averageRating: number;
}

export interface MotorcycleSummary {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  engineCc: number;
  city: string;
  status: MotorcycleStatus;
  isFeatured: boolean;
  primaryImage?: MotorcycleImage;
  brand: Brand;
  model: MotorcycleModel;
  seller: SellerSummary;
  createdAt: string;
}

export interface Motorcycle extends MotorcycleSummary {
  sellerId: string;
  brandId: string;
  modelId: string;
  categoryId?: string;
  isPriceNegotiable: boolean;
  description: string;
  type: MotorcycleType;
  fuel: FuelType;
  transmission: TransmissionType;
  condition: ConditionType;
  district?: string;
  publishedAt?: string;
  expiresAt?: string;
  maintenanceInfo?: string;
  papersInfo?: string;
  modifications?: string;
  viewsCount: number;
  images: MotorcycleImage[];
  category?: Category;
  favoritesCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface Conversation {
  id: string;
  motorcycleId: string;
  buyerId: string;
  sellerId: string;
  motorcycle: MotorcycleSummary;
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

export interface Review {
  id: string;
  reviewerId: string;
  sellerId: string;
  motorcycleId?: string;
  rating: number;
  comment?: string;
  reviewer?: UserPublic;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  motorcycleId: string;
  reason: ReportReason;
  description?: string;
  status: string;
  createdAt: string;
}
