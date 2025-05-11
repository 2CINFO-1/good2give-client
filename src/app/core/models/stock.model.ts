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

export interface StockItem {
  _id: string;
  productId: string;
  releasedAt?: string;
  donatorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockRequest {
  productId: string;
  quantity: number;
  source?: string;
  notes?: string;
  releasedAt?: string;
  donatorId?: string;
}

export interface StockResponse {
  _id: string;
  productId: string;
  releasedAt?: string;
  donatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustment {
  _id?: string;
  stock?: Stock | string;
  productId?: string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: string;
  performedBy?: User | string;
  location?: string;
  createdAt?: Date;
}
