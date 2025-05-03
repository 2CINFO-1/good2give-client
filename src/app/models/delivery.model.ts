export enum DeliveryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface DeliveryItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface DonationDetails {
  _id: string;
  donorName: string;
  items: DeliveryItem[];
}

export interface Delivery {
  _id: string;
  donationId: string;
  donation: DonationDetails;
  status: DeliveryStatus | string;
  scheduledDate: Date;
  completedDate?: Date;
  address: string;
  recipientName: string;
  recipientId: string;
  deliveryPersonName?: string;
  deliveryPersonId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryRequest {
  donationId: string;
  scheduledDate: Date;
  address: string;
  recipientId: string;
  notes?: string;
}
