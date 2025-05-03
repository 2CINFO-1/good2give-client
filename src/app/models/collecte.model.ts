export interface Collecte {
  _id: string;
  donation: {
    _id: string;
    title?: string;
    description?: string;
  };
  status: CollecteStatus;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  transporter?: {
    _id: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum CollecteStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface CollecteRequest {
  donationId: string;
  scheduledDate: string;
  notes?: string;
}

export interface TransporterAssignment {
  collecteId: string;
  transporterId: string;
}
