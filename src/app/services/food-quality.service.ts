import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Checklist,
  ChecklistRequest,
  ChecklistResponse,
  ChecklistType,
} from '../models/checklist.model';
import {
  InspectionReport,
  CreateInspectionReportRequest,
  UpdateInspectionReportRequest,
  InspectionReportResponse,
  InspectionStatus,
} from '../models/inspection-report.model';

@Injectable({
  providedIn: 'root',
})
export class FoodQualityService {
  private checklistUrl = `${environment.apiUrl}/checklists`;
  private inspectionUrl = `${environment.apiUrl}/inspection-reports`;

  constructor(private http: HttpClient) {}

  // Checklist endpoints
  getAllChecklists(): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(this.checklistUrl);
  }

  getChecklistById(id: string): Observable<Checklist> {
    return this.http.get<Checklist>(`${this.checklistUrl}/${id}`);
  }

  createChecklist(data: ChecklistRequest): Observable<ChecklistResponse> {
    return this.http.post<ChecklistResponse>(this.checklistUrl, data);
  }

  updateChecklist(
    id: string,
    data: Partial<ChecklistRequest>
  ): Observable<ChecklistResponse> {
    return this.http.put<ChecklistResponse>(`${this.checklistUrl}/${id}`, data);
  }

  deleteChecklist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.checklistUrl}/${id}`);
  }

  // Get checklists by type
  getChecklistsByType(type: ChecklistType): Observable<Checklist[]> {
    return this.http.get<Checklist[]>(`${this.checklistUrl}/type/${type}`);
  }

  // Inspection report endpoints
  getAllInspectionReports(): Observable<InspectionReport[]> {
    return this.http.get<InspectionReport[]>(this.inspectionUrl);
  }

  getInspectionReportById(id: string): Observable<InspectionReport> {
    return this.http.get<InspectionReport>(`${this.inspectionUrl}/${id}`);
  }

  createInspectionReport(
    data: CreateInspectionReportRequest
  ): Observable<InspectionReportResponse> {
    return this.http.post<InspectionReportResponse>(this.inspectionUrl, data);
  }

  updateInspectionReport(
    id: string,
    data: UpdateInspectionReportRequest
  ): Observable<InspectionReportResponse> {
    return this.http.put<InspectionReportResponse>(
      `${this.inspectionUrl}/${id}`,
      data
    );
  }

  deleteInspectionReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.inspectionUrl}/${id}`);
  }

  // Get reports by status
  getReportsByStatus(status: InspectionStatus): Observable<InspectionReport[]> {
    return this.http.get<InspectionReport[]>(
      `${this.inspectionUrl}/status/${status}`
    );
  }

  // Get reports for a specific delivery
  getReportsForDelivery(deliveryId: string): Observable<InspectionReport[]> {
    return this.http.get<InspectionReport[]>(
      `${this.inspectionUrl}/delivery/${deliveryId}`
    );
  }

  // Get reports for a specific depot
  getReportsForDepot(depotId: string): Observable<InspectionReport[]> {
    return this.http.get<InspectionReport[]>(
      `${this.inspectionUrl}/depot/${depotId}`
    );
  }
}
