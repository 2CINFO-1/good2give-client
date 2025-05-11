/**
 * This model doesn't exist exactly as-is in the backend server.
 * The backend uses the foodQualitySafety module with InspectionReport model instead.
 * This is maintained for frontend compatibility only.
 */

import { User } from './user.model';

export enum InspectionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface InspectionResult {
  item: string;
  status: 'pass' | 'fail';
  comment?: string;
}

export interface Inspection {
  _id: string;
  inspectorId: User | string;
  checklistId: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate: Date;
  scheduledDate?: Date;
  results: InspectionResult[];
  issues: string[];
  status: InspectionStatus;
  inspectorNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InspectionRequest {
  inspectorId: string;
  checklistId: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate: Date;
  scheduledDate?: Date;
  results: InspectionResult[];
  status?: InspectionStatus;
  inspectorNotes?: string;
}

export interface InspectionResponse {
  _id: string;
  inspectorId: User | string;
  checklistId: string;
  deliveryId?: string;
  depotId?: string;
  inspectionDate: Date;
  scheduledDate?: Date;
  results: InspectionResult[];
  issues: string[];
  status: InspectionStatus;
  inspectorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
