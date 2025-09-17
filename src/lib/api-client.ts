import { Product, ProductsResponse, ProductFilters, ProductSort, PaginationParams, Category } from '@/types/product';
import { getAuthToken } from './auth-utils';
import { API_CONFIG } from '@/config/api-config';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get the auth token
    const authToken = await getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug logging
    console.log(`🌐 API Request:`, {
      method: options.method || 'GET',
      url,
      hasAuth: !!authToken,
      authToken: authToken ? `${authToken.substring(0, 20)}...` : 'No token',
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      console.log(`📡 API Response:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success:`, {
        dataType: Array.isArray(data) ? 'array' : 'object',
        dataLength: Array.isArray(data) ? data.length : 'N/A',
        data: data
      });
      
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // Products API
  getProducts = async (
    filters?: ProductFilters,
    sort?: ProductSort,
    pagination?: PaginationParams
  ): Promise<ProductsResponse | Product[]> => {
    console.log('🔍 getProducts called with:', { filters, sort, pagination });
    
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('category_id', filters.categoryId.toString());
    if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    if (filters?.inStock !== undefined) params.append('in_stock', filters.inStock.toString());
    
    if (sort?.field) params.append('sort_by', sort.field);
    if (sort?.direction) params.append('order', sort.direction);
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const queryString = params.toString();
    const endpoint = `/product${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ProductsResponse>(endpoint);
  }

  getProduct = async (id: number, slug?: string, sortBy?: string, order?: string): Promise<Product> => {
    console.log('🔍 getProduct called with:', { id, slug, sortBy, order });
    
    const params = new URLSearchParams();
    params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    if (sortBy) params.append('sort_by', sortBy);
    if (order) params.append('order', order);
    
    const queryString = params.toString();
    return this.request<Product>(`/product?${queryString}`);
  }

  // Categories API
  getCategories = async (id?: number, slug?: string): Promise<Category[]> => {
    console.log('🔍 getCategories called with:', { id, slug });
    
    const params = new URLSearchParams();
    if (id) params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    
    const queryString = params.toString();
    const endpoint = `/category${queryString ? `?${queryString}` : ''}`;
    return this.request<Category[]>(endpoint);
  }

  getCategory = async (id: number, slug?: string): Promise<Category> => {
    console.log('🔍 getCategory called with:', { id, slug });
    
    const params = new URLSearchParams();
    params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    
    const queryString = params.toString();
    return this.request<Category>(`/category?${queryString}`);
  }

  // Search suggestions
  getSearchSuggestions = async (query: string): Promise<string[]> => {
    console.log('🔍 getSearchSuggestions called with:', { query });
    
    return this.request<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Export individual methods for convenience
export const {
  getProducts,
  getProduct,
  getCategories,
  getCategory,
  getSearchSuggestions,
} = apiClient;
