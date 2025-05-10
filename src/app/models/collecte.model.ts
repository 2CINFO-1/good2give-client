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
  title: string;
  description: string;
  location: string;
  status: CollecteStatus;
  createdAt: string;
  updatedAt: string;
  items: CollecteItem[];
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  transporter?: string | any; // Reference to transporter ID or populated transporter
}

export interface CollecteRequest {
  title: string;
  description: string;
  location: string;
  items: CollecteItem[];
  status?: CollecteStatus;
}

export interface CollecteResponse {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: CollecteStatus;
  items: CollecteItem[];
  createdAt: string;
  updatedAt: string;
}
