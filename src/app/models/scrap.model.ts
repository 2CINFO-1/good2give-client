import { User } from './user.model';

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface FoodScrap {
  _id: string;
  beneficiaryId: User;
  title: string;
  objective: string;
  location: string;
  foodItems: string[];
  dateOfScrapping: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodScrapRequest {
  title: string;
  objective: string;
  location: string;
  foodItems: string[];
  dateOfScrapping: string;
}

export interface FoodScrapResponse {
  _id: string;
  beneficiaryId: User;
  title: string;
  objective: string;
  location: string;
  foodItems: string[];
  dateOfScrapping: string;
  createdAt: string;
  updatedAt: string;
}
