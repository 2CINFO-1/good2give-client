import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Checklist,
  ChecklistRequest,
  ChecklistResponse,
  ChecklistType,
} from '../models/checklist.model';
import {
  InspectionReport,
  InspectionStatus,
  CreateInspectionReportDto,
  UpdateInspectionReportDto,
  InspectionReportSerializer,
} from '../models/inspection-report.model';

@Injectable({
  providedIn: 'root',
})
export class FoodQualityService {
  private apiUrl = `${environment.apiUrl}/food-quality-safety`;

  constructor(private http: HttpClient) {}

  // Checklist Management
  /**
   * Get all checklists
   * @returns Array of checklist objects
   */
  getAllChecklists(): Observable<Checklist[]> {
    return this.http.get<ChecklistResponse[]>(`${this.apiUrl}/checklists`).pipe(
      map((response) => response as Checklist[]),
      catchError((error) => {
        console.error('Error fetching checklists', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get checklist by ID
   * @param id Checklist ID
   * @returns Checklist object
   */
  getChecklistById(id: string): Observable<Checklist> {
    return this.http
      .get<ChecklistResponse>(`${this.apiUrl}/checklists/${id}`)
      .pipe(
        map((response) => response as Checklist),
        catchError((error) => {
          console.error(`Error fetching checklist with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get checklists by type
   * @param type Type of checklist
   * @returns Array of checklist objects
   */
  getChecklistsByType(type: ChecklistType): Observable<Checklist[]> {
    const params = new HttpParams().set('type', type);
    return this.http
      .get<ChecklistResponse[]>(`${this.apiUrl}/checklists`, { params })
      .pipe(
        map((response) => response as Checklist[]),
        catchError((error) => {
          console.error(`Error fetching checklists of type ${type}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create a new checklist
   * @param checklist Checklist data
   * @returns Created checklist
   */
  createChecklist(checklist: ChecklistRequest): Observable<Checklist> {
    return this.http
      .post<ChecklistResponse>(`${this.apiUrl}/checklists`, checklist)
      .pipe(
        map((response) => response as Checklist),
        catchError((error) => {
          console.error('Error creating checklist', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update a checklist
   * @param id Checklist ID
   * @param checklist Updated checklist data
   * @returns Updated checklist
   */
  updateChecklist(
    id: string,
    checklist: ChecklistRequest
  ): Observable<Checklist> {
    return this.http
      .put<ChecklistResponse>(`${this.apiUrl}/checklists/${id}`, checklist)
      .pipe(
        map((response) => response as Checklist),
        catchError((error) => {
          console.error(`Error updating checklist with ID ${id}`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a checklist
   * @param id Checklist ID
   * @returns Boolean indicating success
   */
  deleteChecklist(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/checklists/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting checklist with ID ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  // Inspection Report Management
  /**
   * Get all inspection reports
   * @returns Array of inspection report objects
   */
  getAllInspectionReports(): Observable<InspectionReport[]> {
    return this.http
      .get<InspectionReportSerializer[]>(`${this.apiUrl}/inspection-reports`)
      .pipe(
        map((response) => response as InspectionReport[]),
        catchError((error) => {
          console.error('Error fetching inspection reports', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get inspection report by ID
   * @param id Inspection report ID
   * @returns Inspection report object
   */
  getInspectionReportById(id: string): Observable<InspectionReport> {
    return this.http
      .get<InspectionReportSerializer>(
        `${this.apiUrl}/inspection-reports/${id}`
      )
      .pipe(
        map((response) => response as InspectionReport),
        catchError((error) => {
          console.error(
            `Error fetching inspection report with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  /**
   * Create inspection report
   * @param report Inspection report data
   * @returns Created inspection report
   */
  createInspectionReport(
    report: CreateInspectionReportDto
  ): Observable<InspectionReport> {
    return this.http
      .post<InspectionReportSerializer>(
        `${this.apiUrl}/inspection-reports`,
        report
      )
      .pipe(
        map((response) => response as InspectionReport),
        catchError((error) => {
          console.error('Error creating inspection report', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update inspection report
   * @param id Inspection report ID
   * @param report Updated inspection report data
   * @returns Updated inspection report
   */
  updateInspectionReport(
    id: string,
    report: UpdateInspectionReportDto
  ): Observable<InspectionReport> {
    return this.http
      .put<InspectionReportSerializer>(
        `${this.apiUrl}/inspection-reports/${id}`,
        report
      )
      .pipe(
        map((response) => response as InspectionReport),
        catchError((error) => {
          console.error(
            `Error updating inspection report with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete inspection report
   * @param id Inspection report ID
   * @returns Boolean indicating success
   */
  deleteInspectionReport(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.apiUrl}/inspection-reports/${id}`)
      .pipe(
        catchError((error) => {
          console.error(
            `Error deleting inspection report with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  // Additional utility methods
  scheduleInspection(
    deliveryId: string,
    scheduledDate: Date
  ): Observable<InspectionReport> {
    const request = {
      deliveryId,
      scheduledDate: scheduledDate.toISOString(),
      status: InspectionStatus.PENDING,
    };
    return this.http
      .post<InspectionReportSerializer>(
        `${this.apiUrl}/inspection-reports/schedule`,
        request
      )
      .pipe(
        map((response) => response as InspectionReport),
        catchError((error) => {
          console.error('Error scheduling inspection', error);
          return throwError(() => error);
        })
      );
  }

  approveInspectionReport(
    id: string,
    notes?: string
  ): Observable<InspectionReport> {
    return this.http
      .put<InspectionReportSerializer>(
        `${this.apiUrl}/inspection-reports/${id}/approve`,
        { inspectorNotes: notes }
      )
      .pipe(
        map((response) => response as InspectionReport),
        catchError((error) => {
          console.error(
            `Error approving inspection report with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  rejectInspectionReport(
    id: string,
    notes?: string
  ): Observable<InspectionReport> {
    return this.http
      .put<InspectionReportSerializer>(
        `${this.apiUrl}/inspection-reports/${id}/reject`,
        { inspectorNotes: notes }
      )
      .pipe(
        map((response) => response as InspectionReport),
        catchError((error) => {
          console.error(
            `Error rejecting inspection report with ID ${id}`,
            error
          );
          return throwError(() => error);
        })
      );
  }
}
