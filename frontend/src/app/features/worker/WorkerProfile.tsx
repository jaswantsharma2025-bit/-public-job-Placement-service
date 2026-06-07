import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/api';
import type { SkillCategory } from '../../types';

interface WorkerProfileForm {
  aadhaarNumber?: string;
  gender?: string;
  skillCategory?: SkillCategory;
  experience?: number;
  expectedSalary?: number;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export default function WorkerProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, reset } = useForm<WorkerProfileForm>();

  const { data: existingProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: profileService.getWorkerProfile,
    retry: false,
    throwOnError: false,
  });

  // Populate form when profile data arrives (including after page refresh)
  useEffect(() => {
    if (existingProfile) {
      reset({
        aadhaarNumber: existingProfile.aadhaarNumber ?? '',
        gender: existingProfile.gender ?? undefined,
        skillCategory: existingProfile.skillCategory ?? undefined,
        experience: existingProfile.experience ?? undefined,
        expectedSalary: existingProfile.expectedSalary ?? undefined,
        city: existingProfile.city ?? '',
        state: existingProfile.state ?? '',
      });
    }
  }, [existingProfile, reset]);

  const onSubmit = async (data: WorkerProfileForm) => {
    try {
      setLoading(true);
      await profileService.updateWorker(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your professional information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Personal Information</CardTitle>
              <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                Verification Pending
              </Badge>
            </div>
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

        {!existingProfile && !profileLoading && (
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                ⚠ Profile not set up yet
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Complete and save your profile below before you can update your location or availability.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="text-center py-8">Loading profile...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="aadhaarNumber"
                    placeholder="Enter your 12-digit Aadhaar number"
                    maxLength={12}
                    {...register('aadhaarNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillCategory">Skill Category <span className="text-red-500">*</span></Label>
                  <Controller
                    name="skillCategory"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger id="skillCategory">
                          <SelectValue placeholder="Select your skill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAID">Maid</SelectItem>
                          <SelectItem value="COOK">Cook</SelectItem>
                          <SelectItem value="DRIVER">Driver</SelectItem>
                          <SelectItem value="NURSE">Nurse</SelectItem>
                          <SelectItem value="PLUMBER">Plumber</SelectItem>
                          <SelectItem value="ELECTRICIAN">Electrician</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years) <span className="text-red-500">*</span></Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="e.g., 5"
                      {...register('experience', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Expected Salary (₹/month) <span className="text-red-500">*</span></Label>
                    <Input
                      id="expectedSalary"
                      type="number"
                      placeholder="e.g., 15000"
                      {...register('expectedSalary', { valueAsNumber: true })}
                    />
                  </div>
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Verification Status</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your profile will be verified by our admin team within 24-48 hours. Once verified, you'll be able to receive bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    </WorkerLayout>
  );
}