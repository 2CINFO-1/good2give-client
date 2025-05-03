import { User } from './user.model';
import { Stock } from './stock.model';

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface DeliveryItem {
  stock: Stock | string;
  quantity: number;
}

export interface Delivery {
  _id: string;
  items: DeliveryItem[];
  beneficiary: User | string;
  transporter?: User | string;
  status: DeliveryStatus;
  deliveryAddress: string;
  scheduledDate: Date;
  completedDate?: Date;
  notes?: string;
  failureReason?: string;
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryRequest {
  items: { stockId: string; quantity: number }[];
  beneficiaryId: string;
  deliveryAddress: string;
  scheduledDate: Date;
  notes?: string;
}
