import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
m '../models/inspection.model';

@Injectable({
  providedIn: 'root',
})
export class InspectionService {
  private apiUrl = `${environment.apiUrl}/inspection-report`;

  constructor(private http: HttpClient) {}

  // Fetch all inspection reports
  getAllInspections(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(this.apiUrl);
  }

  // Fetch single inspection report by ID
  getInspectionById(id: string): Observable<Inspection> {
    return this.http.get<Inspection>(`${this.apiUrl}/${id}`);
  }

  // Create a new inspection report
  createInspection(inspection: Partial<Inspection>): Observable<Inspection> {
    return this.http.post<Inspection>(this.apiUrl, inspection);
  }

  // Update inspection report by ID
  updateInspection(id: string, inspection: Partial<Inspection>): Observable<Inspection> {
    return this.http.put<Inspection>(`${this.apiUrl}/${id}`, inspection);
  }

  // Delete inspection report by ID
  deleteInspection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Custom: Update inspection status (partial update using PUT)
  updateInspectionStatus(id: string, status: InspectionStatus): Observable<Inspection> {
    return this.updateInspection(id, { status });
  }

  // Optional: If you support stock-based filtering in the backend
  getInspectionsByStockId(stockId: string): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(`${this.apiUrl}/stock/${stockId}`);
  }
}
