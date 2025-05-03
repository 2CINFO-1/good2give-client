import { User } from './user.model';

export enum EventStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizer: User | string;
  participants?: (User | string)[];
  status: EventStatus;
  capacity?: number;
  registeredCount?: number;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRequest {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  capacity?: number;
  photos?: string[];
}
