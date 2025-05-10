import { User } from './user.model';
import { Checklist } from './checklist.model';
import { Delivery } from './delivery.model';

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

export interface InspectionReport {
  _id: string;
  inspectorId: User;
  checklistId: Checklist;
  deliveryId?: Delivery;
  depotId?: string;
  inspectionDate: string;
  results: InspectionResult[];
  issues: string[];
  status: InspectionStatus;
  inspectorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInspectionReportRequest {
  checklistId: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate: string;
  scheduledDate?: string;
  results: InspectionResult[];
  issues?: string[];
  status: InspectionStatus;
  inspectorNotes?: string;
}

export interface UpdateInspectionReportRequest {
  checklistId?: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate?: string;
  scheduledDate?: string;
  results?: InspectionResult[];
  issues?: string[];
  status?: InspectionStatus;
  inspectorNotes?: string;
}

export interface InspectionReportResponse {
  _id: string;
  inspectorId: User;
  checklistId: Checklist;
  deliveryId?: Delivery;
  depotId?: string;
  inspectionDate: string;
  results: InspectionResult[];
  issues: string[];
  status: InspectionStatus;
  inspectorNotes?: string;
  createdAt: string;
  updatedAt: string;
}
