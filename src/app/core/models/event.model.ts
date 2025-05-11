import { User } from './user.model';

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PLANNED = 'planned',
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  objective?: string;
  location?: string;
  beneficiaryid?: User;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  organizer?: User | string;
  participants?: (User | string)[];
  status: EventStatus;
  capacity?: number;
  numbre?: number;
  registeredCount?: number;
  photos?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EventRequest {
  title: string;
  description?: string;
  objective?: string;
  location?: string;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  status?: EventStatus;
  capacity?: number;
  numbre?: number;
  photos?: string[];
}

export interface EventResponse {
  _id: string;
  title: string;
  description?: string;
  objective?: string;
  location?: string;
  beneficiaryid?: User;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  organizer?: User | string;
  participants?: (User | string)[];
  status: EventStatus;
  capacity?: number;
  numbre?: number;
  registeredCount?: number;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}
