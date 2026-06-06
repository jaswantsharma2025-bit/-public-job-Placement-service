import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/api';

interface ProfileForm {
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export default function CustomerProfile() {
  const { user } = useAuth();
  const {
    data: profileData,
    refetch,
    isLoading,
    error
  } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: profileService.getCustomerProfile,
    retry: false,
  });

  const profile = profileData;
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (profile) {
      reset({
        gender: profile.gender || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        latitude: profile.latitude,
        longitude: profile.longitude,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (
    data: ProfileForm
  ) => {
    try {
      setLoading(true);
      console.log("FORM DATA:", data);

      const payload = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) =>
            value !== '' &&
            value !== null &&
            value !== undefined
        )
      );

      if (profile) {
        console.log("PAYLOAD:", payload);
        await profileService.updateCustomer(payload);
      } else {
        await profileService.createCustomerProfile(payload);
      }

      await refetch();

      toast.success(
        'Profile updated successfully!'
      );
    } catch (error: any) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
        'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="p-8">
          Loading profile...
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={user?.phone} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user?.role} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  {...register('gender')}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your address"
                  {...register('address')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    {...register('city')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    {...register('state')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input

                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 28.6139"
                    {...register('latitude', {
                      setValueAs: (v) =>
                        v === '' ? undefined : Number(v),
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 77.2090"
                    {...register('longitude', {
                      setValueAs: (v) =>
                        v === '' ? undefined : Number(v),
                    })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
