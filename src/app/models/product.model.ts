export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  minStock?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  allergens?: string[];
  nutritionInfo?: string;
  trackExpiration?: boolean;
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

export enum ProductUnit {
  KG = 'kg',
  G = 'g',
  LITER = 'liter',
  ML = 'ml',
  PIECE = 'piece',
  BOX = 'box',
  PACK = 'pack',
}

export interface ProductRequest {
  name: string;
  category: ProductCategory;
  description: string;
  unit: ProductUnit;
  minStock?: number;
  allergens?: string[];
  nutritionInfo?: string;
  trackExpiration?: boolean;
}
