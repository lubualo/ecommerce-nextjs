'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductFilters, Category } from '@/types/product';
import { X, Filter } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Category[];
  isMobile?: boolean;
}

export function ProductFiltersComponent({ 
  filters, 
  onFiltersChange, 
  categories, 
  isMobile = false 
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  // Sync local state with parent filters when they change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: ProductFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={localFilters.categoryId?.toString() || 'all'}
          onValueChange={(value) => handleFilterChange('categoryId', value === 'all' ? undefined : parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="inStock"
          checked={localFilters.inStock || false}
          onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="inStock">In stock only</Label>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button onClick={handleApplyFilters} className="flex-1">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {filters.search}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, search: undefined })}
                />
              </Badge>
            )}
            {filters.categoryId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categories.find(c => c.id === filters.categoryId)?.name || 'Unknown'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, categoryId: undefined })}
                />
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
                />
              </Badge>
            )}
            {filters.inStock && (
              <Badge variant="secondary" className="flex items-center gap-1">
                In Stock Only
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ ...filters, inStock: undefined })}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="lg:hidden">
        <Button variant="outline" className="w-full justify-start">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {Object.values(filters).filter(v => v !== undefined && v !== '').length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-64 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear all
          </Button>
        )}
      </div>
      <FilterContent />
    </div>
  );
}
