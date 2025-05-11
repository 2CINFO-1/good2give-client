export enum CollecteStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface Collecte {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: CollecteStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  createdAt: Date | string;
  updatedAt: Date | string;
}
