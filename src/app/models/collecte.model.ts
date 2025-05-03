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
  title: string;
  description: string;
  location: string;
  status: CollecteStatus;
  createdAt: string;
  updatedAt: string;
  donation: string | any; // Reference to donation ID or populated donation
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  transporter?: string | any; // Reference to transporter ID or populated transporter
}

export interface CollecteRequest {
  title: string;
  description: string;
  location: string;
  status?: CollecteStatus;
}

export interface CollecteResponse {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: CollecteStatus;
  createdAt: string;
  updatedAt: string;
}
