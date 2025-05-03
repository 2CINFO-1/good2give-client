import { User } from './user.model';
import { Stock } from './stock.model';

export enum InspectionResult {
  PASSED = 'passed',
  CONDITIONAL_PASS = 'conditional_pass',
  FAILED = 'failed',
}

export interface Inspection {
  _id: string;
  stock: Stock | string;
  inspector: User | string;
  inspectionDate: Date;
  result: InspectionResult;
  notes: string;
  recommendedAction?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InspectionRequest {
  stockId: string;
  result: InspectionResult;
  notes: string;
  recommendedAction?: string;
  photos?: string[];
}
