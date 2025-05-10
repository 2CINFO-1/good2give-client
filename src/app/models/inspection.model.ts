export type IssueSeverity = 'low' | 'medium' | 'high';
export type IssueStatus = 'failed' | 'reviewing' | 'rejected';

export interface Issue {
  type: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  _id?: string;
}

export interface Inspector {
  _id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionReport {
  _id?: string;
  inspectorId: Inspector; // Changed from string to Inspector object
  deliveryId?: string | null;
  depotId?: string | null;
  checklistId?: string; // Optional, auto-generated
  inspectionDate: string; // ISO 8601 string
  scheduledDate?: string | null;
  issues: Issue[];
  status: 'pending' | 'approved' | 'rejected';
  inspectorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChecklistItem {
  item: string;
  description: string;
  required: boolean;
  checked: boolean;
  passed: boolean | null;
}

export interface Checklist {
  _id?: string;
  inspectorId: string;
  type: 'delivery' | 'depot';
  items: ChecklistItem[];
  createdAt?: string;
  updatedAt?: string;
}
