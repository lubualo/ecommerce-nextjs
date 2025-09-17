'use client';

import { useState } from 'react';
import { Address } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin } from 'lucide-react';
import AddressCard from './address-card';
import AddressForm from './address-form';

interface AddressListProps {
  addresses: Address[];
  onAddressCreate: (addressData: any) => Promise<void>;
  onAddressUpdate: (id: number, addressData: any) => Promise<void>;
  onAddressDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function AddressList({
  addresses,
  onAddressCreate,
  onAddressUpdate,
  onAddressDelete,
  isLoading = false,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
}: AddressListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSave = async (addressData: any) => {
    try {
      if (editingAddress) {
        await onAddressUpdate(editingAddress.id, addressData);
      } else {
        await onAddressCreate(addressData);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onAddressDelete(id);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Addresses
          </CardTitle>
          <CardDescription>Manage your saved addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading addresses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Addresses
              </CardTitle>
              <CardDescription>Manage your saved addresses</CardDescription>
            </div>
            <Button onClick={handleAddNew} disabled={showForm || isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Address Form */}
      {showForm && (
        <AddressForm
          address={editingAddress}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isCreating || isUpdating}
        />
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
            <p className="text-gray-600 mb-4">Add your first address to get started</p>
            <Button onClick={handleAddNew} disabled={showForm || isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
