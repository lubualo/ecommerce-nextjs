export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  // Add any other user properties you need
}

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerificationCredentials {
  email: string;
  code: string;
  password: string; // Required for auto sign-in after verification
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}