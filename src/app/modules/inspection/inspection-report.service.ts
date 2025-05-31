import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InspectionReport, Checklist } from 'src/app/core/models/inspection.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InspectionReportService {
  private baseUrl = `${environment.apiUrl}/inspection-report`;
  private checklistUrl = `${environment.apiUrl}/checklist`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  private handleError(operation: string) {
    return (err: any) => {
      console.error(`Error ${operation}:`, err);
      return throwError(() => new Error(err.error?.message || `Failed to ${operation}`));
    };
  }

  create(report: Partial<InspectionReport>): Observable<InspectionReport> {
    return this.http
      .post<InspectionReport>(this.baseUrl, report, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('create inspection report')));
  }

  getAll(): Observable<InspectionReport[]> {
    return this.http
      .get<InspectionReport[]>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch inspection reports')));
  }

  getById(id: string): Observable<InspectionReport> {
    return this.http
      .get<InspectionReport>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch inspection report')));
  }

  update(id: string, updateData: any): Observable<InspectionReport> {
    return this.http
      .put<InspectionReport>(`${this.baseUrl}/${id}`, updateData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('update inspection report')));
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('delete inspection report')));
  }

  getMyInspections(): Observable<InspectionReport[]> {
    return this.http
      .get<InspectionReport[]>(`${this.baseUrl}/my-inspections`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch my inspections')));
  }

  getMyHistory(): Observable<InspectionReport[]> {
    return this.http
      .get<InspectionReport[]>(`${this.baseUrl}/my-history`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch my history')));
  }

  getChecklist(checklistId: string): Observable<Checklist> {
    return this.http
      .get<Checklist>(`${this.checklistUrl}/${checklistId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch checklist')));
  }

  getChecklistByInspectionId(inspectionId: string): Observable<Checklist> {
    return this.http
      .get<Checklist>(`${this.checklistUrl}/inspection-report/${inspectionId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch checklist by inspection')));
  }

  updateChecklist(checklistId: string, checklist: Checklist): Observable<Checklist> {
    return this.http
      .put<Checklist>(`${this.checklistUrl}/${checklistId}`, checklist, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('update checklist')));
  }

  // Get all unassigned inspection reports
  getUnassignedReports(): Observable<InspectionReport[]> {
    return this.http
      .get<InspectionReport[]>(`${this.baseUrl}/unassigned`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch unassigned reports')));
  }

  // Assign inspection to current inspector
  assignToMe(reportId: string): Observable<InspectionReport> {
    return this.http
      .post<InspectionReport>(`${this.baseUrl}/${reportId}/assign`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('assign inspection')));
  }

  // Update inspection status
  updateStatus(reportId: string, status: 'approved' | 'rejected'): Observable<InspectionReport> {
    return this.http
      .put<InspectionReport>(
        `${this.baseUrl}/${reportId}`,
        { status },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError('update inspection status')));
  }

  // Get checklists by inspector
  getChecklistsByInspector(inspectorId: string): Observable<Checklist[]> {
    return this.http
      .get<Checklist[]>(`${this.checklistUrl}/inspector/${inspectorId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError('fetch inspector checklists')));
  }
}
