import { User } from './user.model';

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
  deliveryPersonId: string; // Reference to the user assigned for delivery
  deliveryPersonName?: string; // Name of the delivery person
  status: DeliveryStatus;
  scheduledDate: Date;
  address: string;
  notes?: string;
  items: DeliveryItem[]; // Adding items directly to delivery
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryRequest {
  deliveryPersonId?: string;
  scheduledDate: Date;
  address: string;
  notes?: string;
  items: DeliveryItem[]; // Adding items directly to request
}

export interface DeliveryResponse extends Delivery {
  // Any additional fields returned by the API
}
