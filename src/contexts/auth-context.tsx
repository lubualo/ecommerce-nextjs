'use client';

import { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { User, AuthState, LoginCredentials } from '@/types/auth';
import { configureAmplify } from '@/config/amplify';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = { children : ReactNode} 
export function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Configure Amplify on mount
    configureAmplify();
    
    // Check if user is already signed in
    getCurrentUser()
      .then(user => {
        const userInfo: User = {
          id: user.userId,
          email: user.signInDetails?.loginId || '',
          name: user.username
        };
        setState({
          user: userInfo,
          isAuthenticated: true,
          isLoading: false
        });
      })
      .catch(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { isSignedIn, nextStep } = await signIn({ 
        username: credentials.email,
        password: credentials.password,
      });
      
      if (isSignedIn) {
        const userInfo = await getCurrentUser();
        const user: User = {
          id: userInfo.userId,
          email: userInfo.signInDetails?.loginId || '',
          name: userInfo.username
        };
        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        console.log('Additional authentication step required:', nextStep);
        throw new Error('Additional authentication step required');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}