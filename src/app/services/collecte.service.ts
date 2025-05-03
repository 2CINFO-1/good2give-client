import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Collecte, CollecteStatus } from '../core/models/collecte.model';
import { User, UserRole } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CollecteService {
  private mockCollectes: Collecte[] = [
    {
      _id: '1',
      donation: 'don1',
      status: CollecteStatus.PENDING,
      scheduledDate: new Date(),
      notes: 'Ready for pickup',
      createdAt: new Date(Date.now() - 86400000), // yesterday
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      _id: '2',
      donation: 'don2',
      status: CollecteStatus.ASSIGNED,
      scheduledDate: new Date(Date.now() + 172800000), // day after tomorrow
      notes: 'Assigned to transporter',
      transporter: {
        _id: 'trans1',
        email: 'john@example.com',
        name: 'John Driver',
        role: UserRole.TRANSPORTER,
      },
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000), // yesterday
    },
    {
      _id: '3',
      donation: 'don3',
      status: CollecteStatus.COMPLETED,
      scheduledDate: new Date(Date.now() - 259200000), // 3 days ago
      completedDate: new Date(Date.now() - 259200000),
      notes: 'Successfully collected',
      transporter: {
        _id: 'trans2',
        email: 'alice@example.com',
        name: 'Alice Trucker',
        role: UserRole.TRANSPORTER,
      },
      createdAt: new Date(Date.now() - 345600000), // 4 days ago
      updatedAt: new Date(Date.now() - 259200000), // 3 days ago
    },
  ];

  constructor() {}

  getCollectes(): Observable<Collecte[]> {
    // Simulate API call delay
    return of(this.mockCollectes).pipe(delay(800));
  }

  getCollecteById(id: string): Observable<Collecte | null> {
    const collecte = this.mockCollectes.find((c) => c._id === id);
    if (!collecte) {
      return of(null).pipe(delay(800));
    }
    return of(collecte).pipe(delay(800));
  }

  assignTransporter(
    collecteId: string,
    transporterId: string
  ): Observable<Collecte | null> {
    const collecte = this.mockCollectes.find((c) => c._id === collecteId);
    if (!collecte) {
      return of(null).pipe(delay(800));
    }

    // Update the collecte with the transporter and change status
    collecte.status = CollecteStatus.ASSIGNED;
    collecte.transporter = {
      _id: transporterId,
      email: 'transporter@example.com',
      name: 'Assigned Transporter',
      role: UserRole.TRANSPORTER,
    };
    collecte.updatedAt = new Date();

    return of(collecte).pipe(delay(800));
  }

  createCollecte(collecteData: Partial<Collecte>): Observable<Collecte> {
    // Simulate creating a new collecte
    const newCollecte: Collecte = {
      _id: `coll-${Date.now()}`,
      donation: collecteData.donation || 'default',
      status: CollecteStatus.PENDING,
      scheduledDate: collecteData.scheduledDate || new Date(),
      notes: collecteData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockCollectes.push(newCollecte);
    return of(newCollecte).pipe(delay(800));
  }

  updateCollecteStatus(
    id: string,
    status: CollecteStatus
  ): Observable<Collecte | null> {
    const collecte = this.mockCollectes.find((c) => c._id === id);
    if (!collecte) {
      return of(null).pipe(delay(800));
    }

    collecte.status = status;
    collecte.updatedAt = new Date();

    if (status === CollecteStatus.COMPLETED) {
      collecte.completedDate = new Date();
    }

    return of(collecte).pipe(delay(800));
  }
}
