export interface InspectionResult {
  item: string;
  status: 'pass' | 'fail';
  comment?: string;
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
  checklistId?: string; // Optional for list, required for create
  inspectorId: Inspector; // For inspector name in list
  deliveryId?: string | null;
  depotId?: string | null;
  inspectionDate: string; // ISO 8601 string
  scheduledDate?: string | null;
  results: InspectionResult[];
  issues: string[];
  status: 'pending' | 'approved' | 'rejected';
  inspectorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}
