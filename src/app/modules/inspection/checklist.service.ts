import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Checklist } from 'src/app/core/models/inspection.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private baseUrl = `${environment.apiUrl}/checklist`;

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

  getByInspectionReport(inspectionReportId: string): Observable<Checklist> {
    return this.http
      .get<Checklist>(`${environment.apiUrl}/checklist/inspection-report/${inspectionReportId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError('fetch checklist')));
  }

  update(id: string, checklist: Partial<Checklist>): Observable<Checklist> {
    return this.http
      .put<Checklist>(`${this.baseUrl}/${id}`, checklist, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError('update checklist')));
  }
} 