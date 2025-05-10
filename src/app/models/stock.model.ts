import { Product } from './product.model';
import { User } from './user.model';

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
  releasedAt?: string;
  donatorId: string;
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
  productId: string;
  quantity: number;
  adjustmentType: 'increase' | 'decrease';
  reason?: string;
  location?: string;
}
