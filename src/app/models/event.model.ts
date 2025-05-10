import { User } from './user.model';

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Event {
  _id: string;
  beneficiaryid: User;
  title: string;
  objective: string;
  numbre: number;
  date: string;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRequest {
  title: string;
  objective: string;
  numbre: number;
  date: string;
  status: EventStatus;
}

export interface EventResponse {
  _id: string;
  beneficiaryid: User;
  title: string;
  objective: string;
  numbre: number;
  date: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}
