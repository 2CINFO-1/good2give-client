import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mockUsers: User[] = [
    {
      _id: 'trans1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: UserRole.TRANSPORTER,
    },
    {
      _id: 'trans2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: UserRole.TRANSPORTER,
    },
    {
      _id: 'admin1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    },
  ];

  constructor() {}

  getUsers(): Observable<User[]> {
    // Simulate API call delay
    return of(this.mockUsers).pipe(delay(800));
  }

  getUserById(id: string): Observable<User | null> {
    const user = this.mockUsers.find((u) => u._id === id);
    if (!user) {
      return of(null).pipe(delay(800));
    }
    return of(user).pipe(delay(800));
  }
}
