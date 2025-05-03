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
  quantity: number;
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
  donorName: string;
  items: DonationItem[];
  pickupAddress: string;
  pickupDate: Date;
  notes?: string;
}

export interface DonationResponse extends Donation {
  // Add any additional fields returned by the API
}
