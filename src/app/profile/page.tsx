'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getUserProfile, updateUserProfile, getAddresses, createAddress, updateAddress, deleteAddress } from '@/lib/api-client';
import { UserProfile, UpdateProfileRequest, Address, CreateAddressRequest, UpdateAddressRequest } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User, Mail, MapPin } from 'lucide-react';
import AddressList from '@/components/address-list';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');

  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load user profile
  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  // Load addresses when addresses tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'addresses') {
      loadAddresses();
    }
  }, [isAuthenticated, activeTab]);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      setError(null);
      const profileData = await getUserProfile();
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateProfileRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };

      const updatedProfile = await updateUserProfile(updateData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      
      // Refresh user profile in auth context
      await refreshUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Address management functions
  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      setError(null);
      const addressesData = await getAddresses();
      setAddresses(addressesData);
    } catch (err) {
      console.error('Error loading addresses:', err);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddressCreate = async (addressData: CreateAddressRequest) => {
    try {
      setIsAddressLoading(true);
      setError(null);
      const newAddress = await createAddress(addressData);
      setAddresses(prev => [...prev, newAddress]);
      setSuccess('Address added successfully!');
    } catch (err) {
      console.error('Error creating address:', err);
      setError('Failed to add address. Please try again.');
      throw err;
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleAddressUpdate = async (id: number, addressData: UpdateAddressRequest) => {
    try {
      setIsAddressLoading(true);
      setError(null);
      const updatedAddress = await updateAddress(id, addressData);
      setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
      setSuccess('Address updated successfully!');
    } catch (err) {
      console.error('Error updating address:', err);
      setError('Failed to update address. Please try again.');
      throw err;
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleAddressDelete = async (id: number) => {
    try {
      setIsAddressLoading(true);
      setError(null);
      await deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      setSuccess('Address deleted successfully!');
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address. Please try again.');
      throw err;
    } finally {
      setIsAddressLoading(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 p-0 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and addresses</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'addresses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details. Email cannot be changed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email address cannot be changed</p>
                </div>

                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving || !formData.firstName.trim() || !formData.lastName.trim()}
                    className="flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'addresses' && (
          <AddressList
            addresses={addresses}
            onAddressCreate={handleAddressCreate}
            onAddressUpdate={handleAddressUpdate}
            onAddressDelete={handleAddressDelete}
            isLoading={isLoadingAddresses}
            isCreating={isAddressLoading}
            isUpdating={isAddressLoading}
            isDeleting={isAddressLoading}
          />
        )}
      </div>
    </div>
  );
}
