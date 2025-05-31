export type IssueSeverity = 'low' | 'medium' | 'high';
export type IssueStatus = 'failed' | 'reviewing' | 'rejected';

export interface Issue {
  _id?: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'reviewing' | 'failed' | 'rejected';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Inspector {
  _id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
  avatar: string;
  createdAt: string;
}

export interface InspectionReport {
  _id: string;
  name: string;
  note?: string;
  inspectorId: Inspector;
  deliveryId?: string | null;
  depotId?: string | null;
  checklistId?: string;
  inspectionDate: Date;
  scheduledDate?: Date | null;
  issue?: Issue | null;
  status: 'pending' | 'approved' | 'rejected';
  inspectorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChecklistItem {
  _id?: string;
  item: string;
  description: string;
  required: boolean;
  checked: boolean;
  passed: boolean | null;
}

export interface Checklist {
  _id: string;
  inspectorId: Inspector | string;
  type: 'delivery' | 'depot' | 'product';
  items: ChecklistItem[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
