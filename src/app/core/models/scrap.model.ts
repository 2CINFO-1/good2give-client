import { User } from './user.model';

/**
 * FoodScrap interface that matches the backend IScrap model
 */
export interface FoodScrap {
  _id: string;
  beneficiaryid: User | string;
  title: string;
  objective: string;
  location: string;
  foodItems: string[];
  dateOfScrapping: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * FoodScrap creation request matching backend CreateFoodScrapDto
 */
export interface FoodScrapRequest {
  beneficiaryid: string;
  title: string;
  objective: string;
  location: string;
  foodItems: string[];
  dateOfScrapping: string;
}

/**
 * FoodScrap response from API
 */
export interface FoodScrapResponse extends FoodScrap {
  _id: string;
  beneficiaryid: User;
  title: string;
  objective: string;
  location: string;
  foodItems: string[];
  dateOfScrapping: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Legacy types kept for backward compatibility with frontend components
// These should be gradually phased out
export enum ScrapReason {
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
  CONTAMINATED = 'contaminated',
  RECALLED = 'recalled',
  OTHER = 'other',
}

export enum DisposalMethod {
  RECYCLING = 'recycling',
  COMPOST = 'compost',
  LANDFILL = 'landfill',
  HAZARDOUS_WASTE = 'hazardous_waste',
  OTHER = 'other',
}

export enum ScrapSource {
  INVENTORY = 'inventory',
  DELIVERY = 'delivery',
  COLLECTION = 'collection',
  OTHER = 'other',
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
}

/**
 * @deprecated Use FoodScrap instead
 */
export interface Scrap extends FoodScrap {
  stock?: any;
  quantity?: number;
  reason?: ScrapReason;
  disposalMethod?: DisposalMethod;
  disposalDate?: Date | string;
  authorizedBy?: User | string;
  notes?: string;
  photos?: string[];
}

/**
 * @deprecated Use FoodScrapRequest instead
 */
export interface ScrapRequest extends Partial<FoodScrapRequest> {
  stockId?: string;
  quantity?: number;
  reason?: ScrapReason;
  disposalMethod?: DisposalMethod;
  disposalDate?: Date | string;
  notes?: string;
  photos?: string[];
}

/**
 * @deprecated Use FoodScrapResponse instead
 */
export interface ScrapResponse extends FoodScrapResponse {
  // Legacy properties
}
