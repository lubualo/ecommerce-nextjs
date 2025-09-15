import { Product, Category, ProductsResponse } from '@/types/product';

// Mock categories based on typical ecommerce categories
export const mockCategories: Category[] = [
  { id: 1, name: 'Electronics', path: 'electronics', parentId: undefined },
  { id: 2, name: 'Clothing', path: 'clothing', parentId: undefined },
  { id: 3, name: 'Home & Garden', path: 'home-garden', parentId: undefined },
  { id: 4, name: 'Sports', path: 'sports', parentId: undefined },
  { id: 5, name: 'Books', path: 'books', parentId: undefined },
  { id: 6, name: 'Smartphones', path: 'electronics/smartphones', parentId: 1 },
  { id: 7, name: 'Laptops', path: 'electronics/laptops', parentId: 1 },
  { id: 8, name: 'Men\'s Clothing', path: 'clothing/mens', parentId: 2 },
  { id: 9, name: 'Women\'s Clothing', path: 'clothing/womens', parentId: 2 },
];

// Mock products based on Go Product model
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone with advanced camera system and A17 Pro chip. Features a titanium design and professional-grade camera capabilities.',
    createdAt: '2024-01-15T10:30:00Z',
    updated: '2024-01-20T14:22:00Z',
    price: 999.99,
    path: '/images/iphone-15-pro.jpg',
    stock: 25,
    categoryId: 6,
    categoryPath: 'electronics/smartphones',
    slug: 'iphone-15-pro'
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop with M3 Pro chip, perfect for professionals. Features a stunning Liquid Retina XDR display and all-day battery life.',
    createdAt: '2024-01-10T09:15:00Z',
    updated: '2024-01-18T16:45:00Z',
    price: 2499.99,
    path: '/images/macbook-pro-16.jpg',
    stock: 12,
    categoryId: 7,
    categoryPath: 'electronics/laptops',
    slug: 'macbook-pro-16'
  },
  {
    id: 3,
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning. Perfect for daily wear and athletic activities.',
    createdAt: '2024-01-05T11:20:00Z',
    updated: '2024-01-12T13:30:00Z',
    price: 150.00,
    path: '/images/nike-air-max-270.jpg',
    stock: 50,
    categoryId: 4,
    categoryPath: 'sports',
    slug: 'nike-air-max-270'
  },
  {
    id: 4,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen and advanced AI features. Features a 200MP camera and titanium construction.',
    createdAt: '2024-01-08T08:45:00Z',
    updated: '2024-01-15T12:10:00Z',
    price: 1199.99,
    path: '/images/samsung-galaxy-s24-ultra.jpg',
    stock: 18,
    categoryId: 6,
    categoryPath: 'electronics/smartphones',
    slug: 'samsung-galaxy-s24-ultra'
  },
  {
    id: 5,
    name: 'Dell XPS 13',
    description: 'Ultra-portable laptop with InfinityEdge display. Perfect for productivity and creativity on the go.',
    createdAt: '2024-01-12T14:30:00Z',
    updated: '2024-01-19T10:15:00Z',
    price: 1299.99,
    path: '/images/dell-xps-13.jpg',
    stock: 8,
    categoryId: 7,
    categoryPath: 'electronics/laptops',
    slug: 'dell-xps-13'
  },
  {
    id: 6,
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight-fit jeans made from 100% cotton. Timeless style that never goes out of fashion.',
    createdAt: '2024-01-03T16:20:00Z',
    updated: '2024-01-10T11:45:00Z',
    price: 89.99,
    path: '/images/levis-501-jeans.jpg',
    stock: 75,
    categoryId: 8,
    categoryPath: 'clothing/mens',
    slug: 'levis-501-jeans'
  },
  {
    id: 7,
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes with Boost midsole technology. Designed for serious runners.',
    createdAt: '2024-01-07T12:10:00Z',
    updated: '2024-01-14T15:20:00Z',
    price: 180.00,
    path: '/images/adidas-ultraboost-22.jpg',
    stock: 30,
    categoryId: 4,
    categoryPath: 'sports',
    slug: 'adidas-ultraboost-22'
  },
  {
    id: 8,
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald. A timeless story of the Jazz Age and the American Dream.',
    createdAt: '2024-01-01T09:00:00Z',
    updated: '2024-01-08T14:30:00Z',
    price: 12.99,
    path: '/images/great-gatsby.jpg',
    stock: 100,
    categoryId: 5,
    categoryPath: 'books',
    slug: 'great-gatsby'
  },
  {
    id: 9,
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with 30-hour battery life. Premium sound quality and comfort.',
    createdAt: '2024-01-06T13:45:00Z',
    updated: '2024-01-13T09:20:00Z',
    price: 399.99,
    path: '/images/sony-wh-1000xm5.jpg',
    stock: 22,
    categoryId: 1,
    categoryPath: 'electronics',
    slug: 'sony-wh-1000xm5'
  },
  {
    id: 10,
    name: 'Zara Blazer',
    description: 'Elegant women\'s blazer perfect for office or casual wear. Made from premium wool blend fabric.',
    createdAt: '2024-01-09T15:30:00Z',
    updated: '2024-01-16T12:45:00Z',
    price: 79.99,
    path: '/images/zara-blazer.jpg',
    stock: 40,
    categoryId: 9,
    categoryPath: 'clothing/womens',
    slug: 'zara-blazer'
  },
  {
    id: 11,
    name: 'Garden Hose Set',
    description: '50ft expandable garden hose with spray nozzle. Perfect for watering plants and cleaning outdoor spaces.',
    createdAt: '2024-01-04T10:15:00Z',
    updated: '2024-01-11T16:30:00Z',
    price: 29.99,
    path: '/images/garden-hose-set.jpg',
    stock: 60,
    categoryId: 3,
    categoryPath: 'home-garden',
    slug: 'garden-hose-set'
  },
  {
    id: 12,
    name: 'Out of Stock Product',
    description: 'This product is currently out of stock to test the out-of-stock functionality.',
    createdAt: '2024-01-02T11:00:00Z',
    updated: '2024-01-09T14:15:00Z',
    price: 199.99,
    path: '/images/out-of-stock.jpg',
    stock: 0,
    categoryId: 1,
    categoryPath: 'electronics',
    slug: 'out-of-stock-product'
  }
];

// Helper function to generate mock products response
export function generateMockProductsResponse(
  products: Product[],
  page: number = 1,
  limit: number = 12,
  total?: number
): ProductsResponse {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    total: total || products.length,
    page,
    limit,
    totalPages: Math.ceil((total || products.length) / limit)
  };
}

// Helper function to filter products based on filters
export function filterProducts(products: Product[], filters: any) {
  return products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!product.name.toLowerCase().includes(searchTerm) && 
          !product.description.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    
    // Category filter
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    
    // Stock filter
    if (filters.inStock && product.stock === 0) {
      return false;
    }
    
    return true;
  });
}

// Helper function to sort products
export function sortProducts(products: Product[], sortBy: string, order: string) {
  return [...products].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (order === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
  });
}
