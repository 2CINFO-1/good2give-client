import { User } from './user.model';

export enum DonationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COLLECTED = 'collected',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface DonationItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  description?: string;
  expiryDate?: Date;
  photos?: string[];
}

export interface Donation {
  _id: string;
  donor: User | string;
  items: DonationItem[];
  status: DonationStatus;
  pickupAddress: string;
  pickupDate: Date;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DonationRequest {
  items: Omit<DonationItem, '_id'>[];
  pickupAddress: string;
  pickupDate: Date;
  notes?: string;
}
