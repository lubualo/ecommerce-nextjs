'use client';

import { useAuth } from '@/contexts/auth-context';
import { getAuthToken } from '@/lib/auth-utils';
import { useState, useEffect } from 'react';

export function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const authToken = await getAuthToken();
      setToken(authToken);
    };
    
    if (isAuthenticated) {
      checkToken();
    }
  }, [isAuthenticated]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔐 Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.email : 'None'}</div>
        <div>Token: {token ? `${token.substring(0, 20)}...` : 'None'}</div>
      </div>
    </div>
  );
}
