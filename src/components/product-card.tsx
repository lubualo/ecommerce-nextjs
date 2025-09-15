'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem, isInCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem(product, 1);
      onAddToCart?.(product);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const inStock = product.stock > 0;

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}${product.slug ? `?slug=${product.slug}` : ''}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.path || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Out of stock overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-white bg-gray-600">
                  Out of Stock
                </Badge>
              </div>
            )}
            
            {/* Wishlist button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleWishlist();
              }}
            >
              <Heart 
                className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm line-clamp-1">
                {product.name}
              </h3>
              <div className="text-xs text-gray-500">
                Stock: {product.stock}
              </div>
            </div>
            
            <p className="text-xs text-gray-600 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              {product.categoryPath && (
                <Badge variant="outline" className="text-xs">
                  {product.categoryPath}
                </Badge>
              )}
            </div>
          </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!inStock || isAdding}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAdding ? 'Adding...' : isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
