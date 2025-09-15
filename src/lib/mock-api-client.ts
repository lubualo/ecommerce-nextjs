import { Product, ProductsResponse, ProductFilters, ProductSort, PaginationParams, Category } from '@/types/product';
import { 
  mockProducts, 
  mockCategories, 
  generateMockProductsResponse, 
  filterProducts, 
  sortProducts 
} from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await delay(200 + Math.random() * 300);
    
    // Parse URL and query parameters
    const url = new URL(endpoint, 'http://localhost:3000');
    const params = new URLSearchParams(url.search);
    
    try {
      if (endpoint.startsWith('/product?') && params.has('id') && !params.has('search') && !params.has('category_id')) {
        // Handle single product request (has id param but no search/filter params)
        const id = parseInt(params.get('id') || '0');
        const product = mockProducts.find(p => p.id === id);
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        return product as T;
      } else if (endpoint.startsWith('/product')) {
        // Handle products list request (any /product endpoint with search/filter params)
        const search = params.get('search') || undefined;
        const categoryId = params.get('category_id') ? parseInt(params.get('category_id')!) : undefined;
        const minPrice = params.get('min_price') ? parseFloat(params.get('min_price')!) : undefined;
        const maxPrice = params.get('max_price') ? parseFloat(params.get('max_price')!) : undefined;
        const inStock = params.get('in_stock') === 'true';
        const sortBy = params.get('sort_by') || 'createdAt';
        const order = params.get('order') || 'desc';
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '12');
        
        // Apply filters
        const filters: ProductFilters = {
          search,
          categoryId,
          minPrice,
          maxPrice,
          inStock: inStock || undefined
        };
        
        let filteredProducts = filterProducts(mockProducts, filters);
        
        // Apply sorting
        filteredProducts = sortProducts(filteredProducts, sortBy, order);
        
        // Generate response
        const response = generateMockProductsResponse(filteredProducts, page, limit);
        return response as T;
      } else if (endpoint.startsWith('/category?')) {
        // Handle single category request
        const id = parseInt(params.get('id') || '0');
        const category = mockCategories.find(c => c.id === id);
        
        if (!category) {
          throw new Error('Category not found');
        }
        
        return category as T;
      } else if (endpoint === '/category') {
        // Handle categories list request
        return mockCategories as T;
      } else if (endpoint.startsWith('/search/suggestions')) {
        // Handle search suggestions
        const query = params.get('q') || '';
        const suggestions = [
          'iPhone', 'Samsung', 'MacBook', 'Dell', 'Nike', 'Adidas', 
          'Levi\'s', 'Zara', 'Sony', 'Garden', 'Books', 'Electronics'
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
        
        return suggestions.slice(0, 5) as T;
      }
      
      throw new Error('Endpoint not found');
    } catch (error) {
      console.error('Mock API request failed:', error);
      throw error;
    }
  }

  // Products API
  getProducts = async (
    filters?: ProductFilters,
    sort?: ProductSort,
    pagination?: PaginationParams
  ): Promise<ProductsResponse> => {
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
  getCategories = async (): Promise<Category[]> => {
    return this.request<Category[]>('/category');
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
}

// Create and export the mock API client instance
export const mockApiClient = new MockApiClient();

// Export individual methods for convenience
export const {
  getProducts: getMockProducts,
  getProduct: getMockProduct,
  getCategories: getMockCategories,
  getCategory: getMockCategory,
  getSearchSuggestions: getMockSearchSuggestions,
} = mockApiClient;
