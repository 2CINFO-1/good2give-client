export enum DonationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COLLECTED = 'collected',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface DonationItem {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  expiryDate?: Date;
  photos?: string[];
}

export interface Donation {
  _id: string;
  donorId: string;
  donorName: string;
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
  items: Omit<DonationItem, 'productId'>[];
  pickupAddress: string;
  pickupDate: Date;
  notes?: string;
}
