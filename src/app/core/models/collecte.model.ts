import { User } from './user.model';

export enum CollecteStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface CollecteItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface Collecte {
  _id: string;
  items: CollecteItem[];
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
  items: CollecteItem[];
  transporterId?: string;
  scheduledDate: Date;
  notes?: string;
}
