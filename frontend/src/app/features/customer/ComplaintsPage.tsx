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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintForm>();

  const { data: bookings } = useQuery({
    queryKey: ['customer-bookings'],
    queryFn: bookingService.getMyBookings,
  });

  const { data: complaintsData, isLoading } = useQuery({
  queryKey: ['my-complaints'],
  queryFn: complaintService.getMy,
});

const complaints = Array.isArray(complaintsData)
  ? complaintsData
  : complaintsData?.data || [];

  const createComplaintMutation = useMutation({
    mutationFn: (data: ComplaintForm) => complaintService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      reset();
    },
    onError: (error: any) => {
  console.log(
    "COMPLAINT ERROR",
    error.response?.data
  );

  toast.error(
    error.response?.data?.message
  );
},
  });

  const onSubmit = (data: ComplaintForm) => {
    createComplaintMutation.mutate(data);
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
          <Button onClick={() => setShowForm(!showForm)}>
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
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <Input
                    id="bookingId"
                    placeholder="Enter booking ID"
                    {...register('bookingId', { required: 'Booking ID is required' })}
                  />
                  {errors.bookingId && <p className="text-sm text-red-500">{errors.bookingId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="againstUserId">Against User ID</Label>
                  <Input
                    id="againstUserId"
                    placeholder="Enter worker/user ID"
                    {...register('againstUserId', { required: 'User ID is required' })}
                  />
                  {errors.againstUserId && <p className="text-sm text-red-500">{errors.againstUserId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    placeholder="Brief reason for complaint"
                    {...register('reason', { required: 'Reason is required' })}
                  />
                  {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your complaint"
                    rows={5}
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <Button type="submit" className="w-full">
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Complaints</h2>
          {isLoading ? (
            <div className="text-center py-12">Loading complaints...</div>
          ) : !complaints || complaints.length === 0 ? (
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
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-neutral-700 dark:text-neutral-300">{complaint.description}</p>
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
