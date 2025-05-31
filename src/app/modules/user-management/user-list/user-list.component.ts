import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  error = '';
  UserRole = UserRole;
  editingUserId: string | null = null;
  updatingRole = false;
  private subscription: Subscription = new Subscription();

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  paginatedUsers: User[] = [];

  // Available roles for dropdown
  availableRoles = [
    { value: UserRole.ADMIN, label: 'Administrator' },
    { value: UserRole.DONATOR, label: 'Donator' },
    { value: UserRole.BENEFICIARY, label: 'Beneficiary' },
    { value: UserRole.TRANSPORTER, label: 'Transporter' },
    { value: UserRole.INSPECTOR, label: 'Inspector' },
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    const usersSub = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.updatePagination();
        this.loading = false;
        this.toastr.success(`Successfully loaded ${users.length} users`);
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        this.toastr.error('Failed to load users');
        console.error('Error loading users:', error);
      },
    });

    this.subscription.add(usersSub);
  }

  trackByUserId(index: number, user: User): string {
    return user._id;
  }

  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.DONATOR:
        return 'Donator';
      case UserRole.BENEFICIARY:
        return 'Beneficiary';
      case UserRole.TRANSPORTER:
        return 'Transporter';
      case UserRole.INSPECTOR:
        return 'Inspector';
      default:
        return role;
    }
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.DONATOR:
        return 'bg-green-100 text-green-800';
      case UserRole.BENEFICIARY:
        return 'bg-blue-100 text-blue-800';
      case UserRole.TRANSPORTER:
        return 'bg-yellow-100 text-yellow-800';
      case UserRole.INSPECTOR:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  onRefresh(): void {
    this.loadUsers();
  }

  onEditUser(user: User): void {
    // Toggle editing mode for this user
    if (this.editingUserId === user._id) {
      this.editingUserId = null;
    } else {
      this.editingUserId = user._id;
    }
  }

  onRoleChange(user: User, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value as UserRole;
    this.onUpdateUserRole(user, newRole);
  }

  onUpdateUserRole(user: User, newRole: UserRole): void {
    if (newRole === user.role) {
      this.toastr.info('No changes made to user role');
      this.editingUserId = null;
      return;
    }

    this.updatingRole = true;
    const oldRole = user.role;

    // Optimistically update the UI
    user.role = newRole;

    // Backend endpoint: PATCH /api/users/:id/role
    const updateUrl = `${environment.apiUrl}/users/${user._id}/role`;

    const updateSub = this.http
      .patch<{ message: string }>(updateUrl, { role: newRole })
      .subscribe({
        next: (response) => {
          this.updatingRole = false;
          this.editingUserId = null;
          this.toastr.success(
            `Successfully updated ${
              user.name
            }'s role to ${this.getRoleDisplayName(newRole)}`
          );
          console.log('Role update response:', response.message);
        },
        error: (error) => {
          // Revert the optimistic update
          user.role = oldRole;
          this.updatingRole = false;
          this.editingUserId = null;

          // Handle different error responses
          if (error.status === 400) {
            this.toastr.error(
              error.error?.message || 'Failed to update user role'
            );
          } else if (error.status === 500) {
            this.toastr.error('Server error occurred while updating user role');
          } else {
            this.toastr.error('Failed to update user role');
          }

          console.error('Error updating user role:', error);
        },
      });

    this.subscription.add(updateSub);
  }

  onCancelEdit(): void {
    this.editingUserId = null;
  }

  isEditing(userId: string): boolean {
    return this.editingUserId === userId;
  }

  onDeleteUser(user: User): void {
    // TODO: Implement user deletion functionality
    this.toastr.warning(`Delete user feature coming soon for ${user.name}`);
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
      this.editingUserId = null; // Cancel any editing when changing pages
    }
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getCurrentPageInfo(): string {
    if (this.users.length === 0) {
      return 'No users';
    }
    const startIndex = (this.currentPage - 1) * this.pageSize + 1;
    const endIndex = Math.min(
      this.currentPage * this.pageSize,
      this.users.length
    );
    return `${startIndex}-${endIndex} of ${this.users.length}`;
  }
}
