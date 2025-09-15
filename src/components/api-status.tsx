'use client';

import { Badge } from '@/components/ui/badge';
import { isUsingMockAPI } from '@/lib/api-factory';
import { useEffect, useState } from 'react';

export function ApiStatus() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge 
        variant={isUsingMockAPI ? 'secondary' : 'default'}
        className="text-xs"
      >
        {isUsingMockAPI ? 'Mock API' : 'Real API'}
      </Badge>
    </div>
  );
}
