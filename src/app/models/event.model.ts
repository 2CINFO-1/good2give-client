export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees?: number;
  capacity?: number;
  imageUrl?: string;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface EventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  capacity?: number;
  imageUrl?: string;
}
