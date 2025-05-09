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
