import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const { register, handleSubmit } = useForm<WorkerProfileForm>();

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

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  placeholder="Enter your Aadhaar number"
                  maxLength={12}
                  {...register('aadhaarNumber')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  placeholder="Male/Female/Other"
                  {...register('gender')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillCategory">Skill Category</Label>
                <Select {...register('skillCategory')}>
                  <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    {...register('experience', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary (₹/month)</Label>
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
