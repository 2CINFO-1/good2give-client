/**
 * This service is maintained for frontend compatibility only.
 * The backend uses the foodQualitySafety module with inspectionReport service.
 * It delegates all calls to the FoodQualityService.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Inspection,
  InspectionRequest,
  InspectionStatus,
} from '../models/inspection.model';
import { FoodQualityService } from './food-quality.service';
import {
  CreateInspectionReportDto,
  UpdateInspectionReportDto,
} from '../models/inspection-report.model';

@Injectable({
  providedIn: 'root',
})
export class InspectionService {
  constructor(private foodQualityService: FoodQualityService) {}

  /**
   * Get inspections with pagination (delegates to FoodQualityService)
   * @param page Page number
   * @param limit Items per page
   * @returns Array of inspections
   */
  getInspections(
    page: number = 1,
    limit: number = 10
  ): Observable<Inspection[]> {
    return this.foodQualityService
      .getAllInspectionReports()
      .pipe(map((reports) => reports as unknown as Inspection[]));
  }

  /**
   * Get inspection by ID (delegates to FoodQualityService)
   * @param id Inspection ID
   * @returns Inspection object
   */
  getInspectionById(id: string): Observable<Inspection> {
    return this.foodQualityService
      .getInspectionReportById(id)
      .pipe(map((report) => report as unknown as Inspection));
  }

  /**
   * Get inspections by stock ID
   * @param stockId Stock ID
   * @returns Array of inspections
   */
  getInspectionsByStockId(stockId: string): Observable<Inspection[]> {
    // This is a simplified approach - in a real application,
    // you might need to filter by depotId since that's the field that references stock
    return this.foodQualityService
      .getAllInspectionReports()
      .pipe(
        map(
          (reports) =>
            reports.filter(
              (report) => report.depotId === stockId
            ) as unknown as Inspection[]
        )
      );
  }

  /**
   * Create a new inspection (delegates to FoodQualityService)
   * @param inspection Inspection data
   * @returns Created inspection
   */
  createInspection(inspection: InspectionRequest): Observable<Inspection> {
    const reportData: CreateInspectionReportDto = {
      checklistId: inspection.checklistId,
      deliveryId: inspection.deliveryId,
      depotId: inspection.depotId,
      inspectionDate: inspection.inspectionDate,
      scheduledDate: inspection.scheduledDate,
      results: inspection.results || [],
      status: inspection.status || InspectionStatus.PENDING,
      inspectorNotes: inspection.inspectorNotes,
    };

    return this.foodQualityService
      .createInspectionReport(reportData)
      .pipe(map((report) => report as unknown as Inspection));
  }

  /**
   * Update an inspection (delegates to FoodQualityService)
   * @param id Inspection ID
   * @param inspection Updated inspection data
   * @returns Updated inspection
   */
  updateInspection(
    id: string,
    inspection: Partial<InspectionRequest>
  ): Observable<Inspection> {
    const reportData: UpdateInspectionReportDto = {
      checklistId: inspection.checklistId,
      deliveryId: inspection.deliveryId,
      depotId: inspection.depotId,
      inspectionDate: inspection.inspectionDate,
      scheduledDate: inspection.scheduledDate,
      results: inspection.results,
      status: inspection.status,
      inspectorNotes: inspection.inspectorNotes,
    };

    return this.foodQualityService
      .updateInspectionReport(id, reportData)
      .pipe(map((report) => report as unknown as Inspection));
  }

  /**
   * Delete an inspection (delegates to FoodQualityService)
   * @param id Inspection ID
   * @returns Boolean indicating success
   */
  deleteInspection(id: string): Observable<boolean> {
    return this.foodQualityService.deleteInspectionReport(id);
  }

  /**
   * Update inspection status (delegates to FoodQualityService)
   * @param id Inspection ID
   * @param status New status
   * @param notes Optional notes
   * @returns Updated inspection
   */
  updateInspectionStatus(
    id: string,
    status: InspectionStatus,
    notes?: string
  ): Observable<Inspection> {
    // Use the appropriate method based on status
    if (status === InspectionStatus.APPROVED) {
      return this.foodQualityService
        .approveInspectionReport(id, notes)
        .pipe(map((report) => report as unknown as Inspection));
    } else {
      // For other statuses, use the regular update method
      return this.updateInspection(id, {
        status,
        inspectorNotes: notes,
      });
    }
  }
}
