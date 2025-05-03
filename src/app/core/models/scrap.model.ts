import { User } from './user.model';
import { Stock } from './stock.model';

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
  DONATION = 'donation',
  OTHER = 'other',
}

export interface Scrap {
  _id: string;
  stock: Stock | string;
  quantity: number;
  reason: ScrapReason;
  disposalMethod: DisposalMethod;
  disposalDate: Date;
  authorizedBy: User | string;
  notes?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScrapRequest {
  stockId: string;
  quantity: number;
  reason: ScrapReason;
  disposalMethod: DisposalMethod;
  disposalDate: Date;
  notes?: string;
  photos?: string[];
}
