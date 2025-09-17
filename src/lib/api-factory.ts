import { apiClient } from './api-client';
import { mockApiClient } from './mock-api-client';
import { API_CONFIG } from '@/config/api-config';

// Export the appropriate client based on environment
export const client = API_CONFIG.USE_MOCK_API ? mockApiClient : apiClient;

// Export individual methods for convenience
export const {
  getProducts,
  getProduct,
  getCategories,
  getCategory,
  getSearchSuggestions,
} = client;

// Export a flag to check if we're using mock API
export const isUsingMockAPI = API_CONFIG.USE_MOCK_API;

// Log which API we're using
if (typeof window !== 'undefined') {
  console.log(`🔄 Using ${API_CONFIG.USE_MOCK_API ? 'Mock' : 'Real'} API Client`);
  console.log(`📍 API URL: ${API_CONFIG.BASE_URL}`);
}
