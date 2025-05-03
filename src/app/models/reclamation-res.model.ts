import { User } from './user.model';
import { Reclamation } from './reclamation.model';

export interface ReclamationResolution {
  _id: string;
  reclamid: Reclamation;
  resolnote: string;
  picid: User;
}

export interface ReclamationResolutionRequest {
  reclamid: string;
  resolnote: string;
}

export interface ReclamationResolutionResponse {
  _id: string;
  reclamid: Reclamation;
  resolnote: string;
  picid: User;
}
