// API Configuration
export const API_CONFIG = {
  // Base URL for the Go backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  
  // Whether to use mock API instead of real API
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || 
                process.env.NODE_ENV === 'development',
  
  // Mock API settings
  MOCK_DELAY_MIN: 200, // Minimum delay in ms
  MOCK_DELAY_MAX: 500, // Maximum delay in ms
};

// Helper function to get the current API mode
export const getApiMode = () => {
  return API_CONFIG.USE_MOCK_API ? 'mock' : 'real';
};

// Helper function to log API mode
export const logApiMode = () => {
  if (typeof window !== 'undefined') {
    console.log(`🔄 API Mode: ${getApiMode().toUpperCase()}`);
    console.log(`📍 API URL: ${API_CONFIG.BASE_URL}`);
  }
};
