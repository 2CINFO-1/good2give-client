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
  inspectorId: User | string;
  type: ChecklistType;
  items: ChecklistItem[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ChecklistRequest {
  type: ChecklistType;
  items: ChecklistItem[];
}

export interface ChecklistResponse {
  _id: string;
  inspectorId: User | string;
  type: ChecklistType;
  items: ChecklistItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
