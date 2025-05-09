export type IssueSeverity = 'low' | 'medium' | 'high';

export interface Issue {
  _id?: string;
  inspectorId: string;
  inspectionId: string;
  type: string;
  description: string;
  severity: IssueSeverity;
  resolved: boolean;
  resolvedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}
