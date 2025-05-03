import { User } from './user.model';
import { Donation } from './donation.model';

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

export interface Delivery {
  _id: string;
  donation: string | Donation; // Reference to donation ID or populated donation
  deliveryPersonId: string; // Reference to the user assigned for delivery
  deliveryPersonName?: string; // Name of the delivery person
  status: DeliveryStatus;
  scheduledDate: Date;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryRequest {
  donation: string;
  deliveryPersonId?: string;
  scheduledDate: Date;
  address: string;
  notes?: string;
}

export interface DeliveryResponse extends Delivery {
  // Any additional fields returned by the API
}
