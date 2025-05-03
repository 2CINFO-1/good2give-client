export enum ProductCategory {
  FOOD = 'food',
  CLOTHING = 'clothing',
  HOUSEHOLD = 'household',
  HYGIENE = 'hygiene',
  MEDICAL = 'medical',
  BABY = 'baby',
  OTHER = 'other',
}

export enum ProductUnit {
  PIECE = 'piece',
  KG = 'kg',
  LITER = 'liter',
  BOX = 'box',
  PACK = 'pack',
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  minStock?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  category: ProductCategory;
  description: string;
  unit: ProductUnit;
  shelfLife?: number;
  storageConditions?: string;
  photos?: string[];
}
