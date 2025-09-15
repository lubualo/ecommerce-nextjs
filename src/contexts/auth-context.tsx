'use client';

import { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { User, AuthState, LoginCredentials, RegisterCredentials, VerificationCredentials } from '@/types/auth';
import { configureAmplify } from '@/config/amplify';
import { parseCognitoError, getFriendlyErrorMessage } from '@/lib/auth-utils';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ isVerificationRequired: boolean; email: string }>;
  verifyEmail: (credentials: VerificationCredentials) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
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
      setState(prev => ({ ...prev, isLoading: true }));
      
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
      const cognitoError = parseCognitoError(error);
      const friendlyMessage = getFriendlyErrorMessage(cognitoError);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(friendlyMessage);
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
      const cognitoError = parseCognitoError(error);
      const friendlyMessage = getFriendlyErrorMessage(cognitoError);
      throw new Error(friendlyMessage);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { isSignUpComplete } = await signUp({
        username: credentials.email,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
          },
          autoSignIn: false, // We'll handle verification manually
        },
      });

      setState(prev => ({ ...prev, isLoading: false }));

      if (isSignUpComplete) {
        // User is immediately signed in (unlikely with email verification)
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
        return { isVerificationRequired: false, email: credentials.email };
      } else {
        // Email verification required
        return { isVerificationRequired: true, email: credentials.email };
      }
    } catch (error) {
      console.error('Error registering:', error);
      const cognitoError = parseCognitoError(error);
      const friendlyMessage = getFriendlyErrorMessage(cognitoError);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(friendlyMessage);
    }
  }, []);

  const verifyEmail = useCallback(async (credentials: VerificationCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await confirmSignUp({
        username: credentials.email,
        confirmationCode: credentials.code,
      });

      // After successful verification, sign in the user
      const { isSignedIn } = await signIn({
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
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      const cognitoError = parseCognitoError(error);
      const friendlyMessage = getFriendlyErrorMessage(cognitoError);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(friendlyMessage);
    }
  }, []);

  const resendVerificationCode = useCallback(async (email: string) => {
    try {
      await resendSignUpCode({
        username: email,
      });
    } catch (error) {
      console.error('Error resending verification code:', error);
      const cognitoError = parseCognitoError(error);
      const friendlyMessage = getFriendlyErrorMessage(cognitoError);
      throw new Error(friendlyMessage);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        verifyEmail,
        resendVerificationCode,
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