import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { bookingService } from '../../services/api';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

export default function WorkerBookings() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['worker-bookings'],
    queryFn: bookingService.getWorkerBookings,
  });

  const acceptBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.acceptBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings'] });
      toast.success('Booking accepted!');
    },
    onError: () => {
      toast.error('Failed to accept booking');
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.rejectBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings'] });
      toast.success('Booking rejected');
    },
    onError: () => {
      toast.error('Failed to reject booking');
    },
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      ACCEPTED: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      IN_PROGRESS: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      COMPLETED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      CANCELLED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your service bookings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : !bookings || bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-500">No bookings yet. Make sure you're available to receive bookings!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.serviceCategory}</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Customer: {booking.customer?.name || 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-500" />
                      <span>{booking.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-neutral-500" />
                      <span>₹{booking.servicePrice}</span>
                    </div>
                  </div>

                  {booking.address && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <strong>Address:</strong> {booking.address}
                    </div>
                  )}

                  {booking.notes && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => acceptBookingMutation.mutate(booking.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectBookingMutation.mutate(booking.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {booking.status === 'ACCEPTED' && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Waiting for customer to start service
                    </p>
                  )}

                  {booking.status === 'IN_PROGRESS' && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Service in progress
                    </p>
                  )}

                  {booking.status === 'COMPLETED' && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Service completed successfully
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}
