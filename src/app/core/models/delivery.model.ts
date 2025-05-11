import { User } from './user.model';

export enum DeliveryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export interface Delivery {
  _id: string;
  donator: User | string; // Can be User object or ObjectId string
  beneficiary: User | string;
  transporter?: User | string;
  status: DeliveryStatus;
  pickupDate?: Date | string;
  expectedDeliveryDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DeliveryRequest {
  donorId: string;
  beneficiaryId: string;
  transporterId?: string;
  pickupDate?: Date | string;
  expectedDeliveryDate?: Date | string;
  status?: DeliveryStatus;
}

export interface DeliveryResponse {
  _id: string;
  donator: User | string;
  beneficiary: User | string;
  transporter?: User | string;
  status: DeliveryStatus;
  pickupDate?: Date | string;
  expectedDeliveryDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}