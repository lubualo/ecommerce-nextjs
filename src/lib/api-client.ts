import { Product, ProductsResponse, ProductFilters, ProductSort, PaginationParams, Category } from '@/types/product';
import { UserProfile, UpdateProfileRequest, Address, CreateAddressRequest, UpdateAddressRequest } from '@/types/auth';
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


    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products API
  getProducts = async (
    filters?: ProductFilters,
    sort?: ProductSort,
    pagination?: PaginationParams
  ): Promise<ProductsResponse | Product[]> => {
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
    const params = new URLSearchParams();
    if (id) params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    
    const queryString = params.toString();
    const endpoint = `/category${queryString ? `?${queryString}` : ''}`;
    return this.request<Category[]>(endpoint);
  }

  getCategory = async (id: number, slug?: string): Promise<Category> => {
    const params = new URLSearchParams();
    params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    
    const queryString = params.toString();
    return this.request<Category>(`/category?${queryString}`);
  }

  // Search suggestions
  getSearchSuggestions = async (query: string): Promise<string[]> => {
    return this.request<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // User Profile API
  getUserProfile = async (): Promise<UserProfile> => {
    return this.request<UserProfile>('/user');
  }

  updateUserProfile = async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
    return this.request<UserProfile>('/user', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Address API
  getAddresses = async (): Promise<Address[]> => {
    return this.request<Address[]>('/address');
  }

  createAddress = async (addressData: CreateAddressRequest): Promise<Address> => {
    return this.request<Address>('/address', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  updateAddress = async (id: number, addressData: UpdateAddressRequest): Promise<Address> => {
    return this.request<Address>(`/address/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  deleteAddress = async (id: number): Promise<void> => {
    return this.request<void>(`/address/${id}`, {
      method: 'DELETE',
    });
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
  getUserProfile,
  updateUserProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = apiClient;
