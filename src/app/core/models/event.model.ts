import { User } from './user.model';

export interface Event {
  _id: string;
  beneficiaryid: User;
  title: string;
  objective: string;
  numbre: number;
  date: Date;
  location: string;
  latitude?: number;
  longitude?: number;
  foodSuggestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDto {
  beneficiaryid: string;
  title: string;
  objective: string;
  numbre: number;
  date: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateEventDto {
  title?: string;
  objective?: string;
  numbre?: number;
  date?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface EventSerializer {
  _id: string;
  beneficiaryid: User;
  title: string;
  objective: string;
  numbre: number;
  date: Date;
  location: string;
  latitude: number;
  longitude: number;
  foodSuggestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}
