import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { complaintService, bookingService } from '../../services/api';

interface ComplaintForm {
  bookingId: string;
  againstUserId: string;
  reason: string;
  description: string;
}

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ComplaintForm>();

  // Reuse already-cached bookings — no extra fetch
  const { data: bookings = [] } = useQuery({
    queryKey: ['customer-bookings'],
    queryFn: bookingService.getMyBookings,
  });

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: complaintService.getMy,
  });

  const createComplaintMutation = useMutation({
    mutationFn: (data: ComplaintForm) => complaintService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setSelectedBookingId('');
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    },
  });

  // When customer picks a booking, auto-fill bookingId and againstUserId (workerId)
  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setValue('bookingId', bookingId);
    const booking = bookings.find((b: any) => b.id === bookingId);
    if (booking) {
      setValue('againstUserId', booking.workerId);
    }
  };

  const onSubmit = (data: ComplaintForm) => {
    // Ensure description is always a string (API expects string, not undefined)
    createComplaintMutation.mutate({ ...data, description: data.description ?? '' });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      RESOLVED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Complaints</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Submit and track your complaints</p>
          </div>
          <Button onClick={() => { setShowForm(!showForm); reset(); setSelectedBookingId(''); }}>
            {showForm ? 'Cancel' : 'File Complaint'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>File a Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Booking selector — auto-fills IDs */}
                <div className="space-y-2">
                  <Label>Select Booking</Label>
                  {bookings.length > 0 ? (
                    <Select value={selectedBookingId} onValueChange={handleBookingSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a booking to complain about" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookings.map((booking: any) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            <span className="font-mono text-xs">{booking.id.slice(0, 8)}…</span>
                            {' — '}{booking.serviceCategory} · {booking.workerName || 'Worker'} · {booking.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-neutral-500">No bookings found. You need a booking to file a complaint.</p>
                  )}
                </div>

                {/* Hidden fields populated by selector, but still editable as fallback */}
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <Input
                    id="bookingId"
                    placeholder="Auto-filled from selection above"
                    {...register('bookingId', { required: 'Booking ID is required' })}
                  />
                  {errors.bookingId && <p className="text-xs text-red-500">{errors.bookingId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="againstUserId">Against Worker ID</Label>
                  <Input
                    id="againstUserId"
                    placeholder="Auto-filled from selection above"
                    {...register('againstUserId', { required: 'Worker ID is required' })}
                  />
                  {errors.againstUserId && <p className="text-xs text-red-500">{errors.againstUserId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    placeholder="Brief reason for complaint (min 3 characters)"
                    {...register('reason', { required: 'Reason is required', minLength: { value: 3, message: 'Reason must be at least 3 characters' } })}
                  />
                  {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-neutral-400 font-normal">(Optional)</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your complaint"
                    rows={5}
                    {...register('description')}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createComplaintMutation.isPending}>
                  {createComplaintMutation.isPending ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Complaints</h2>
          {isLoading ? (
            <div className="text-center py-12">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-neutral-500">No complaints filed yet</p>
              </CardContent>
            </Card>
          ) : (
            complaints.map((complaint: any) => (
              <Card key={complaint.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{complaint.reason}</CardTitle>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">ID: {complaint.id}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {complaint.description && (
                    <p className="text-neutral-700 dark:text-neutral-300">{complaint.description}</p>
                  )}
                  <p className="text-xs text-neutral-400 font-mono">Booking: {complaint.bookingId}</p>
                  {complaint.adminNotes && (
                    <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm font-medium">Admin Response:</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{complaint.adminNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}