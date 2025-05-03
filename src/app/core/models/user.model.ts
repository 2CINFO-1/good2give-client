export enum UserRole {
  DONATOR = 'donator',
  ADMIN = 'admin',
  BENEFICIARY = 'beneficiary',
  TRANSPORTER = 'transporter',
  INSPECTOR = 'inspector',
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

export interface AuthResponse {
  user: User;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
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
  avatar?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
