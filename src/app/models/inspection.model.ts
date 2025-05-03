export interface Inspection {
  _id: string;
  stockId: string;
  date: string;
  inspector: string;
  status: InspectionStatus;
  notes?: string;
  findings: InspectionFinding[];
  createdAt?: string;
  updatedAt?: string;
}

export enum InspectionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PASSED = 'passed',
}

export interface InspectionFinding {
  type: FindingType;
  description: string;
  severity: FindingSeverity;
  actionRequired?: string;
  resolved?: boolean;
}

export enum FindingType {
  QUALITY = 'quality',
  SAFETY = 'safety',
  COMPLIANCE = 'compliance',
  OTHER = 'other',
}

export enum FindingSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface InspectionRequest {
  stockId: string;
  inspector: string;
  notes?: string;
  findings: Omit<InspectionFinding, 'resolved'>[];
}
