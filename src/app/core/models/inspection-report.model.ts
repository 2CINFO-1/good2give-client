import { User } from './user.model';
import { Checklist } from './checklist.model';
import { Delivery } from './delivery.model';
import { Stock } from './stock.model';

export interface InspectionResult {
  item: string;
  status: 'pass' | 'fail';
  comment?: string;
}

export enum InspectionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Issue {
  _id: string;
  inspectorId: User | string;
  inspectionId: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolvedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InspectionReport {
  _id: string;
  inspectorId: User | string;
  checklistId: Checklist | string;
  deliveryId?: Delivery | string;
  depotId?: Stock | string;
  inspectionDate: Date;
  scheduledDate?: Date;
  results: InspectionResult[];
  issues: Issue[] | string[];
  status: InspectionStatus;
  inspectorNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateInspectionReportDto {
  checklistId: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate: Date;
  scheduledDate?: Date;
  results: InspectionResult[];
  issues?: string[];
  status: InspectionStatus;
  inspectorNotes?: string;
}

export interface UpdateInspectionReportDto {
  checklistId?: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate?: Date;
  scheduledDate?: Date;
  results?: InspectionResult[];
  issues?: string[];
  status?: InspectionStatus;
  inspectorNotes?: string;
}

export interface InspectionReportSerializer {
  _id: string;
  inspectorId: User | string;
  checklistId: Checklist | string;
  deliveryId?: Delivery | string;
  depotId?: Stock | string;
  inspectionDate: Date;
  scheduledDate?: Date;
  results: InspectionResult[];
  issues: Issue[] | string[];
  status: InspectionStatus;
  inspectorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
