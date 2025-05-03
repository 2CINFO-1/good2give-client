import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Inspection,
  InspectionStatus,
  FindingType,
  FindingSeverity,
} from '../models/inspection.model';

@Injectable({
  providedIn: 'root',
})
export class InspectionService {
  private apiUrl = `${environment.apiUrl}/inspections`;

  // Mock data for development
  private mockInspections: Inspection[] = [
    {
      _id: 'insp1',
      stockId: 'stock1',
      date: new Date().toISOString(),
      inspector: 'John Doe',
      status: InspectionStatus.COMPLETED,
      notes: 'Regular monthly inspection',
      findings: [
        {
          type: FindingType.QUALITY,
          description: 'Some items close to expiration date',
          severity: FindingSeverity.MEDIUM,
          actionRequired: 'Mark items for priority distribution',
          resolved: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'insp2',
      stockId: 'stock2',
      date: new Date().toISOString(),
      inspector: 'Jane Smith',
      status: InspectionStatus.PENDING,
      notes: 'Follow-up inspection needed',
      findings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor(private http: HttpClient) {}

  getInspections(): Observable<Inspection[]> {
    // Simulate API call with delay
    return of(this.mockInspections).pipe(delay(500));
    // In production use:
    // return this.http.get<Inspection[]>(this.apiUrl);
  }

  getInspectionById(id: string): Observable<Inspection> {
    // Find inspection in mock data
    const inspection = this.mockInspections.find((i) => i._id === id);
    if (inspection) {
      return of(inspection).pipe(delay(300));
    }
    // In production use:
    // return this.http.get<Inspection>(`${this.apiUrl}/${id}`);
    return of({} as Inspection);
  }

  getInspectionsByStockId(stockId: string): Observable<Inspection[]> {
    // Filter inspections by stockId
    const inspections = this.mockInspections.filter(
      (i) => i.stockId === stockId
    );
    return of(inspections).pipe(delay(300));
    // In production use:
    // return this.http.get<Inspection[]>(`${this.apiUrl}/stock/${stockId}`);
  }

  createInspection(inspection: Partial<Inspection>): Observable<Inspection> {
    // Simulate API call with delay
    const newInspection: Inspection = {
      ...inspection,
      _id: 'insp' + (this.mockInspections.length + 1),
      date: new Date().toISOString(),
      status: InspectionStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Inspection;

    this.mockInspections.push(newInspection);
    return of(newInspection).pipe(delay(500));
    // In production use:
    // return this.http.post<Inspection>(this.apiUrl, inspection);
  }

  updateInspection(
    id: string,
    inspection: Partial<Inspection>
  ): Observable<Inspection> {
    // Update mock inspection
    const index = this.mockInspections.findIndex((i) => i._id === id);
    if (index !== -1) {
      const updatedInspection = {
        ...this.mockInspections[index],
        ...inspection,
        updatedAt: new Date().toISOString(),
      };
      this.mockInspections[index] = updatedInspection;
      return of(updatedInspection).pipe(delay(500));
    }
    // In production use:
    // return this.http.put<Inspection>(`${this.apiUrl}/${id}`, inspection);
    return of({} as Inspection);
  }

  deleteInspection(id: string): Observable<void> {
    // Remove from mock data
    const index = this.mockInspections.findIndex((i) => i._id === id);
    if (index !== -1) {
      this.mockInspections.splice(index, 1);
    }
    return of(undefined).pipe(delay(500));
    // In production use:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateInspectionStatus(
    id: string,
    status: InspectionStatus
  ): Observable<Inspection> {
    return this.updateInspection(id, { status });
  }

  resolveInspectionFinding(
    inspectionId: string,
    findingIndex: number
  ): Observable<Inspection> {
    const inspection = this.mockInspections.find((i) => i._id === inspectionId);
    if (inspection && inspection.findings[findingIndex]) {
      inspection.findings[findingIndex].resolved = true;
      return this.updateInspection(inspectionId, {
        findings: inspection.findings,
      });
    }
    return of({} as Inspection);
  }
}
