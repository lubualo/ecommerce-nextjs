// Product types matching Go models from ecommerce-go
export interface Product {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updated: string;
  price: number;
  path: string; // Image path
  stock: number;
  categoryId: number;
  categoryPath?: string;
  slug?: string; // URL slug for product pages
}

// Additional interfaces for enhanced functionality
export interface Category {
  id: number;
  name: string;
  path?: string;
  parentId?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updated: string;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  updated: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
