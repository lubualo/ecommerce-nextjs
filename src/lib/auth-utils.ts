import { AuthError } from 'aws-amplify/auth';

export interface CognitoError {
  code: string;
  message: string;
  name: string;
}

export function parseCognitoError(error: unknown): CognitoError {
  if (error instanceof AuthError) {
    return {
      code: error.name || 'UnknownError',
      message: error.message || 'An unknown error occurred',
      name: error.name || 'AuthError'
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UnknownError',
      message: error.message,
      name: 'Error'
    };
  }

  return {
    code: 'UnknownError',
    message: 'An unexpected error occurred',
    name: 'UnknownError'
  };
}

export function getFriendlyErrorMessage(error: CognitoError): string {
  const errorMessages: Record<string, string> = {
    // Sign Up Errors
    'UsernameExistsException': 'An account with this email already exists. Please try signing in instead.',
    'InvalidPasswordException': 'Password does not meet requirements. Please ensure it has at least 8 characters, including uppercase, lowercase, and numbers.',
    'InvalidParameterException': 'Please check your email format and try again.',
    'CodeMismatchException': 'The verification code you entered is incorrect. Please try again.',
    'ExpiredCodeException': 'The verification code has expired. Please request a new one.',
    'LimitExceededException': 'Too many attempts. Please wait a moment and try again.',
    
    // Sign In Errors
    'NotAuthorizedException': 'Incorrect email or password. Please check your credentials and try again.',
    'UserNotFoundException': 'No account found with this email. Please check your email or create a new account.',
    'UserNotConfirmedException': 'Please verify your email address before signing in. Check your inbox for a verification code.',
    'TooManyRequestsException': 'Too many sign-in attempts. Please wait a moment and try again.',
    
    // General Errors
    'NetworkError': 'Network error. Please check your internet connection and try again.',
    'ServiceError': 'Service temporarily unavailable. Please try again later.',
    'UnknownError': 'An unexpected error occurred. Please try again.',
  };

  return errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
}

export function isNetworkError(error: CognitoError): boolean {
  return error.code === 'NetworkError' || error.message.toLowerCase().includes('network');
}

export function isRetryableError(error: CognitoError): boolean {
  const retryableCodes = [
    'NetworkError',
    'ServiceError',
    'TooManyRequestsException',
    'LimitExceededException'
  ];
  return retryableCodes.includes(error.code);
}

export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
}
