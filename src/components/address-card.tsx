'use client';

import { Address } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, Trash2, Phone } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export default function AddressCard({ address, onEdit, onDelete, isDeleting = false }: AddressCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDelete(address.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <CardTitle className="text-lg">{address.title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            ID: {address.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-medium text-gray-900">{address.name}</p>
          <p className="text-gray-600">{address.address}</p>
          <p className="text-gray-600">
            {address.city}, {address.state} {address.postalCode}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{address.phone}</span>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            className="flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
