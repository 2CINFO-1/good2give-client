import { Product } from './product.model';
import { User } from './user.model';

/**
 * Stock status enum
 * Note: This is not part of the backend model but useful for frontend display
 */
export enum StockStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  ALLOCATED = 'allocated',
  EXPIRED = 'expired',
  SCRAPPED = 'scrapped',
}

/**
 * Stock interface matching backend IStock model
 */
export interface Stock {
  _id: string;
  productId: Product | string;
  releasedAt?: string;
  donatorId: User | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Stock creation request matching backend CreateStockDto
 */
export interface StockRequest {
  productId: string;
  donatorId?: string;
}

/**
 * Stock update request matching backend UpdateStockDto
 */
export interface StockUpdateRequest {
  releasedAt: string;
}

/**
 * Stock response from API
 */
export interface StockResponse extends Stock {
  _id: string;
  productId: Product | string;
  releasedAt?: string;
  donatorId: User | string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
