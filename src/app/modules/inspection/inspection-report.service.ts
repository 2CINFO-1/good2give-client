import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InspectionReport } from 'src/app/core/models/inspection.model';

   @Injectable({
     providedIn: 'root',
   })
   export class InspectionReportService {
     private baseUrl = 'http://localhost:3000/api/inspection-report';

     constructor(private http: HttpClient) {}

private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Adjust based on your auth mechanism
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  create(report: Partial<InspectionReport>): Observable<InspectionReport> {
    return this.http
      .post<InspectionReport>(this.baseUrl, report, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Error creating inspection report:', err);
          return throwError(() => new Error(err.error?.message || 'Failed to create inspection report'));
        })
      );
  }

  getAll(): Observable<InspectionReport[]> {
     var a = this.http
      .get<InspectionReport[]>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Error fetching inspection reports:', err);
          return throwError(() => new Error(err.error?.message || 'Failed to fetch inspection reports'));
        })
      );
      console.log(a)
      return a
  }

  getById(id: string): Observable<InspectionReport> {
    return this.http
      .get<InspectionReport>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          console.error(`Error fetching inspection report with ID ${id}:`, err);
          return throwError(() => new Error(err.error?.message || 'Failed to fetch inspection report'));
        })
      );
  }

  update(id: string, report: Partial<InspectionReport>): Observable<InspectionReport> {
    return this.http
      .put<InspectionReport>(`${this.baseUrl}/${id}`, report, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          console.error(`Error updating inspection report with ID ${id}:`, err);
          return throwError(() => new Error(err.error?.message || 'Failed to update inspection report'));
        })
      );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((err) => {
          console.error(`Error deleting inspection report with ID ${id}:`, err);
          return throwError(() => new Error(err.error?.message || 'Failed to delete inspection report'));
        })
      );
  }
}
