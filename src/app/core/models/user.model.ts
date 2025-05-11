export enum UserRole {
  DONATOR = 'donator',
  ADMIN = 'admin',
  BENEFICIARY = 'beneficiary',
  TRANSPORTER = 'transporter',
  INSPECTOR = 'inspector',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserOrganization {
  name: string;
  role?: string;
  website?: string;
  taxId?: string;
}

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

export interface UserRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
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

export interface UserProfile extends User {
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

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
