import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { bookingService } from '../../services/api';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

export default function MyBookingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
  queryKey: ['customer-bookings'],
  queryFn: bookingService.getMyBookings,
});

const bookings = Array.isArray(data)
  ? data
  : data?.data || [];

  const startServiceMutation = useMutation({
    mutationFn: (id: string) => bookingService.startService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Service started!');
    },
    onError: () => {
      toast.error('Failed to start service');
    },
  });

  const completeServiceMutation = useMutation({
    mutationFn: (id: string) => bookingService.completeService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Service completed!');
    },
    onError: () => {
      toast.error('Failed to complete service');
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Booking cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    },
  });

  const requestReplacementMutation = useMutation({
    mutationFn: (id: string) => bookingService.requestReplacement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-bookings'] });
      toast.success('Replacement requested');
    },
    onError: () => {
      toast.error('Failed to request replacement');
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
      NO_SHOW: 'bg-neutral-100 dark:bg-neutral-900/20 text-neutral-700 dark:text-neutral-300',
    };
    return <Badge className={colors[status] || ''}>{status}</Badge>;
  };

  return (
    <CustomerLayout>
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
              <p className="text-neutral-500">No bookings yet. Find workers to get started!</p>
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
                        Worker: {booking.worker?.user?.name || booking.worker?.name || 'N/A'}
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

                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking.status === 'PENDING' && (
                      <p className="text-sm text-neutral-500 w-full">Waiting for worker response...</p>
                    )}

                    {booking.status === 'ACCEPTED' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => startServiceMutation.mutate(booking.id)}
                        >
                          Start Service
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => requestReplacementMutation.mutate(booking.id)}
                        >
                          Request Replacement
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelBookingMutation.mutate(booking.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {booking.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        onClick={() => completeServiceMutation.mutate(booking.id)}
                      >
                        Complete Service
                      </Button>
                    )}

                    {booking.status === 'COMPLETED' && (
                      <Button size="sm" variant="outline">
                        Leave Review
                      </Button>
                    )}

                    {booking.status === 'NO_SHOW' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => requestReplacementMutation.mutate(booking.id)}
                      >
                        Request Replacement
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
