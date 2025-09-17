'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductFiltersComponent } from '@/components/product-filters';
import { ProductSortComponent } from '@/components/product-sort';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Product, ProductFilters, ProductSort, PaginationParams, Category } from '@/types/product';
import { getProducts, getCategories } from '@/lib/api-factory';
import { Filter, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<ProductSort>({ field: 'created_at', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 12 });
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadCategories();
  }, []);

  // Debounced load products when filters, sort, or pagination changes
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      loadProducts();
    }, 300); // 300ms delay

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [filters, sort, pagination]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts(filters, sort, pagination);
      
      // Handle both array response and object response formats
      if (Array.isArray(response)) {
        // API returns array directly
        setProducts(response);
        setTotalPages(1);
        setTotalProducts(response.length);
      } else {
        // API returns object with products array
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
        setTotalProducts(response.total || 0);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination, toast]);

  const loadCategories = async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };


  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSortChange = (newSort: ProductSort) => {
    setSort(newSort);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const ProductSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${totalProducts} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            isMobile={false}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Mobile Filters Button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFiltersComponent
                      filters={filters}
                      onFiltersChange={(newFilters) => {
                        handleFiltersChange(newFilters);
                        setShowMobileFilters(false);
                      }}
                      categories={categories}
                      isMobile={false}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-4">
                <ProductSortComponent sort={sort} onSortChange={handleSortChange} />
                
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleFiltersChange({})}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
