import { apiClient } from './api-client';
import { mockApiClient } from './mock-api-client';

// Check if we should use mock API
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || 
                     process.env.NODE_ENV === 'development';

// Export the appropriate client based on environment
export const client = USE_MOCK_API ? mockApiClient : apiClient;

// Export individual methods for convenience
export const {
  getProducts,
  getProduct,
  getCategories,
  getCategory,
  getSearchSuggestions,
} = client;

// Export a flag to check if we're using mock API
export const isUsingMockAPI = USE_MOCK_API;

// Log which API we're using
if (typeof window !== 'undefined') {
  console.log(`🔄 Using ${USE_MOCK_API ? 'Mock' : 'Real'} API Client`);
}
