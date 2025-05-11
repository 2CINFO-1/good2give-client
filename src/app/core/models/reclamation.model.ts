import { User } from './user.model';

export enum ReclamationStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
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
  userid: User | string;
  title: string;
  subject: string;
  status: ReclamationStatus;
  date: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ReclamationRequest {
  userid: string;
  title: string;
  subject: string;
  date: string | Date;
}

export interface ReclamationResponse extends Reclamation {
  // Any additional fields that might be returned by the API
}

// ReclamationRES models (resolution models)
export interface ReclamationResolution {
  _id: string;
  reclamid: string;
  resolnote: string;
  picid: User | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ReclamationResolutionRequest {
  reclamid: string;
  resolnote: string;
  picid: string;
}

export interface ReclamationResolutionResponse extends ReclamationResolution {
  // Any additional fields that might be returned by the API
}
