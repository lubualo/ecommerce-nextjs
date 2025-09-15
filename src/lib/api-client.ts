import { Product, ProductsResponse, ProductFilters, ProductSort, PaginationParams, Category } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(
    filters?: ProductFilters,
    sort?: ProductSort,
    pagination?: PaginationParams
  ): Promise<ProductsResponse> {
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

  async getProduct(id: number, slug?: string, sortBy?: string, order?: string): Promise<Product> {
    const params = new URLSearchParams();
    params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    if (sortBy) params.append('sort_by', sortBy);
    if (order) params.append('order', order);
    
    const queryString = params.toString();
    return this.request<Product>(`/product?${queryString}`);
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/category');
  }

  async getCategory(id: number, slug?: string): Promise<Category> {
    const params = new URLSearchParams();
    params.append('id', id.toString());
    if (slug) params.append('slug', slug);
    
    const queryString = params.toString();
    return this.request<Category>(`/category?${queryString}`);
  }

  // Search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    return this.request<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const {
  getProducts,
  getProduct,
  getCategories,
  getCategory,
  getSearchSuggestions,
} = apiClient;
