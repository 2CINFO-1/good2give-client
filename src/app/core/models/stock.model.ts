import { Product } from './product.model';
import { User } from './user.model';

export enum StockStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  ALLOCATED = 'allocated',
  EXPIRED = 'expired',
  SCRAPPED = 'scrapped',
}

export interface Stock {
  _id: string;
  productId: string;
  quantity: number;
  location: string;
  expiryDate: string;
  batchNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockAdjustment {
  _id: string;
  stock: Stock | string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: string;
  performedBy: User | string;
  createdAt: Date;
}

export interface StockRequest {
  product: string;
  quantity: number;
  expiryDate?: Date;
  batchNumber?: string;
  donationSource?: string;
  location: string;
}
