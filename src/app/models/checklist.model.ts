import { User } from './user.model';

export interface ChecklistItem {
  item: string;
  description: string;
  required: boolean;
  checked: boolean;
  passed: boolean | null;
}

export enum ChecklistType {
  DELIVERY = 'delivery',
  DEPOT = 'depot',
}

export interface Checklist {
  _id: string;
  type: ChecklistType;
  items: ChecklistItem[];
  inspectorId: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChecklistRequest {
  type: ChecklistType;
  items: ChecklistItem[];
}

export interface ChecklistResponse {
  _id: string;
  type: ChecklistType;
  items: ChecklistItem[];
  inspectorId: User;
  createdAt: string;
  updatedAt: string;
}
