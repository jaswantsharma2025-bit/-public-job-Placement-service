import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { bookingService } from '../../services/api';
import type { BookingType, WorkerProfile } from '../../types';

interface BookingForm {
  bookingType: BookingType;
  subCategoryId: string;
  address: string;
  city: string;
  scheduledDate: string;
  durationMinutes: number;
  servicePrice: number;
  notes?: string;
}

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const worker: WorkerProfile | undefined = location.state?.worker;
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>('INSTANT');

  // Worker's skills — each has subCategoryId + subCategory.name
  const workerSkills = worker?.skills ?? [];

  const { register, handleSubmit, control, formState: { errors } } = useForm<BookingForm>({
    defaultValues: {
      bookingType:   'INSTANT',
      subCategoryId: workerSkills[0]?.subCategoryId ?? '',
      scheduledDate: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: BookingForm) => {
    if (!worker) {
      toast.error('Please select a worker first');
      return;
    }
    if (!data.subCategoryId) {
      toast.error('Please select a service');
      return;
    }

    try {
      setLoading(true);
      await bookingService.create({
        workerId:        worker.userId,
        bookingType,
        subCategoryId:   data.subCategoryId,
        address:         data.address,
        city:            data.city,
        scheduledDate:   data.scheduledDate,
        durationMinutes: Number(data.durationMinutes),
        servicePrice:    Number(data.servicePrice),
        notes:           data.notes,
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

        {/* Selected worker summary */}
        {worker && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Worker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold">{worker.user?.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {workerSkills.map((s) => (
                      <Badge key={s.subCategoryId} variant="secondary" className="text-xs">
                        {s.subCategory?.name}
                      </Badge>
                    ))}
                  </div>
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

              {/* Booking type */}
              <div className="space-y-2">
                <Label>Booking Type</Label>
                <Select value={bookingType} onValueChange={(v) => setBookingType(v as BookingType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INSTANT">Instant Booking</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled Booking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service selection — worker's skills only */}
              <div className="space-y-2">
                <Label htmlFor="subCategoryId">
                  Select Service <span className="text-red-500">*</span>
                </Label>
                {workerSkills.length === 0 ? (
                  <p className="text-sm text-neutral-500">This worker has no skills listed.</p>
                ) : (
                  <Controller
                    name="subCategoryId"
                    control={control}
                    rules={{ required: 'Please select a service' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a service…" />
                        </SelectTrigger>
                        <SelectContent>
                          {workerSkills.map((skill) => (
                            <SelectItem key={skill.subCategoryId} value={skill.subCategoryId}>
                              {skill.subCategory?.name}
                              {skill.subCategory?.category?.name && (
                                <span className="text-neutral-400 ml-1 text-xs">
                                  — {skill.subCategory.category.name}
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.subCategoryId && (
                  <p className="text-sm text-red-500">{errors.subCategoryId.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                <Textarea
                  id="address"
                  placeholder="Enter service address (min 5 characters)"
                  {...register('address', {
                    required: 'Address is required',
                    minLength: { value: 5, message: 'Address must be at least 5 characters' },
                  })}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  {...register('city', {
                    required: 'City is required',
                    minLength: { value: 2, message: 'City must be at least 2 characters' },
                  })}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
              </div>

              {/* Date & Time */}
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">
                  {bookingType === 'SCHEDULED' ? 'Scheduled Date & Time' : 'Date & Time'}
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  {...register('scheduledDate', { required: 'Date and time is required' })}
                />
                {errors.scheduledDate && <p className="text-sm text-red-500">{errors.scheduledDate.message}</p>}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes, minimum 60) <span className="text-red-500">*</span></Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  placeholder="e.g. 120"
                  {...register('durationMinutes', {
                    required: 'Duration is required',
                    min: { value: 60, message: 'Minimum duration is 60 minutes' },
                  })}
                />
                {errors.durationMinutes && <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="servicePrice">Service Price (₹) <span className="text-red-500">*</span></Label>
                <Input
                  id="servicePrice"
                  type="number"
                  placeholder="e.g. 500"
                  {...register('servicePrice', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be positive' },
                  })}
                />
                {errors.servicePrice && <p className="text-sm text-red-500">{errors.servicePrice.message}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions…"
                  {...register('notes')}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading || workerSkills.length === 0}>
                  {loading ? 'Creating…' : 'Create Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}