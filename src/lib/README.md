# API Mocking System

This directory contains a comprehensive mocking system that allows you to develop and test the frontend without requiring the Go backend to be running.

## Files

- `api-client.ts` - Real API client for Go backend
- `mock-api-client.ts` - Mock API client with realistic data
- `api-factory.ts` - Factory that switches between mock and real APIs
- `mock-data.ts` - Mock data generators based on Go models
- `api-config.ts` - Configuration for API settings

## How It Works

### 1. Automatic Switching
The system automatically uses mock API in development and real API in production:

```typescript
// In development: Uses mock API
// In production: Uses real API
import { getProducts } from '@/lib/api-factory';
```

### 2. Environment Variables
Control the API mode with environment variables:

```bash
# Use mock API (default in development)
NEXT_PUBLIC_USE_MOCK_API=true

# Use real API
NEXT_PUBLIC_USE_MOCK_API=false

# Set your Go backend URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Mock Data
The mock system includes:
- 12 realistic products based on your Go Product model
- 9 categories with hierarchical structure
- Realistic pricing, stock levels, and descriptions
- Proper filtering, sorting, and pagination
- Network delay simulation (200-500ms)

## Features

### ✅ Complete API Coverage
- Products list with filtering, sorting, pagination
- Individual product details
- Categories list and individual categories
- Search suggestions

### ✅ Realistic Data
- Products match your Go Product struct exactly
- Categories with parent-child relationships
- Varied stock levels (including out-of-stock items)
- Realistic pricing and descriptions

### ✅ Error Handling
- Simulates network errors
- Handles missing products/categories
- Proper error messages

### ✅ Development Tools
- API status indicator (shows "Mock API" or "Real API")
- Console logging of API mode
- Easy switching between modes

## Usage

### Using Mock API (Default in Development)
```typescript
import { getProducts, getProduct } from '@/lib/api-factory';

// This will use mock data in development
const products = await getProducts();
const product = await getProduct(1, 'iphone-15-pro');
```

### Using Real API
```typescript
// Set environment variable
NEXT_PUBLIC_USE_MOCK_API=false

// Or import directly
import { apiClient } from '@/lib/api-client';
const products = await apiClient.getProducts();
```

### Adding More Mock Data
Edit `mock-data.ts` to add more products or categories:

```typescript
export const mockProducts: Product[] = [
  // Add your products here
  {
    id: 13,
    name: 'New Product',
    description: 'Product description',
    // ... other fields
  }
];
```

## Benefits

1. **Faster Development** - No need to wait for backend
2. **Consistent Data** - Same data every time
3. **Edge Case Testing** - Easy to test out-of-stock, errors, etc.
4. **Offline Development** - Works without internet
5. **Easy Switching** - One line change to use real API

## Switching to Real API

When your Go backend is ready:

1. Set `NEXT_PUBLIC_USE_MOCK_API=false`
2. Set `NEXT_PUBLIC_API_URL` to your Go backend URL
3. Deploy and test!

The frontend will automatically switch to using your real Go backend with no code changes needed.
