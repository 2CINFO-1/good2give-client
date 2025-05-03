import { User } from './user.model';
import { Delivery } from './delivery.model';

export enum ReclamationStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ReclamationCategory {
  QUALITY = 'quality',
  QUANTITY = 'quantity',
  DELIVERY = 'delivery',
  SERVICE = 'service',
  OTHER = 'other',
}

export interface Reclamation {
  _id: string;
  title: string;
  description: string;
  category: ReclamationCategory;
  submittedBy: User | string;
  assignedTo?: User | string;
  delivery?: Delivery | string;
  status: ReclamationStatus;
  photos?: string[];
  resolution?: string;
  resolutionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReclamationRequest {
  title: string;
  description: string;
  category: ReclamationCategory;
  deliveryId?: string;
  photos?: string[];
}
