import { User } from './user.model';

/**
 * Product status enum matching backend values
 */
export enum ProductStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  AVAILABLE = 'Available',
  DONATED = 'Donated',
}

/**
 * Product interface matching backend IProduct
 */
export interface Product {
  _id: string;
  name: string;
  productType: string;
  category: string;
  donatorId: User | string;
  description: string;
  status: ProductStatus | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Product creation request
 */
export interface ProductRequest {
  name: string;
  productType: string;
  category: string;
  donatorId?: string;
}

/**
 * Product response from API
 */
export interface ProductResponse {
  _id: string;
  name: string;
  productType: string;
  category: string;
  donatorId: User | string;
  description: string;
  status: ProductStatus | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
