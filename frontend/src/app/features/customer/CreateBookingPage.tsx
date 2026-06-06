import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { bookingService } from '../../services/api';
import type { BookingType, SkillCategory } from '../../types';

interface BookingForm {
  bookingType: BookingType;
  serviceCategory: SkillCategory;
  address: string;
  city: string;
  scheduledDate?: string;
  durationMinutes: number;
  servicePrice: number;
  notes?: string;
}

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const worker = location.state?.worker;
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>('INSTANT');

  const { register, handleSubmit, formState: { errors } } = useForm<BookingForm>({
    defaultValues: {
      serviceCategory: worker?.skillCategory || 'MAID',
      bookingType: 'INSTANT',
    }
  });

  const onSubmit = async (data: BookingForm) => {
    if (!worker) {
      toast.error('Please select a worker first');
      return;
    }

    try {
      setLoading(true);
      await bookingService.create({
        workerId: worker.id,
        ...data,
        bookingType,
      });
      toast.success('Booking created successfully!');
      navigate('/customer/bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Booking</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Fill in the details to book a service</p>
        </div>

        {worker && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Worker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{worker.user?.name || worker.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{worker.skillCategory}</p>
                </div>
                <p className="font-bold text-lg">₹{worker.expectedSalary}/month</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingType">Booking Type</Label>
                <Select value={bookingType} onValueChange={(value) => setBookingType(value as BookingType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INSTANT">Instant Booking</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled Booking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCategory">Service Category</Label>
                <Input
                  id="serviceCategory"
                  value={worker?.skillCategory}
                  disabled
                  {...register('serviceCategory')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter service address"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
              </div>

              {bookingType === 'SCHEDULED' && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    {...register('scheduledDate', { required: bookingType === 'SCHEDULED' })}
                  />
                  {errors.scheduledDate && <p className="text-sm text-red-500">Scheduled date is required</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  placeholder="e.g., 120"
                  {...register('durationMinutes', { required: 'Duration is required', min: 1 })}
                />
                {errors.durationMinutes && <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicePrice">Service Price (₹)</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  placeholder="e.g., 500"
                  {...register('servicePrice', { required: 'Price is required', min: 1 })}
                />
                {errors.servicePrice && <p className="text-sm text-red-500">{errors.servicePrice.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions..."
                  {...register('notes')}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
