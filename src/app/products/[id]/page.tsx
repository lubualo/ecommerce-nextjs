'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';
import { getProduct } from '@/lib/api-factory';
import { useCartStore } from '@/stores/cart-store';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Helper function to check if a string is a valid image URL
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  
  // Check if it's a valid URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(params.id as string);
  const slug = searchParams.get('slug');

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId, slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(
        productId, 
        slug || undefined,
        'created_at',
        'desc'
      );
      setProduct(productData);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    try {
      addItem(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: `${product?.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white p-4">
              <Image
                src={isValidImageUrl(product.path) ? product.path : '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional images placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-white p-2">
                  <Image
                    src={isValidImageUrl(product.path) ? product.path : '/placeholder-product.jpg'}
                    alt={`${product.name} view ${i + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <Badge variant={inStock ? 'default' : 'secondary'}>
                  {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                </Badge>
              </div>
              {product.categoryPath && (
                <Badge variant="outline" className="mb-4">
                  {product.categoryPath}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!inStock || isAdding}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Product ID:</span>
                  <span className="ml-2 text-gray-600">#{product.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span className="ml-2 text-gray-600">{product.stock} units</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(product.updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
