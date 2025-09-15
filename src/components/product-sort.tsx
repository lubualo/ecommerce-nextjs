'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductSort } from '@/types/product';

interface ProductSortProps {
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
}

const sortOptions = [
  { value: 'name-asc', label: 'Name: A to Z', field: 'name' as const, direction: 'asc' as const },
  { value: 'name-desc', label: 'Name: Z to A', field: 'name' as const, direction: 'desc' as const },
  { value: 'price-asc', label: 'Price: Low to High', field: 'price' as const, direction: 'asc' as const },
  { value: 'price-desc', label: 'Price: High to Low', field: 'price' as const, direction: 'desc' as const },
  { value: 'createdAt-desc', label: 'Newest First', field: 'createdAt' as const, direction: 'desc' as const },
  { value: 'createdAt-asc', label: 'Oldest First', field: 'createdAt' as const, direction: 'asc' as const },
];

export function ProductSortComponent({ sort, onSortChange }: ProductSortProps) {
  const currentValue = `${sort.field}-${sort.direction}`;

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      onSortChange({
        field: option.field,
        direction: option.direction,
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
