import { User } from './user.model';

export interface Product {
  _id: string;
  name: string;
  productType: ProductType;
  category: ProductCategory;
  description: string;
  donatorId: User;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum ProductCategory {
  GRAINS = 'Grains',
  LEGUMES = 'Legumes',
  DAIRY = 'Dairy',
  BAKING = 'Baking',
  COOKING = 'Cooking',
  SEASONING = 'Seasoning',
  VEGETABLES = 'Vegetables',
  FRUITS = 'Fruits',
  PROTEIN = 'Protein',
  OTHER = 'Other',
}

export enum ProductType {
  PERISHABLE = 'Perishable',
  NON_PERISHABLE = 'Non-Perishable',
  FROZEN = 'Frozen',
  REFRIGERATED = 'Refrigerated',
  CANNED = 'Canned',
  DRIED = 'Dried',
  OTHER = 'Other',
}

export interface ProductRequest {
  name: string;
  productType: ProductType;
  category: ProductCategory;
  description: string;
  status?: string;
}

export interface ProductResponse {
  _id: string;
  name: string;
  productType: ProductType;
  category: ProductCategory;
  description: string;
  donatorId: User;
  status?: string;
  createdAt: string;
  updatedAt: string;
}
