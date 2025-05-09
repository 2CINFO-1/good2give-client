import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { InspectionReport } from 'src/app/models/inspection.model';

   @Injectable({
     providedIn: 'root',
   })
   export class InspectionReportService {
     private baseUrl = 'http://localhost:3000/api/inspection-report';

     constructor(private http: HttpClient) {}

     create(report: any): Observable<any> {
       return this.http.post(this.baseUrl, report);
     }

     getAll(): Observable<InspectionReport[]> {
       return this.http.get<InspectionReport[]>(this.baseUrl);
     }

     getById(id: string): Observable<InspectionReport> {
       return this.http.get<InspectionReport>(`${this.baseUrl}/${id}`);
     }

     update(id: string, report: Partial<InspectionReport>): Observable<InspectionReport> {
       return this.http.put<InspectionReport>(`${this.baseUrl}/${id}`, report);
     }

     delete(id: string): Observable<{ message: string }> {
       return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
     }
   }
