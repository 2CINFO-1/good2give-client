import { User } from './user.model';

export enum ReclamationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

export interface Reclamation {
  _id: string;
  userId: User;
  title: string;
  subject: string;
  status: ReclamationStatus;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReclamationRequest {
  title: string;
  subject: string;
  status?: ReclamationStatus;
  date?: string;
}

export interface ReclamationResponse {
  _id: string;
  userId: User;
  title: string;
  subject: string;
  status: ReclamationStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Resolution models
export interface ReclamationResolution {
  _id: string;
  reclamationId: string;
  adminId: User;
  resolution: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReclamationResolutionRequest {
  reclamationId: string;
  resolution: string;
  date?: string;
}

export interface ReclamationResolutionResponse {
  _id: string;
  reclamationId: string;
  adminId: User;
  resolution: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
