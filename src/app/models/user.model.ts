export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  DONATOR = 'donator',
  BENEFICIARY = 'beneficiary',
  TRANSPORTER = 'transporter',
  INSPECTOR = 'inspector',
}

export interface UserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface UserResponse {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends Omit<UserResponse, 'role'> {
  role: UserRole;
  // Additional profile fields can be added here
}

export interface UpdateUserProfileRequest {
  email?: string;
  name?: string;
  avatar?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
