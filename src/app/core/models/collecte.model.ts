import { User } from './user.model';
import { Donation } from './donation.model';

export enum CollecteStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface Collecte {
  _id: string;
  donation: Donation | string;
  transporter?: User | string;
  status: CollecteStatus;
  scheduledDate: Date;
  completedDate?: Date;
  notes?: string;
  failureReason?: string;
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollecteRequest {
  donationId: string;
  transporterId?: string;
  scheduledDate: Date;
  notes?: string;
}
