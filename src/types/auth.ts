export interface User {
  id: string;
  email: string;
  name?: string;
  // Add any other user properties you need
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}